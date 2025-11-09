#!/usr/bin/env node

const program = require('./src/commands/cli.js');
const { updateSettings } = require('./src/utils/settings.js');
const
const initDB = require('./src/db/initDB.js');

async function main() {
    await updateSettings()
    await initDB();
    program.parse(process.argv);
}

main();