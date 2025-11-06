const { Command } = require('commander');

/*
command example -> 
    1. queuectl config get default-workers
    2. queuectl config set max-retries 3
*/

const config = new Command('config')
    .description('manage configuration');

// getting the values

const configGet = config.command('get')
    .description('get a configuration value');

configGet
    .command('max-retries')
    .description('get the max job retries')
    .action(() => {
        // logic to get the value
    });

configGet
    .command('backoff-base')
    .description('get the backoff base')
    .action(() => {
        // logic to get the value
    });

configGet
    .command('default-workers')
    .description('get the default numbers of workers')
    .action(() => {
        // logic to get the value
    });

// setting the values

const configSet = config.command('set')
    .description('set a configuration value');

configSet
    .command('max-retries')
    .description('set the max job retries')
    .argument('<value>', 'Number of retries (integer)')
    .action((value) => {
        // logic to set value
    });

configSet
    .command('backoff-base')
    .description('set the backoff base')
    .argument('<value>', 'backoff base (delay = base ^ attempts)')
    .action((value) => {
        // logic to set value
    });

module.exports = config;