const asyncAll = require('../db/asyncAll.js');

async function listAll(jobState) {
    let query = ``;
    
    if (jobState == 'completed') {
        query = 'SELECT * FROM archive';
    } else {
        query = `SELECT * FROM job_queue WHERE state = '${jobState}'`;
    }

    try {
        const rows = await asyncAll(query);
        console.table(rows);
    } catch(err) {
        console.log(`job listing failed: ${err.message}`);
    }
}

module.exports = listAll;