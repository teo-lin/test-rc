// Simulate batch scripting language - system management commands
const { execSync } = require('child_process')
const { log, err } = require('./console.js')

function run(command) {
    try {
        // Simulate the Windows batch script 'call' function 
        // Windows only, replace with relevant runner for linux/macOs as needed
        execSync(command, { stdio: 'inherit' })
    } catch (error) {
        err(`ERROR: Error running command: ${command}`)
        process.exit(1)
    }
}

module.exports = run