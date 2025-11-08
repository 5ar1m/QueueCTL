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
.description('cli-based background job queue system')
.addCommand(enqueueCommand)
.addCommand(workerCommand)
.addCommand(statusCommand)
.addCommand(listCommand)
.addCommand(dlqCommand)
.addCommand(configCommand);

module.exports = program;