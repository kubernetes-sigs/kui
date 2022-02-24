#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR"/../..

cd "$SCRIPTDIR"
npm ci

rm -rf "$1"/lib
cp -a node_modules/node-pty/lib "$1"/lib

