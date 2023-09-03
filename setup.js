const setupDevTools = require('./setup/devTools.js')
const { getUserInput, setupConfigs } = require('./setup/configs.js')
const insertTemplates = require('./setup/templates.js')
const { setupProject, updateProject } = require('./setup/project.js')

    /** Self documenting automated setup
     * I'll  implement the test requirements programmatically,
     * so it's self documenting and can be easy to follow
     * Essentially, if you simply run "node setup.js", 
     * it will build the app. When done, do "docker compose up" to run it
     * I'll paste the requirements and try to follow as closely as possible */

    ; (async () => {
        // proiectul sa fie publicat pe un repo public - github/gitlab
        // sa se creeze o aplicatie folosind mediul de dezvoltare nodejs(> 12.x.x)
        // sa se foloseasca limbajul de programare Typescript
        /** The setupDevTools() installs all the required tools/apps for 
        * the project: docker, git, nest, redis, vscodium, dbeaver, winget
        * It's designed for a Windows PC, and runs with winget & powershell
        * If you're on a mac/linux, substitute with brew and refactor the command runner
        * I know this should normally be done in batch, powershell, zsh or equivalent,
        * There's a setup.cmd in the setup folder to exemplify that.
        * for the sake of simplicity, I'm gonna assume node is installed and run this with child_process */
        await setupDevTools()

        /** Now lets ask the user for setup preferences etc
        * Normally, I'd use this to input the sensitive information, 
        * but for speed, I've created a function based on templates (next one) */
        const env = await getUserInput()

        // trebuie sa extraga date dintr-o sursa structurata
        // https://www.weatherbit.io/account/dashboard,
        // user: ***** / pass: ***** / email: *****
        // sa se ia temperatura la diferite ore/minute
        // intervalul stabilit intr-un config de .env
        /** Let's generate the file templates for configs (docker, .env, compose, redis, swagger etc)
        * This is bad practice, so I've setup GitGuardian to protect this function
        * However, I wouldn't recommend this approach in production */
        await setupConfigs(env)

        // Finally, let's build the project, with two empty endpoints, weather and stats
        await setupProject(env)

        // Now let's implement the requirements below
        await insertTemplates(env)
        await updateProject(env)
    })()


// Cerintele aplicatiei
// sa se ia temperatura la diferite ore/minute in mod automat repetat pentru 3 locatii la alegere
/**
* DONE: set up a weather module for that
* DONE: set up a stats module to pick temps for 3 procenfigured locations
* NOTE: the 3 locations would normally either be preconfigured or come from the frontend, I'll go with preconfigured for now
* DONE: install @nestjs/schedule for the cron job
* DONE: cronJob using the weather.service, need to test it, today is over the usage limit, cannot test
*/

// sa se defineasca/foloseasca tipuri si interfete
/**
 * DONE: implemented dtos, could optionally move them to proper structure (separate dto folder, separate file for each)
 */

// sa se valideze datele de intrare, modul npm propus: @hapi/joi
/**
 * DONE: dtos for validation
 * DONE: interceptor to validate with joi
 */

// modul npm propus: express
// sa se foloseasca express middleware
/**
 * DONE: using the express version of nest.js
 */

// datele extrase sunt salvate intr-un cache, baza de date propusa: redis
// sa se calculeze media dintre temperatura actuala cu media temperaturilor anterioare
/**
 * DONE: setup redis on docker
 * NOTE: check nest recipe for Redis in the documentation
 * DOIN: cronJob can now save data to redis
 * TODO: update stats.service to do the averages
 * NOTE: use weatherbit_interval=minutely for testing, change to hourly for production.
 * check memory limits for in-memory data store.
 * if risk of overflow, do a moving average rather than average.
 * It's not the same, but temperatures rarely have spikes,
 * so it's a good enough approximation with a minimal memory footprint.
 */

// la cererea pe endpointul /stats sa se ofere
// media temperaturilor pentru o anumita locatie ceruta
// sau in caz ca nu avem locatie specificata se face media tuturor temperaturilor
// in caz ca avem calculul mediei facute in ultimele 5 minute
// valoarea se returneaza din cache in caz contrar se cer datele live,
// se face calculul, se returneaza datele apoi se salveaza informatia in cache
// sa raspunda cu statusuri corespunzatoare
/**
 * TODO: add the desired functionality to the endpoint
 */

// pentru testarea endpointului e nevoie de expunerea lui prin swagger
/**
 * TODO: swagger config
 */
// taskuri bonus:
// unit tests
// modul npm propus: mocha
// acoperire a codului cat mai mare prin teste, caz ideal > 75%
// modul npm propus: nyc
// separare test de src
/**
 * DONE: installed istanbul, mocha; prepared boilerplate and folder structure
 * DONE: 85% test coverage for weather
 * add the following lines to package.json to run them: */
// "test": "mocha --require ts-node/register 'src/weather/**/*.spec.ts'",
// "test:coverage": "nyc npm run test"

// sa se faca un modul de error handling custom care sa logheze informatiile intr-un fisier
/**
 * TODO: docker volume to store the logs
 * TODO: logger middleware (or just use Morgan)
 */

// solutia nu trebuie sa fie un produs final ci mai mult un concept functional
// toate detaliile nespecificate sunt la latitudinea dezvoltatorului
//  si sunt bine venite orice idei de imbunatatire