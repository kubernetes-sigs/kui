#!/usr/bin/env bash

#
# This utility can help with rebuilding the native node-pty modules on
# a given platform. On Linux and Mac, it should produce a file
# /tmp/pty.node
#
# Parameters:
#   $1: [optional] major version of Electron to target default=11
#

set -e
set -o pipefail

# temporary directory
T=$(mktemp -d)

cd "$T"
npm init -y
npm install node-pty@0.10.1
cd node_modules/node-pty

cat <<EOF > .npmrc
runtime=electron
target=${1-11}.0.0
build_from_source=true
disturl=https://atom.io/download/electron
EOF

echo "Building pty.node in $(pwd)"
echo "Using this npmrc"
cat .npmrc

npm run install
cp build/Release/pty.node /tmp
ls -l /tmp/pty.node

echo "Successfully built /tmp/pty.node"
