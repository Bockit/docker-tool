module.exports = runCommands

var async = require('async')
var spawn = require('child_process').spawn

function runCommands (cmds, callback) {
    async.eachSeries(cmds, runCommand, callback)
}

function runCommand (cmd, callback) {
    console.log('Running:', cmd.join(' '))
    var cp = spawn(cmd[0], cmd.slice(1))

    cp.stdout.pipe(process.stdout)
    cp.stderr.pipe(process.stderr)

    cp.on('exit', callback)
    cp.on('error', callback)
}