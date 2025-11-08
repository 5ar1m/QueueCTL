const asyncRun = require('../db/asyncRun.js');

async function insertNew(jobData, table) {
    let query = ``;
    if (table == 'job_queue') {
        query = `INSERT INTO job_queue(command, created_at, updated_at)
                VALUES(${jobData['command']}, ${jobData['createdAt']}, CURRENT_TIMESTAMP)`;
    } else if (table == 'dead_letter_queue') {
        query = `INSERT INTO dead_letter_queue(id, command, max_retries, created_at, updated_at)
                VALUES(${jobData['id']}, ${jobData['command']}, ${jobData['maxRetries']}, ${jobData['createdAt']}, CURRENT_TIMESTAMP)`;
    } else {
        query = `INSERT INTO archive(id, command, attempts, max_retries, created_at, updated_at)
                VALUES(${jobData['id']}, ${jobData['command']}, ${jobData['attempts']}, ${jobData['maxRetries']}, ${jobData['createdAt']}, CURRENT_TIMESTAMP)`;   
    }

    try {
        await asyncRun(query);
    } catch(err) {
        console.error(`job enqueueing failed: ${err.message}`);
    }
}

module.exports = insertNew;