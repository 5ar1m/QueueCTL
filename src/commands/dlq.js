const { Command } = require('commander');

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
.action(() => {
    // logic to list all jobs in DLQ
});

dlq
.command('retry')
.description('retry a specific job from the DLQ')
.argument('<job-id>', 'the id of the job to retry')
.action((jobId) => {
    // retry logic
});

module.exports = dlq;