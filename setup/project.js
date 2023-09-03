const fs = require('fs').promises
const path = require('path');
const run = require('./run.js')
const { log, err } = require('./console.js')
const unzip = require('./unzipper.js')

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
    await run('nest generate service redis')
    log('ENDED: nest project setup')

    // Initiate the repository
    // await run('git init') // not initialising, as ths is a nested project, but should be if standalone

    // Initiate the database
    // @TODO add redis configuration

    // Add npm dependencies
    await run('npm install --save @types/dotenv dotenv')
    await run('npm install --save-dev @types/node')
    await run('npm install --save nestjs-redis ioredis @nestjs/schedule')
    await run('npm install --save @hapi/joi nyc mocha chai')
    await run('npm install --save @nestjs/axios axios') // needed for nest's HttpService
    await run('npm install --save @nestjs/swagger swagger-ui-express')

    // Add config files
    await fs.writeFile('.env', env.FILE_ENV.trim())
    await fs.writeFile('Dockerfile', env.FILE_DOCKER.trim())
    await fs.writeFile('docker-compose.yml', env.FILE_DOCKER_COMPOSE.trim())

    log('ENDED: Project setup')
}

// PROJECT REQUIREMENTS
async function updateProject(env) {
    log('START: project requirements update')

    // Modify nest source as needed
    await fs.writeFile('./src/main.ts', env.FILE_MAIN.trim())
    await fs.writeFile('./src/app.module.ts', env.FILE_APP_MODULE.trim())
    await fs.writeFile('./src/stats/stats.controller.ts', env.STATS_CONTROLLER.trim())
    await fs.writeFile('./src/stats/Stats.dto.ts', env.STATS_DTO.trim())
    await fs.writeFile('./src/stats/stats.module.ts', env.STATS_MODULE.trim())
    await fs.writeFile('./src/stats/stats.service.ts', env.STATS_SERVICE.trim())
    await fs.writeFile('./src/weather/weather-validation.interceptor.ts', env.WEATHER_INTERCEPTOR.trim())
    await fs.writeFile('./src/weather/weather-validation.schema.ts', env.WEATHER_SCHEMA.trim())
    await fs.writeFile('./src/weather/weather.controller.ts', env.WEATHER_CONTROLLER.trim())
    await fs.writeFile('./src/weather/Weather.dto.ts', env.WEATHER_DTO.trim())
    await fs.writeFile('./src/weather/weather.module.ts', env.WEATHER_MODULE.trim())
    await fs.writeFile('./src/weather/weather.service.ts', env.WEATHER_SERVICE.trim())
    await fs.writeFile('./src/weather/weather.service.spec.ts', env.WEATHER_SERVICE_SPEC.trim())
    await fs.writeFile('./src/weather/weather.controller.spec.ts', env.WEATHER_CONTROLLER_SPEC.trim())

    // Unzip the weather and stats modules
    const targetFolder = path.join(__dirname, 'src')
    // await unzip('weather', targetFolder)
    // await unzip('stats', targetFolder)

    // Build the app
    await run('npm run build')


    log('ENDED: Project requirements update')
}

module.exports = {
    setupProject,
    updateProject
}