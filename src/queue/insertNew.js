const asyncRun = require('../db/asyncRun.js');

async function insertNew(jobData, table) {
    let query = ``;
    if (table == 'job_queue') {
        query = `INSERT INTO job_queue (title, command, created_at)
                VALUES ('${jobData['title']}', '${jobData['command']}', ${jobData['createdAt']})`;
        // some string literals have quotes because those values are to be replaced in sql queries which requires quotes for strings
    } else if (table == 'dead_letter_queue') {
        query = `INSERT INTO dead_letter_queue (id, title, command, max_retries, created_at, updated_at)
                VALUES ('${jobData['id']}', '${jobData['title']}', '${jobData['command']}', ${jobData['maxRetries']}, '${jobData['createdAt']}', CURRENT_TIMESTAMP)`;
    } else {
        query = `INSERT INTO archive (id, title, command, attempts, max_retries, created_at, updated_at)
                VALUES (${jobData['id']}, '${jobData['title']}', '${jobData['command']}', ${jobData['attempts']}, ${jobData['maxRetries']}, '${jobData['createdAt']}', CURRENT_TIMESTAMP)`;   
    }

    try {
        await asyncRun(query);
    } catch(err) {
        console.error(`job enqueueing failed: ${err.message}`);
    }
}

module.exports = insertNew;