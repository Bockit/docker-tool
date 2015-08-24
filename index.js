var execute = require('./lib/execute')
var publish = require('./lib/publish')
var version = require('./lib/version')
var async = require('./lib/version')

exports.publish = runPublish
exports.version = runVersion

/**
 * Runs the publish commands based on the params passed in. Calls callback
 * when done.
 *
 * - `params`: Object, parameters for the function
 * - `params.cwd` (null): If supplied, will execute in cwd.
 * - `params.latest` (true): Whether or not to also publish under the latest tag
 * - `params.dockerPath` ('/usr/bin/docker'): Path to docker executable
 * - `params.packagePath` ('./package.json'): Path to package.json
 * - `callback`: Called when the commands have been executed
 */
function runPublish (params, callback) {
    params = params || {}
    callback = callback || noop
    publish(params, function (err, commands) {
        if (err) callback(err)
        execute(commands, callback)
    })
}

/**
 * Runs the version commands based on the params passed in. Calls callback
 * when done.
 *
 * - `params`: Object, parameters for the function
 * - `params.segment`: `major`, `minor` or `patch`, determines which segment
 *       of the semver version string to update.
 * - `params.packagePath` ('./package.json'): Path to package.json
 * - `callback`: Called when the version has been bumped
 */
function runVersion (params, callback) {
    callback = callback || noop
    version(params, callback)
}

function noop () {}