const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { log, err } = require('./console.js');

function unzip(moduleName, targetFolder) {
    const zipFilePath = path.join(__dirname, `${moduleName}.zip`);
    const unzipStream = zlib.createUnzip();
    const readStream = fs.createReadStream(zipFilePath, { encoding: 'binary' });

    readStream.pipe(unzipStream)
        .on('error', (error) => {
            err(`Error while unzipping ${moduleName}:`, error);
        })
        .pipe(fs.createWriteStream(targetFolder)) // Use a write stream directly to the target folder
        .on('finish', () => {
            log(`CHECK: ${moduleName} extraction completed successfully.`);
        })
        .on('error', (error) => {
            err(`Error while writing extracted ${moduleName}:`, error);
        });
}

module.exports = unzip;
