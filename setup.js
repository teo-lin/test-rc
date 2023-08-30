const setupDevTools = require('./setup/devTools.js')
const { getUserInput, setupConfigs } = require('./setup/env.js')
const setupProject = require('./setup/project.js')

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

        // Now lets ask the user for setup preferences etc
        const env = await getUserInput()

        // trebuie sa extraga date dintr-o sursa structurata
        // - https://www.weatherbit.io/account/dashboard,
        // user: rc / pass: rc.001 / email: api@rankingcoach.com
        // sa se ia temperatura la diferite ore/minute
        // (intervalul stabilit intr-un config de .env) 
        // Let's generate the file templates for configs (docker, .env, compose, redis etc)
        await setupConfigs(env)

        // Finally, let's build the project, with two endpoints, weather and stats
        await setupProject(env)
    })()



// Cerintele aplicatiei
// sa se ia temperatura la diferite ore/minute
// in mod automat repetat pentru 3 locatii la alegere
// datele extrase sunt salvate intr-un cache
// baza de date propusa: redis
// sa se valideze datele de intrare
// modul npm propus: @hapi/joi
// sa se calculeze media dintre temperatura actuala cu media temperaturilor anterioare
// la cererea pe endpointul /stats sa se ofere
// media temperaturilor pentru o anumita locatie ceruta
// sau in caz ca nu avem locatie specificata se face media tuturor temperaturilor
// in caz ca avem calculul mediei facute in ultimele 5 minute
//  valoarea se returneaza din cache in caz contrar se cer datele live,
//   se face calculul, se returneaza datele apoi se salveaza informatia in cache
// sa raspunda cu statusuri corespunzatoare
// sa se defineasca/foloseasca tipuri si interfete
// modul npm propus: express
// sa se foloseasca express middleware
// pentru testarea endpointului e nevoie de expunerea lui prin swagger
// taskuri bonus:
// unit tests
// modul npm propus: mocha
// acoperire a codului cat mai mare prin teste, caz ideal > 75%
// modul npm propus: nyc
// separare test de src
// sa se faca un modul de error handling custom care sa logheze informatiile intr-un fisier
// solutia nu trebuie sa fie un produs final ci mai mult un concept functional
// toate detaliile nespecificate sunt la latitudinea dezvoltatorului
//  si sunt bine venite orice idei de imbunatatire