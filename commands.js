const { exec } = require('child_process');

function runShellCommand(command, callback) {
    const shellProcess = exec(command);

    shellProcess.stdout.on('data', (data) => {
        callback(null, data);
    });

    shellProcess.stderr.on('data', (data) => {
        callback(data, null);
    });

    shellProcess.on('close', (code) => {
        callback(`Process exited with code ${code}`, null);
    });
}

module.exports = runShellCommand;
