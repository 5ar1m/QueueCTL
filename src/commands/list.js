const { Command, Option } = require('commander');

// command example -> queuectl list --state pending

/*
following states need to be handled ->
1. pending -> waiting to be picked up by a worker
2. processing -> currently being executed
3. completed -> successfully executed
4. failed -> failed, but retryable
note we will handle dead jobs separately using 'dlq' command
*/

const validStates = ['pending', 'processing', 'completed', 'failed'];
const list = new Command('list');

list
.description('list jobs by state')
.addOption(new Option('--state <state>', 'job state to list')
    .choices(validStates)
    .makeOptionMandatory(true)
    .argParser((value) => value.toLowerCase())
)
.action((options) => {
    // logic to handle the listing
});

module.exports = list;