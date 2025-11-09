const program = require('./src/commands/cli.js');
const initDB = require('./src/db/initDB.js');

async function main() {
    await initDB();
    program.parse(process.argv);
}

main();