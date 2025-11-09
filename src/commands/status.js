const { Command } = require('commander');
const net = require('net');
const path = require('path');
const asyncGet = require('../db/asyncGet.js');

const SOCKET_PATH = path.join('/tmp', 'queuectl.sock');

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
                // daemon not running
                resolve('0');
            } else {
                reject(err);
            }
        });
    });
}


// command example -> queuectl status

const summary = {
    activeWorkers : 0,
    totalPending: 0,
    totalProcessing: 0,
    totalCompleted: 0,
    totalFailed: 0,
    totalDead: 0
}

async function getSummary() {
    try {
        const response = await sendCommand('STATUS');
        const match = response.match(/active workers: (\d+)/);
        summary.activeWorkers = match ? parseInt(match[1], 10) : 0;
    } catch (err) {
        console.warn('Unable to contact daemon for worker count:', err.message);
    }

    const result1 = await asyncGet(`SELECT COUNT(*) AS pending FROM job_queue WHERE state = 'pending'`);
    summary.totalPending = result1['pending'];

    const result2 = await asyncGet(`SELECT COUNT(*) AS processing FROM job_queue WHERE state = 'processing'`);
    summary.totalProcessing = result2['processing'];

    const result3 = await asyncGet(`SELECT COUNT(*) AS completed FROM archive`);
    summary.totalCompleted = result3['completed'];

    const result4 = await asyncGet(`SELECT COUNT(*) AS failed FROM job_queue WHERE state = 'failed'`);
    summary.totalFailed = result4['failed'];

    const result5 = await asyncGet(`SELECT COUNT(*) AS dead FROM dead_letter_queue`);
    summary.totalDead = result5['dead'];
}

const status = new Command('status');

status
.description('get the summary of all job states & active workers')
.action(async () => {
    // logic to get the required status
    await getSummary();
    console.table(summary);
});

module.exports = status;