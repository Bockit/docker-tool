#!/usr/bin/env node

var args = require('minimist')(process.argv.slice(2))
var dockerTool = require('../index')

main()

function main () {
    if (args.h || args.help) {
        return printUsage()
    }

    if (args._[0] === 'publish') {
        var params = {}
        if (args['not-latest']) params.latest = false
        if (args._[1]) params.buildPath = args._[1]
        if (args['package-path']) params.packagePath = args['package-path']
        if (args['docker-path']) params.dockerPath = args['docker-path']
        return dockerTool.publish(params, handleError)
    }

    if (args._[0] === 'version') {
        var params = { segment: args._[1] }
        if (args['package-path']) params.packageath = args['package-path']

        return dockerTool.version(params, handleError)
    }

    printUsage()
}

function printUsage () {
    console.error('\nUsage:')
    console.error('  version (major|minor|patch)   Increments version')
    console.error('  publish                       Publishes to the docker registry in package.json')
    console.error("      --not-latest                  Don't set the latest tag")
}

function handleError (err) {
    if (err) {
        console.log(err.message)
        printUsage()
    }
}