Simple tool for using npm-style version and publish commands with your docker images.

Proper documentation and tests incoming, for now:

-----

Expects a package.json file with the following properties:

* `name`: name of the image
* `registry`: uri for the registry
* `version`: semver version of the image

#### Usage

* `docker version (major|minor|patch)` bumps version in package.json.
* `docker publish` Builds the current directory (`docker build .`) with a tag combining name, registry and version (`registry/name:version`). Then runs `docker push` with that tag.