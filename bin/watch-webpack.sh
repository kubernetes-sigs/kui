#!/usr/bin/env bash

#
# Starts up webpack-dev-server for local development of webpack clients in the monorepo
#
# Options:
#   - CLIENT=alternate|default as an environment variable, you may specify a directory in clients/
#

set -e
set -o pipefail

export CLIENT=${CLIENT-default}

# rebuild the html in case the user has changed CLIENT
npm run build:html

# rebuild the node-pty native code, in case the user is switching from
# electron to webpack (each of which may use a different node ABI)
npm run pty:nodejs

# npm install the webpack support, if we haven't already done so (we
# forgo installing the webpack components initially, due to their
# size)
if [ ! -d node_modules/webpack ]; then
    npm install --no-save --ignore-scripts --no-package-lock ./packages/webpack
fi

# for development purposes, we will need to do a bit of hackery to
# link in the CLIENT theming into the dist/webpack staging area
rm -rf clients/$CLIENT/dist/webpack
mkdir -p clients/$CLIENT/dist/webpack/css
(cd clients/$CLIENT/dist/webpack && \
     ln -sf ../../theme/icons && \
     ln -sf ../../theme/images && \
     cd css && \
     for i in ../../../../../packages/app/web/css/*; do ln -sf $i; done && \
     for i in ../../../theme/css/*; do ln -sf $i; done \
    )

# link in any config.json settings that the CLIENT definition may specify
(cd node_modules/@kui-shell/settings && \
     rm -f config-dev.json; if [ -f ../../../clients/$CLIENT/theme/config.json ]; then echo "linking config-dev.json"; cp ../../../clients/$CLIENT/theme/config.json config-dev.json; fi)

# display extra build progress?
if [ -z "$TRAVIS_JOB_ID" ]; then
    PROGRESS="--progress"
fi

export KUI_MONO_HOME=$(cd ./ && pwd)

# finally, launch webpack-dev-server
webpack-dev-server $PROGRESS --config packages/webpack/webpack.config.js

