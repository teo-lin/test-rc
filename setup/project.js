const fs = require('fs').promises
const run = require('./run.js')
const { log, err } = require('./console.js')

// PROJECT CONFIGURATION
async function setupProject(env) {
    log('START: project setup')

    // Initiate the project
    await run(`nest new ${env.MY_MICROSERVICE_NAME}`)

    // Move into the new nest project directory
    process.chdir(env.MY_MICROSERVICE_NAME)
    await run('nest generate controller weather')
    await run('nest generate service weather')
    await run('nest generate module weather')
    await run('nest generate controller stats')
    await run('nest generate service stats')
    await run('nest generate module stats')
    log('ENDED: nest project setup')

    // Initiate the repository
    // await run('git init') // not initialising, as ths is a nested project, but should be if standalone

    // Initiate the database


    // Add npm dependencies
    await run('npm install --save @types/dotenv dotenv')
    await run('npm install --save ioredis')
    await run('npm install --save @hapi/joi nyc mocha')
    await run('npm install --save @nestjs/axios axios') // needed for nest's HttpService


    // Modify nest source as needed
    await fs.writeFile('./src/main.ts', env.FILE_MAIN.trim())
    await fs.writeFile('./src/app.module.ts', env.FILE_APP_MODULE.trim())
    await fs.writeFile('./src/weather/weather.module.ts', env.FILE_WEATHER_MODULE.trim())
    await fs.writeFile('./src/weather/weather.service.ts', env.FILE_WEATHER_SERVICE.trim())
    await fs.writeFile('./src/weather/weather.controller.ts', env.FILE_WEATHER_CONTROLLER.trim())


    // Add config files
    await fs.writeFile('.env', env.FILE_ENV.trim())
    await fs.writeFile('Dockerfile', env.FILE_DOCKER.trim())
    await fs.writeFile('docker-compose.yml', env.FILE_DOCKER_COMPOSE.trim())

    // Build the app
    await run('npm run build')
    log('ENDED: Project setup')
}

module.exports = setupProject