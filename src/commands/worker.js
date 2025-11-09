const { Command } = require('commander');
const { start, stop } = require('../workers/control.js');

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
    let totalWorkers = 0;
    if (!options['count']){
        totalWorkers = 1;
    } else {
        totalWorkers = options['count'];
    }
    start(totalWorkers);
});

// worker stop
worker
.command('stop')
.description('stop running workers gracefully')
.action(async() => {
    // logic to stop the workers
    await stop();
});

module.exports = worker;