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

# for compile.js below; give it an absolute path
export CLIENT_HOME=${CLIENT_HOME-`pwd`}
export PLUGIN_ROOT="$(cd "$TOPDIR" && pwd)/plugins"

if [ ! -d plugins ] ; then
    echo "Error: no plugins provided in the plugins/ directory"
    exit 1
fi

if [ ! -f tsconfig.json ]; then
    echo "Error: missing tsconfig.json"
fi

# make typescript happy, until we have the real prescan model ready
# (produced by builder/lib/configure.js, but which cannot be run
# until after we've compiled the source)
mkdir -p ./node_modules/@kui-shell
touch ./node_modules/@kui-shell/prescan.json

# compile the source
npx tsc -b .

# initialize the html bits
CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$CLIENT_HOME" node node_modules/@kui-shell/builder/lib/configure.js

# link in the theme bits
(cd node_modules/@kui-shell/build && rm -rf css && mkdir css && cd css && for i in ../../../../node_modules/@kui-shell/core/web/css/*; do ln -sf $i; done && for i in ../../../../theme/css/*; do ln -sf $i; done)

# generate the plugin registry
if [ -z "$NO_PRESCAN" ]; then
    npx --no-install kui-prescan
fi
