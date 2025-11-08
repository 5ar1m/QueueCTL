const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./memory.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(`error opening database ${err.message}`);
    } else {
        console.log('connected to the SQLite database');
    }
});

module.exports = db;