const db = require('./setup.js');

async function asyncRun (query) {
    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else { 
                resolve();
            }
        });
    });
}

module.exports = asyncRun;