const { Command } = require('commander');

// command example -> queuectl enqueue '{"id": "job1", "command": "sleep 2"}'

const enqueue = new Command('enqueue')
    .description('add a new job to the queue')
    .argument('<job-data>', 'the json string containing job details')
    .action((jobData) => {
          // logic for enqueueing the job to queue
    });

module.exports = enqueue;