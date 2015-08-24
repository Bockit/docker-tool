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

        callback(null, [
            [ '/usr/bin/docker', 'build', '-t', tag, '.' ]
          , [ '/usr/bin/docker', 'push', tag ]
        ])
    })
}