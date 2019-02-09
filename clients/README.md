# Kui Client Definitions for Development

A Kui "custom client":

1. defines a theme, in the `themes` subdirectory
2. may introduce plugins, by placing them in the `plugins` subdirectory
3. may leverage existing plugins, by `npm install` of published assets

This directory holds custom client definitions that help with
development of the Kui core. They may also be helpful as examples of
how custom clients are structured. Just be cautious, as there is some
setup logic (namely in the [link-universe
script](./bin/link-universe.sh)) that bootstraps the core files in
such a way that avoids having to publish the core assets to a remote
registry.
