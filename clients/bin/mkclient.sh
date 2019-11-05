#!/usr/bin/env bash

#
# Copyright 2019 IBM Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

set -e
set -o pipefail

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

if [ -d kui-stage ]; then
    echo "$(tput setaf 1)kui-stage directory exists, please move it aside$(tput sgr0)"
    exit 1
elif [ -e kui-stage ]; then
    echo "$(tput setaf 1)kui-stage file exists, please move it aside$(tput sgr0)"
    exit 1
fi

tmpdir="kui-stage"
mkdir "$tmpdir"
echo "$(tput setaf 4)staging to kui-stage$(tput sgr0)"

npm run -s pack

cd "$tmpdir"

mkdir plugins
cp -a -L ../clients/default/theme .

echo "$(tput setaf 1)building from scratch$(tput sgr0)"

cat > package.json <<EOF
{
  "name": "kui",
  "version": "0.0.1",
  "description": "",
  "main": "node_modules/@kui-shell/core/main/main.js",
  "scripts": {
    "compile": "kui-compile",
    "watch": "tsc --build . --watch",
    "webpack": "npm run -s pty:nodejs && kui-watch-webpack",
    "proxy": "npm run -s pty:nodejs && kui-run-proxy",
    "pty:rebuild": "if [ -d node_modules/node-pty-prebuilt-multiarch ]; then cd node_modules/node-pty-prebuilt-multiarch && npm run -s install; fi",
    "pty:electron": "if [ -d node_modules/node-pty-prebuilt-multiarch ]; then if [ ! -e node_modules/node-pty-prebuilt-multiarch/.npmrc ]; then cp node_modules/@kui-shell/builder/npmrc node_modules/node-pty-prebuilt-multiarch/.npmrc && npm run -s pty:rebuild; fi; fi",
    "pty:nodejs": "if [ -e node_modules/node-pty-prebuilt-multiarch/.npmrc ]; then rm -f node_modules/node-pty-prebuilt-multiarch/.npmrc; npm run -s pty:rebuild; fi",
    "start": "npm run -s compile && npm run -s pty:electron && electron . shell"
  },
  "keywords": [],
  "author": "",
  "license": "Apache-2.0"
}
EOF

npm install --save-dev /tmp/kui-packs/{*builder*,*test*,*webpack*,*proxy*} typescript electron@6.0.8 spectron@8.0.0 @types/uuid @types/node --save /tmp/kui-packs/{*core*,*plugin-*}
cp package-lock.json "$SCRIPTDIR"/client-package-lock.json
cp package.json "$SCRIPTDIR"/client-package.json
