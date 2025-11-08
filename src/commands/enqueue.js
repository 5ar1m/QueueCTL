const { Command } = require('commander');
const insertNew = require('../queue/insertNew.js');

// command example -> queuectl enqueue '{"command": "sleep 2"}'

const enqueue = new Command('enqueue');

enqueue
.description('add a new job to the queue')
.argument('<job-data>', 'the json string containing job details')
.action(async (jobData) => {
    // logic for enqueueing the job to queue
    const job = JSON.parse(jobData);
    await insertNew({
        title: job['title'],
        command: job['command'],
        createdAt: job['createdAt'] ? `'${job['createdAt']}'` : 'CURRENT_TIMESTAMP' // if inserting the job first time then current time stamp else other option for jobs to be retried
    }, 'job_queue');
});

module.exports = enqueue;