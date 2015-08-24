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
        return dockerTool.publish(params)
    }

    if (args._[0] === 'version') {
        return dockerTool.version({
            segment: args._[1]
        })
    }

    printUsage()
}

function printUsage () {
    console.error('\nUsage:')
    console.error('  version (major|minor|patch)   Increments version')
    console.error('  publish                       Publishes to the docker registry in package.json')
    console.error("      --not-latest                  Don't set the latest tag")
}