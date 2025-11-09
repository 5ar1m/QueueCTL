const { Command } = require('commander');
const { activeWorkers } = require('../workers/control.js');
const { asyncGet } = require('../db/asyncGet.js');

// command example -> queuectl status

const summary = {
    activeWorkers,
    totalPending: 0,
    totalProcessing: 0,
    totalCompleted: 0,
    totalFailed: 0,
    totalDead: 0
}

async function getSummary() {
    const result1 = await asyncGet(`SELECT COUNT(*) AS pending FROM job_queue WHERE state = 'pending'`);
    summary.totalPending = result1['pending'];

    const result2 = await asyncGet(`SELECT COUNT(*) AS processing FROM job_queue WHERE state = 'processing'`);
    summary.totalProcessing = result2['processing'];

    const result3 = await asyncGet(`SELECT COUNT(*) AS completed FROM archive`);
    summary.totalCompleted = result3['completed'];

    const result4 = await asyncGet(`SELECT COUNT(*) AS failed FROM job_queue WHERE state = 'failed'`);
    summary.totalFailed = result2['failed'];

    const result5 = await asyncGet(`SELECT COUNT(*) AS dead FROM dead_letter_queue`);
    summary.totalDead = result5['dead'];
}

const status = new Command('status');

status
.description('get the summary of all job states & active workers')
.action(async () => {
    // logic to get the required status
    console.table(summary);
});

module.exports = status;