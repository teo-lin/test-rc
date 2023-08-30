// Extend the vanilla console (optional, de gusto)
const jsLog = console.log
const jsErr = console.error
function log(...args) {
    args = args.map(arg => typeof arg === 'string' ? `${"\x1b[33m"}${arg}${"\x1b[0m"}` : arg)
    jsLog(...args)
}
function err(...args) {
    args = args.map(arg => typeof arg === 'string' ? `${"\x1b[91m"}${arg}${"\x1b[0m"}` : arg)
    jsErr(...args)
}
console.log = log
console.error = err

module.exports = { log, err }