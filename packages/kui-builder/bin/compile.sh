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

if [ ! -d packages/app/src ] || [ ! -d plugins ]; then
    echo "Error: perhaps you forgot to run "npx kui-init""
    exit 1
fi

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR=.
BUILDDIR="${TOPDIR}/build"

# for compile.js below; give it an absolute path
export CLIENT_HOME=${CLIENT_HOME-`pwd`}
export PLUGIN_ROOT="$(cd "$TOPDIR" && pwd)/build/plugins"

if [ ! -d "$BUILDDIR" ]; then
    mkdir "$BUILDDIR"
    if [ $? != 0 ]; then exit $?; fi
fi

# the import of @kui-shell/prescan fails in tsc if this file does not exist
# we will generate the real deal below, in "compiling plugin registry"
touch "$BUILDDIR"/.pre-scanned.json

# link lib and web files
"$SCRIPTDIR"/link-source-assets.sh

set +e
TSCONFIG_HOME=`readlink $0`
if [ $? == 1 ]; then
    TSCONFIG_HOME="$SCRIPTDIR/../../.."
    TSCONFIG="$TSCONFIG_HOME/tsconfig.json"
    echo "it looks like we are not working off a symlink ${TSCONFIG_HOME}"
else
    TSCONFIG_HOME=$(dirname "$SCRIPTDIR/`dirname $TSCONFIG_HOME`")
    TSCONFIG="$TSCONFIG_HOME/tsconfig.json"
    echo "following link to find build home ${TSCONFIG_HOME}"
fi

npx --no-install tsc -h >& /dev/null
if [ $? == 0 ]; then
    TSC="npx tsc"
else
    TSC="$TSCONFIG_HOME/node_modules/.bin/tsc"
    echo "Using TSC=$TSC"
fi
set -e

# compile source
echo ""
echo "compiling source $TSCONFIG_HOME"
$TSC --build "$TSCONFIG"

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
    echo '{}' > ./packages/app/build/package.json
    echo '{}' > ./packages/app/build/config.json

    node ./node_modules/@kui-shell/builder/dist/bin/compile.js
else
    echo "compiling plugin registry (monorepo mode)"
    "$SCRIPTDIR"/link-build-assets.sh
    node ./packages/kui-builder/dist/bin/compile.js
fi
