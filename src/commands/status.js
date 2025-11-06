const { Command } = require('commander');

// command example -> queuectl status

const status = new Command('status')
    .description('get the summary of all job states & active workers')
    .action(() => {
        // logic to get the required status
  });

module.exports = status;