module.exports = publish

var fs = require('fs')
var makeTag = require('./make-tag')
var extend = require('xtend')

var DEFAULTS = {
    version: null
  , registry: null
  , packagePath: './package.json'
  , cwd: null
  , latest: true
  , dockerPath: '/usr/bin/docker'
  , buildPath: '.'
}

function publish (params, callback) {
    params = extend(DEFAULTS, params)

    fs.readFile(params.packagePath, function (err, contents) {
        if (err) return callback(err)

        var definition = JSON.parse(contents)
        try {
            var tag = makeTag(definition)
        }
        catch (err) {
            return callback(err)
        }

        var cmds = []
        cmds.push([ params.dockerPath, 'build', '-t', tag, params.buildPath ])
        if (params.latest) {
            try {
                var latest = makeTag(definition, 'latest')
            }
            catch (err) {
                return callback(err)
            }
            cmds.push([ params.dockerPath, 'tag', '-f', tag, latest ])
        }
        cmds.push([ params.dockerPath, 'push', tag ])
        callback(null, cmds)
    })
}