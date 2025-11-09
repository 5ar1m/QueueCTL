const sqlite3 = require('sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');

const dbDir = path.join(os.homedir(), '.queuectl');

if (!fs.existsSync(dbDir)){
    fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, 'memory.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(`error opening database ${err.message}`);
        process.exit(1);
    }
});

module.exports = db;