const settingsDir = require('./configDir.js');
const fs = require('fs').promises;
const path = require('path');

const settingsFile = path.join(settingsDir, 'settings.json');

async function updateSettings(settingsFile, data) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(settingsFile, jsonString, 'utf8');
    } catch (err) {
        console.error(`error updating settings: ${err.message}`);
    }
}

function getSettings(settingsFile) {
    try {
        const settings = require(settingsFile);
        return settings;
    } catch (err) {
        console.error(`error updating settings: ${err.message}`);
    }
}