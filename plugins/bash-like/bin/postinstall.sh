#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
cd "$SCRIPTDIR/.."

# clean up some bits that aren't friendly with webpack
cd node_modules/diff
node -e 'pjson=require("./package.json"); pjson.main = "dist/diff.min.js"; const { writeFileSync } = require("fs"); writeFileSync("package.json", JSON.stringify(pjson, undefined, 2))'
rm -rf lib runtime.js

cd ..
