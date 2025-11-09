const { Command } = require('commander');
const net = require('net');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { getSettings } = require('../utils/settings.js');

/*
command examples ->
1. queuectl worker start --count 3
2. queuectl worker stop 
*/

const SOCKET_PATH = path.join('/tmp', 'queuectl.sock');
const DAEMON_PATH = path.join(__dirname, '../workers/daemon.js');

async function isDaemonRunning() {
    return fs.existsSync(SOCKET_PATH);
}

async function startDaemon() {
    if (await isDaemonRunning()) {
        return;
    }

    const daemon = await spawn('node', [DAEMON_PATH], {
        detached: true,
        stdio: 'ignore'
    });
    daemon.unref();
    console.log('queuectl daemon started.');
}

async function stopDaemon() {
    if (!(await isDaemonRunning())) return;

    try {
        await sendCommand('DAEMON_STOP');
    } catch (err) {
        console.warn('failed to stop daemon:', err.message);
    }
    console.log('queuectl daemon stopped.');
}

async function sendCommand(message) {
    return new Promise((resolve, reject) => {
        const client = net.createConnection(SOCKET_PATH, () => {
            client.write(message);
        });

        let response = '';
        client.on('data', chunk => (response += chunk.toString()));
        client.on('end', () => resolve(response.trim()));
        client.on('error', (err) => {
            if (err.code === 'ENOENT') {
                reject(new Error(`queuectl daemon is not running; start it using "queuectl daemon start"`));
            } else {
                reject(err);
            }
        });
    });
}

const worker = new Command('worker');
worker.description('manage workers');

// worker start --count x
worker
.command('start')
.description('start one or more workers')
.option('--count <number>', 'number of workers to start', parseInt)
.action(async (options) => {
    // logic to start the workers
    try {
        await startDaemon();

        let totalWorkers = 0;

        if (!options.count) {
            const settings = await getSettings('settings.json');
            totalWorkers = settings['defaultWorkers'];
        } else {
            totalWorkers = options.count;
        }

        const response = await sendCommand(`START ${totalWorkers}`);
        console.log(response);
    } catch (err) {
        console.error(`error starting workers: ${err.message}`);
    }
});

// worker stop
worker
.command('stop')
.description('stop running workers gracefully')
.action(async() => {
    // logic to stop the workers
    try {
        const response = await sendCommand('STOP');
        console.log(response);
    } catch (err) {
        console.error(`error stopping workers: ${err.message}`);
    }

    await stopDaemon();

});

module.exports = worker;