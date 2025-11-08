const { Command } = require('commander');

/*
command example -> 
1. queuectl config get default-workers
2. queuectl config set max-retries 3
*/

const config = new Command('config');
config.description('manage configuration');

// getting the values

const configGet = config.command('get');

configGet
.description('get configuration values')
.option('--max-retries', 'get the max job retries')
.option('--backoff-base', 'get the backoff base')
.option('--default-workers', 'get the default numbers of workers')
.action((options) => {
    // logic to get values
});

// setting the values

const configSet = config.command('set');

configSet
.description('set a configuration value')
.option('--max-retries <number>', 'set the max job retries', parseInt)
.option('--backoff-base <number>', 'set the backoff base', parseFloat)
.option('--default-workers <number>', 'set the default numbers of workers', parseInt)
.action((options) => {
    // logic to set values
});

module.exports = config;