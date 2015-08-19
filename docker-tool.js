#!/usr/bin/env node

var fs = require('fs')
var spawn = require('child_process').spawn

process.on('uncaughtException', function (err) {
    if (err.message) console.error(err.message)
    exit()
})

main()

function main () {
    fs.readFile('package.json', function (err, contents) {
        if (err) throw err

        var definition = JSON.parse(contents)

        var instruction = process.argv[2]
        var arg = process.argv[3]

        if (instruction === 'publish') return publish(definition)
        if (instruction === 'version' && arg) return version(definition, arg)

        console.error('Unrecognised command')
        exit()
    })
}

function publish (definition) {
    var tag = makeTag(definition)

    build(tag, function () {
        push(tag, function () {
            console.log('Published ' + tag)
        })
    })
}

function build (tag, callback) {
    var cmd = [ '/usr/bin/docker', 'build', '-t', tag, '.' ]
    runCommand(cmd, function (err) {
        if (err) throw err
        if (callback) callback()
    })
}

function push (tag, callback) {
    var cmd = [ 'docker', 'push', tag ]
    runCommand(cmd, function (err) {
        if (err) throw err()
        if (callback) callback()
    })
}

function makeTag (definition) {
    if (! definition.docker && definition.docker.name) {
        throw new Error('Needs a name, make sure docker.name exists in package.json')
    }

    var name = definition.docker.name
    var registry = definition.docker.registry
    var version = definition.version

    var ret = name
    if (registry) ret = registry + '/' + name
    if (version) ret += ':' + version
    return ret
}

function runCommand(cmd, callback) {
    console.log('running', cmd.join(' '))
    var cp = spawn(cmd[0], cmd.slice(1))

    cp.stdout.pipe(process.stdout)
    cp.stderr.pipe(process.stderr)

    cp.on('exit', callback)
    cp.on('error', function (err) {
        throw err
    })
}

function version (definition, type) {
    var current = definition.version
    if (!current) throw new Error('No version in package.json')

    definition.version = update(current, whichType(type))
    var contents = JSON.stringify(definition, null, '  ')

    fs.writeFile('package.json', contents, function (err) {
        if (err) throw err
        console.log(definition.version)
    })
}

function update (version, type) {
    var semver = /(\d+)\.(\d+).(\d+)/
    var matched = version.match(semver)
    if (!matched) throw new Error('Cannot automatically increment semver range')

    var major = +matched[1]
    var minor = +matched[2]
    var patch = +matched[3]

    switch (type) {
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

function whichType (type) {
    if (type === 'patch') return 'patch'
    if (type === 'minor') return 'minor'
    if (type === 'major') return 'major'
    throw new Error('No valid semver type found. Use major, minor or patch')
}

function printUsage () {
    console.error('\nUsage:')
    console.error('  version (major|minor|patch)   Increments version')
    console.error('  publish                       Publishes to the docker registry in package.json')
}

function exit () {
    printUsage()
    process.exit(1)
}