module.exports = exports = version
exports.update = update

var fs = require('fs')
var extend = require('xtend')

var DEFAULTS = {
    version: null
  , registry: null
  , packagePath: './package.json'
}

function version (params, callback) {
    params = extend(DEFAULTS, params)
    fs.readFile(params.packagePath, function (err, contents) {
        if (err) return callback(err)

        var definition = JSON.parse(contents)
        var current = definition.version
        definition.version = update(current, whichSegment(params.segment))
        contents = JSON.stringify(definition, null, '  ')

        fs.writeFile(params.packagePath, contents, function (err) {
            if (err) return callback(err)
            console.log('Updated to ', definition.version)
            callback()
        })
    })
}

function update (version, segment) {
    var semver = /(\d+)\.(\d+).(\d+)/
    var matched = version.match(semver)
    if (!matched) throw new Error('Cannot automatically increment semver range')

    var major = +matched[1]
    var minor = +matched[2]
    var patch = +matched[3]

    switch (segment) {
        case 'major':
            major++
            minor = 0
            patch = 0
            break

        case 'minor':
            minor++
            patch = 0
            break

        case 'patch':
            patch++
            break

    }

    return [ major, minor, patch ].join('.')
}

function whichSegment (segment) {
    if (segment === 'patch') return 'patch'
    if (segment === 'minor') return 'minor'
    if (segment === 'major') return 'major'
    throw new Error('No valid semver segment found. Use major, minor or patch')
}