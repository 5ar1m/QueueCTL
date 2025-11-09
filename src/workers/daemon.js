const net = require('net');
const path = require('path');
const fs = require('fs');
const { start, stop, workersCollection } = require('./control.js');

const SOCKET_PATH = path.join('/tmp', 'queuectl.sock');

if (fs.existsSync(SOCKET_PATH)) {
    fs.unlinkSync(SOCKET_PATH);
}

const server = net.createServer((connection) => {
    connection.on('data', async (data) => {
        const message = data.toString().trim();
        const [command, arg] = message.split(' ');

        if (command === 'START') {
            const count = parseInt(arg);
            start(count);
            connection.write(`started ${count} workers\n`);
        } else if (command === 'STOP') {
            await stop();
            connection.write('all workers stopped\n');
        } else if (command === 'STATUS') {
            const activeWorkers = workersCollection.size;
            connection.write(`active workers: ${activeWorkers}\n`);
        } else if (command === 'DAEMON_STOP') {
            try {
                await stop(); // ensure workers are stopped first
            } catch (err) {
                console.error('error stopping workers before shutdown:', err.message);
            }

            // give the cli a moment to receive the response
            connection.end(
                server.close(() => {
                    if (fs.existsSync(SOCKET_PATH)) fs.unlinkSync(SOCKET_PATH);
                    console.log('daemon shut down cleanly.');
                    process.exit(0);
                })
            );
        } else {
            connection.write('unknown command\n');
        }

        connection.end();
    });
});

server.listen(SOCKET_PATH, () => {
    console.log(`QueueCTL daemon running at ${SOCKET_PATH}`);
});
