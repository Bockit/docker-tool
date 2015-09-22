Simple tool for using npm-style version and publish commands with your docker images.

To install: `npm i -g docker-tool`

-----

Expects a package.json file with the following properties: (docker.name === `docker: { name: 'foo' }`)

* `docker.name`: name of the image
* `docker.registry`: uri for the registry
* `docker.version`: semver version of the image

If no `docker.version` is provided it will read the top-level version from package.json.

#### Usage

* `docker-tool version (major|minor|patch)` bumps version in package.json.
* `docker-tool publish [--latest]` Builds the current directory (`docker build .`) with a tag combining name, registry and version (`registry/name:version`). Then runs `docker push` with that tag. If you include the `--latest` flag then it will tag the current version as `:latest` and push that as well.
