const { Command } = require('commander');
const listAll = require('../queue/listAll.js');
const retry = require('../queue/retry.js');

/*
command example -> 
1. queuectl dlq list
2. queuectl dlq retry job1
*/

const dlq = new Command('dlq');
dlq.description('view or retry DLQ jobs');

dlq
.command('list')
.description('list all jobs in the DLQ')
.action(async () => {
    // logic to list all jobs in DLQ
    const rows = await listAll('dead');
    console.table(rows);
});

dlq
.command('retry')
.description('retry a specific job from the DLQ')
.argument('<job-id>', 'the id of the job to retry', parseInt)
.action(async (jobId) => {
    // retry logic
    if (!jobId) {
        console.error('invalid job id');
    }
    retry(jobId);
});

module.exports = dlq;