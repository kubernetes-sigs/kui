#!/usr/bin/env bash

#
# Copyright 2017 The Kubernetes Authors
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

# for compile.js below; give it an absolute path
export CLIENT_HOME=${CLIENT_HOME-`pwd`}
export PLUGIN_ROOT="$(cd "$TOPDIR" && pwd)/plugins"

# make typescript happy, until we have the real prescan model ready
# (produced by builder/lib/configure.js, but which cannot be run
# until after we've compiled the source)
mkdir -p ./node_modules/@kui-shell
touch ./node_modules/@kui-shell/prescan.json

# pre-compile plugin registry
if [ -f ./node_modules/@kui-shell/builder/dist/bin/compile.js ]; then
    echo "compiling plugin registry $CLIENT_HOME"
    node ./node_modules/@kui-shell/builder/dist/bin/compile.js
fi

# generate the index.json in @kui-shell/client/notebooks/index.json
if [ -d node_modules/@kui-shell/client/notebooks ]; then
    echo "Generating client-guidebooks.json"
    if [ ! -d node_modules/@kui-shell/build/ ]; then
        mkdir node_modules/@kui-shell/build
    fi
    (echo -n "["; for file in node_modules/@kui-shell/client/notebooks/*.{md,json}; do echo -n "\"$(basename $file)\","; done; echo -n "]") | sed 's/\,]/]/' > node_modules/@kui-shell/build/client-guidebooks.json
fi
