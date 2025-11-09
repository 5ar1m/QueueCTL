const fs = require('fs/promises');
const path = require('path');
const { configDir } = require('./configDir.js');
const { updateSettings } = require('./settings.js');

async function initSettings() {
    const settingsFile = path.join(configDir, 'settings.json');
    try{
        await fs.access(settingsFile);   
    } catch(err) {
        try{
            await updateSettings('settings.json',{
                'maxRetries': 3,
                'backoffBase': 2,
                'defaultWorkers': 1
            });
        } catch(err) {
            process.exit(1);
        }
    }
}

module.exports = initSettings;