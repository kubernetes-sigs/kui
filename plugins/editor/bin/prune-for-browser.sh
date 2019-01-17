#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
cd "$SCRIPTDIR/.."

# remove AMD modules; we'll use the ESM modules for the
# browser/webpack build
rm -rf node_modules/monaco-editor/min node_modules/monaco-editor/dev
