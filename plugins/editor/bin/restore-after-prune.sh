#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
cd "$SCRIPTDIR/.."

rm -rf node_modules/monaco-editor
npm install
