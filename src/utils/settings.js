const fs = require('fs/promises');
const path = require('path');
const { configDir } = require('./configDir.js');

async function updateSettings(fileName, data) {
    try {
        const settingsFile = path.join(configDir, fileName);
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(settingsFile, jsonString, 'utf8');
    } catch (err) {
        console.error(`error updating settings: ${err.message}`);
        throw err;
    }
}

async function getSettings(fileName) {
    try {
        const settingsFile = path.join(configDir, fileName);
        const fileContent = await fs.readFile(settingsFile, 'utf8');
        const settings = JSON.parse(fileContent);
        return settings;
    } catch(err) {
        console.error(`error getting settings: ${err.message}`);
    }
}

module.exports = { updateSettings, getSettings };