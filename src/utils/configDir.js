const path = require('path');
const os = require('os');
const fs = require('fs');

const configDir = path.join(os.homedir(), '.queuectl');

if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
}

module.exports = { configDir };