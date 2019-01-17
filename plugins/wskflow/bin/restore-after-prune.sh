#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
cd "$SCRIPTDIR/.."

git checkout package.json
rm -rf node_modules
npm install
