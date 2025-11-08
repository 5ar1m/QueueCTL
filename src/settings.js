let maxRetries = 3;
let backoffBase = 2;
let defaultWorkers = 1;

module.exports = { maxRetries, backoffBase, defaultWorkers }

// this is a temporaray solution, need to store the values in a JSON file