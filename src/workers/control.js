const { Worker } = require('worker_threads');
const path = require('path');

const workersCollection = new Map();

function spawnWorker(id) {
    const workerPath = path.join(__dirname, 'source.js');

    const worker = new Worker(workerPath, {
        workerData: { id }
    });

    workersCollection.set(id, worker);
    console.log(`worker ${id} started`);

    worker.on('message', (msg) => {
        console.log(`[worker ${id}] -> ${msg}`);
    });

    worker.on('error', (err) => {
        console.error(`[worker ${id}] -> ERROR:`, err);
    });

    worker.on('exit', (code) => {
        workersCollection.delete(id);
        if (code !== 0) {
            console.error(`[worker ${id}] exited with code ${code}`);
        }
    });
}

function start(count) {
    for (let i = 1; i <= count; i++) {
        spawnWorker(i);
    }
}

async function stop() {
    const promises = [];

    for (const [id, worker] of workersCollection) {
        const exitPromise = new Promise((resolve) => {
            worker.once('exit', () => {
                resolve();
            });
        });
        promises.push(exitPromise);
        worker.postMessage({ type: 'SHUTDOWN' });
    }

    await Promise.all(promises);
    console.log('All workers stopped.');
}

module.exports = { start, stop, workersCollection };