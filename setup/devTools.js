const { execSync } = require('child_process')
const fs = require('fs')
const run = require('./run.js')
const { log, err } = require('./console.js')

// SETUP DEV TOOLS
async function setupDevTools() {
    let existsAt
    // Check if the script is running as an administrator
    try {
        await run('net session')
        log('CHECK: Running with administrator privileges')
    } catch (error) {
        err('ERROR: This script requires administrator privileges. Please run it as an administrator and try again.')
        process.exit(1)
    }

    // Check internet connection
    try {
        await run('ping 8.8.8.8 -n 1 -w 1000')
        await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 2''
        log('CHECK: Internet connection OK')
    } catch (error) {
        err('ERROR: This script requires an active internet connection. Please check your internet connection and try again.')
        process.exit(1)
    }

    // Setup Winget
    try {
        await run('winget -v')
        log('CHECK: Winget is already installed')
    } catch (error) {
        await run('curl.exe -o winget.msixbundle -L https://github.com/microsoft/winget-cli/releases/latest/download/winget.msixbundle')
        await run('start /wait AppInstaller.exe /install winget.msixbundle')
        await run('del winget.msixbundle')
        await run('winget upgrade --all')
        log('ENDED: Winget setup')
    }

    // Setup Git
    try {
        existsAt = execSync('where git').toString().trim()
        log('CHECK: Git is already installed.')
    } catch (error) {
        await run('winget install Git.Git')
        await run('setx /M PATH "%PATH%C:\\Program Files\\Git\\bin"')
        log('ENDED: GitHub login')
    }

    // Setup VSCode
    try {
        existsAt = execSync('where codium').toString().trim()
        log('CHECK: Visual Studio Code is already installed.')
    } catch (error) {
        await run('winget install Microsoft.VisualStudioCode')
        await run('setx /M PATH "%PATH%%LOCALAPPDATA%\\Programs\\Microsoft VS Code\\bin"')
        log('ENDED: Visual Studio Code setup')
    }

    // Setup Docker
    try {
        existsAt = execSync('where docker').toString().trim()
        log('CHECK: Docker Desktop is already installed.')
    } catch (error) {
        await run('winget install Docker.DockerDesktop')
        await run('setx /M PATH "%PATH%C:\\Program Files\\Docker\\Docker\\resources\\binC:\\ProgramData\\DockerDesktop\\version-bin"')
        log('ENDED: Docker setup')
    }

    // // Setup Redis
    // try {
    //     // Set WSL 2 version and launch the distro
    //     log('STARTED: Setting WSL 2 version');
    //     await run('wsl --set-version 2'); // Replace <Distro> with your WSL distro's name
    //     log('ENDED: Setting WSL 2 version');

    //     // Launch the distro
    //     log('STARTED: Launching WSL');
    //     await run('wsl 2'); // Replace <Distro> with your WSL distro's name
    //     log('ENDED: Launching WSL');

    //     // Install Redis inside WSL
    //     log('STARTED: Installing Redis inside WSL');
    //     await run('sudo apt update');
    //     await run('sudo apt install redis-server');
    //     log('ENDED: Installing Redis inside WSL');
    //   } catch (error) {
    //     err(`ERROR: Error during Redis setup: ${error}`);
    //   }

    // Setup dBeaver
    try {
        const dbeaverPath = 'C:\\Users\\Admin\\AppData\\Local\\DBeaver\\dbeaver.exe'
        if (fs.existsSync(dbeaverPath)) {
            log('CHECK: DBeaver is already installed.')
        } else {
            await run('winget install dbeaver.dbeaver')
            log('ENDED: DBeaver setup')
        }
    } catch (error) {
        err(`ERROR: Error during DBeaver setup: ${error}`)
    }

    // Setup Nest.js
    try {
        await run('npm list -g @nestjs/cli')
        log('CHECK: @nestjs/cli is already installed.')
    } catch (error) {
        await run('npm install -g @nestjs/cli')
        log('ENDED: Nest.js setup')
    }

    // Pat yourself on the back
    log('ENDED: Development tools setup finished')
}

module.exports = setupDevTools