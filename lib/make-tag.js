module.exports = makeTag

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