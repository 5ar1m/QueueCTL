const asyncRun = require('../src/db/asyncRun.js');

async function clearDB() {
    try {
        await asyncRun("DELETE FROM job_queue");
        await asyncRun("DELETE FROM dead_letter_queue");
        await asyncRun("DELETE FROM archive");

        // to reset autoincrement variables
        await asyncRun("DELETE FROM sqlite_sequence WHERE name='job_queue'");
        await asyncRun("DELETE FROM sqlite_sequence WHERE name='dead_letter_queue'");
        await asyncRun("DELETE FROM sqlite_sequence WHERE name='archive'");
    } catch (err) {
        console.error(`failed to clear database: ${err.message}`);
    }
}

module.exports = clearDB;