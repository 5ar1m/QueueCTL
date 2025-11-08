const program = require('./src/commands/cli.js');
const initDB = require('./src/db/initDB.js');

initDB()
.then(() => {
    program.parse(process.argv);
})