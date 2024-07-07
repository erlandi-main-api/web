const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Fungsi untuk menjalankan perintah shell dan mengirimkan log ke klien
    function runShellCommand(command) {
        const shellProcess = exec(command);

        shellProcess.stdout.on('data', (data) => {
            socket.emit('log', data);
        });

        shellProcess.stderr.on('data', (data) => {
            socket.emit('log', data);
        });

        shellProcess.on('close', (code) => {
            socket.emit('log', `Process exited with code ${code}`);
        });
    }

    // Jalankan perintah `echo hello world` saat klien terhubung
    runShellCommand('echo hello world');

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
