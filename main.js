#!/usr/bin/env node

const initSettings = require('./src/utils/initSettings.js');
const initDB = require('./src/db/initDB.js');
const program = require('./src/commands/cli.js');

async function main() {
    await initSettings();
    await initDB();
    program.parse(process.argv);
}

main();