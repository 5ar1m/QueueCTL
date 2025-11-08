const { Command } = require('commander');
const insertNew = require('../queue/insertNew.js');

// command example -> queuectl enqueue '{"command": "sleep 2"}'

const enqueue = new Command('enqueue');

enqueue
.description('add a new job to the queue')
.argument('<job-data>', 'the json string containing job details')
.action(async (jobData) => {
    // logic for enqueueing the job to queue
    await insertNew({
        title: jobData['title'],
        command: jobData['command'],
        createdAt: jobData['createdAt'] || 'CURRENT_TIMESTAMP',

    }, 'job_queue');
});

module.exports = enqueue;