const sqlite3 = require('sqlite3');
const { configDir } = require('../utils/configDir.js');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(configDir, 'memory.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(`error opening database ${err.message}`);
        process.exit(1);
    }
});

module.exports = db;