const { Command } = require('commander');

/*
command examples ->
    queuectl worker start --count 3
    queuectl worker stop 
*/

const worker = new Command('worker')
    .description('manage workers');

// worker start --count x
worker
    .command('start')
    .description('start workers')
    .option('-c, --count <number>', 'number of workers to start', parseInt)
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