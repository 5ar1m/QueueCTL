const { Command } = require('commander');
const listCommand = require('./list.js');
const workerCommand = require('./worker.js');
const statusCommand = require('./status.js');
const enqueueCommand = require('./enqueue.js');
const dlqCommand = require('./dlq.js');
const configCommand = require('./config.js');

const program = new Command();

program
    .version('1.0.0')
    .description('A command-line tool for managing workers, jobs, and config.');

program.addCommand(enqueueCommand);
program.addCommand(workerCommand);
program.addCommand(statusCommand);
program.addCommand(listCommand);
program.addCommand(dlqCommand);
program.addCommand(configCommand);

module.exports = program;