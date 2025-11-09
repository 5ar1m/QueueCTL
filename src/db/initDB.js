const asyncRun = require('./asyncRun.js');
const { getSettings } = require('../utils/settings.js');

const maxRetries = getSettings()['maxRetries'];

const createJQ = `CREATE TABLE IF NOT EXISTS job_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                command TEXT NOT NULL,
                state TEXT DEFAULT 'pending',
                attempts INTEGER DEFAULT 0,
                max_retries INTEGER DEFAULT ${maxRetries},
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;

const createDLQ = `CREATE TABLE IF NOT EXISTS dead_letter_queue (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                command TEXT NOT NULL,
                max_retries INTEGER DEFAULT ${maxRetries},
                log TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;

const createArchive = `CREATE TABLE IF NOT EXISTS archive (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                command TEXT NOT NULL,
                attempts INTEGER DEFAULT 0,
                max_retries INTEGER DEFAULT ${maxRetries},
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;

async function initDB() {
    try {
        await asyncRun(createJQ);
        await asyncRun(createDLQ);
        await asyncRun(createArchive);
    } catch (err) {
        console.error(`db initialization failed: ${err.message}`);
        process.exit(1);
    }
}

module.exports = initDB;