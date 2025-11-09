const asyncGet = require('../db/asyncGet.js');
const asyncRun = require('../db/asyncRun.js');

async function retry(jobID) {
    try {
        await asyncRun('BEGIN TRANSACTION');
        const job = await asyncGet(
            `SELECT title, command, max_retries, created_at 
            FROM dead_letter_queue WHERE id = ${jobID}`
        );

        if (!job) {
            throw new Error(`job with id ${jobID} not found in dead_letter_queue`);
        }

        const query = `INSERT INTO job_queue (title, command, max_retries, created_at)
                        VALUES ('${job['title']}', '${job['command']}', ${job['max_retries']}, '${job['created_at']}')`;

        await asyncRun(query);

        await asyncRun(`DELETE FROM dead_letter_queue WHERE id = ${jobID}`);

        await asyncRun('COMMIT');

        console.log(`job ${jobID} ('${job.title}') successfully re-queued.`);

    } catch(err) {
        await asyncRun('ROLLBACK');
        console.error(`failed to re-queue job ${jobID}: ${err.message}`);
    }
}

module.exports = retry;