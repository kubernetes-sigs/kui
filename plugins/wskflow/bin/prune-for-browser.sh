#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
cd "$SCRIPTDIR/.."

export CLOUDSHELL_INSTALL_UI=true

jq 'del(.dependencies."chokidar")' package.json > package.json-tmp \
   && mv package.json-tmp package.json
