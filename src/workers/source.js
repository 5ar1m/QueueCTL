const { parentPort } = require('worker_threads');
const { exec } = require('child_process');
const { asyncGet } = require('../db/asyncGet.js');
const { asyncRun } = require('../db/asyncRun.js');
const { insertNew } = require('../queue/insertNew.js');
const { getSettings } = require('../utils/settings.js');

let isRunning = true;

async function claimJob() {
    const candidate = await asyncGet(
        `SELECT id, command, attempts, max_retries FROM job_queue 
         WHERE state = 'pending' 
         ORDER BY id ASC LIMIT 1`
    );

    if(!candidate) {
        return null;
    }

    const result = await asyncRun(
        `UPDATE job_queue 
         SET state = 'processing', attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ${candidate['id']} AND state = 'pending'`
    );

    if (result.changes > 0){
        return candidate
    } else {
        return null;
    }
}

async function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr});
            } else {
                resolve(stdout);
            }
        });
    });
}

async function handleSuccess(job) {
    await asyncRun('BEGIN TRANSACTION');
    try {
        await insertNew(job, 'archive');
        await asyncRun(`DELETE FROM job_queue WHERE id = ${job['id']}`);
        await asyncRun('COMMIT');
        parentPort.postMessage(`${job['id']}: ${job['title']} processed successfully`);
    } catch (err) {
        await asyncRun('ROLLBACK');
        throw err;
    }
}

async function handleFailure(job) {
    const isFatal = job['attempts'] >= job['max_retries'];

    if (isFatal) {
        await dbRun('BEGIN TRANSACTION');
        try {
            // move to dead_letter_queue
            await insertNew(job, 'dead_letter_queue')
            await asyncRun(`DELETE FROM job_queue WHERE id = ${job['id']}`);
            await asyncRun('COMMIT');
            parentPort.postMessage(`${job['id']}: ${job['title']} moved to DLQ`);
        } catch (err) {
            await asyncRun('ROLLBACK');
            throw err;
        }
    } else {
        const settings = await getSettings('settings.json');
        const backoffBase = settings['backoffBase'];
        await new Promise(resolve => setTimeout(resolve, (backoffBase**job['attempts']) * 1000));
        await asyncRun(
            `UPDATE job_queue 
             SET state = 'pending', updated_at = CURRENT_TIMESTAMP 
             WHERE id = ${job['id']}`
        );
        parentPort.postMessage(`${job['id']}: ${job['title']} queued to retry`);
    }
}

async function workLoop() {
    while (isRunning) {
        try {
            const job = await claimJob();

            if (job) {
                parentPort.postMessage(`processing job ${job['id']}: ${job['title']}`);
                try {
                    await executeCommand(job['command']);
                    await handleSuccess(job);
                } catch (err) {
                    await handleFailure(job);
                }
            } else {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (err) {
            parentPort.postMessage(`worker error: ${err.message}`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

parentPort.on('message', (msg) => {
    if (msg.type === 'SHUTDOWN'){
        isRunning = false;
    }
});

workLoop();