const path = require('path');
const os = require('os');
const fs = require('fs');

const configDir = path.join(os.homedir(), '.queuectl');

module.exports = { configDir };