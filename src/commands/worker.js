const { Command } = require('commander');

/*
command examples ->
1. queuectl worker start --count 3
2. queuectl worker stop 
*/

const worker = new Command('worker');
worker.description('manage workers');

// worker start --count x
worker
.command('start')
.description('start one or more workers')
.option('--count <number>', 'number of workers to start', parseInt)
.action((options) => {
    // logic to start the workers
});

// worker stop
worker
.command('stop')
.description('stop running workers gracefully')
.action(() => {
    // logic to stop the workers
});

module.exports = worker;