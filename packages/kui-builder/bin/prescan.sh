#!/usr/bin/env bash

#
# Copyright 2017-19 IBM Corporation
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
export PLUGIN_ROOT="$(cd "$TOPDIR" && pwd)/build/plugins"

# make typescript happy, until we have the real prescan model ready
# (produced by kui-builder/lib/configure.js, but which cannot be run
# until after we've compiled the source)
mkdir -p ./node_modules/@kui-shell
rm -f ./node_modules/@kui-shell/prescan.json
touch ./node_modules/@kui-shell/prescan.json

# pre-compile plugin registry
if [ -f ./node_modules/@kui-shell/builder/dist/bin/compile.js ]; then
    for i in build/plugins/*; do
        if [ -d "$i"/src ]; then
            echo "linking in plugin $(basename $i)"
            npm install "$i"/src
        fi
    done

    echo "compiling plugin registry $CLIENT_HOME"

    mkdir -p ./packages/app/build
    (cd node_modules/@kui-shell && rm -f settings && ln -s ../../packages/app/build settings)

    if [ ! -f ./packages/app/build/package.json ]; then                         
        echo '{}' > ./packages/app/build/package.json                           
    fi                                                                          
    if [ ! -f ./packages/app/build/config.json ]; then                          
        echo '{}' > ./packages/app/build/config.json                            
    fi

    node ./node_modules/@kui-shell/builder/dist/bin/compile.js
else
    echo "compiling plugin registry (monorepo mode)"
    "$SCRIPTDIR"/link-build-assets.sh
    node ./packages/kui-builder/dist/bin/compile.js
fi
