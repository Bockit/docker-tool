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
}

function publish (params, callback) {
    params = extend(DEFAULTS, params)

    fs.readFile(params.packagePath, function (err, contents) {
        if (err) return callback(err)

        var definition = JSON.parse(contents)
        var tag = makeTag(definition)

        var cmds = []
        cmds.push([ '/usr/bin/docker', 'build', '-t', tag, '.' ])
        if (params.latest) {
            var latest = makeTag(definition, 'latest')
            cmds.push([ '/usr/bin/docker', 'tag', '-f', tag, latest ])
        }
        cmds.push([ '/usr/bin/docker', 'push', tag ])
        callback(null, cmds)
    })
}