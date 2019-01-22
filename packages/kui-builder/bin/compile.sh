#!/usr/bin/env bash

#
# Copyright 2017-18 IBM Corporation
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

if [ ! -e lerna.json ]; then
    if [ -d plugins ] || [ -d packages ]; then
        echo "Error: perhaps you forgot to run `lerna init`?"
    else
        echo "Error: execute this script from the top level of the kui project"
    fi
    exit 1
fi

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR=.
BUILDDIR="${TOPDIR}/build"

# for compile.js below; give it an absolute path
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
if [ $? != 0 ]; then exit $?; fi

TSCONFIG_HOME=`readlink $0`
if [ $? == 1 ]; then
    TSCONFIG_HOME="$SCRIPTDIR/.."
    TSCONFIG="$TSCONFIG_HOME/tsconfig.json"
    echo "it looks like we are not working off a symlink ${TSCONFIG_HOME}"
else
    TSCONFIG_HOME=$(dirname "$SCRIPTDIR/`dirname $TSCONFIG_HOME`")
    TSCONFIG="$TSCONFIG_HOME/tsconfig.json"
    echo "following link to find build home ${TSCONFIG_HOME}"
fi

# compile source
echo ""
echo "compiling source $TSCONFIG_HOME"
"$TSCONFIG_HOME"/node_modules/.bin/tsc --build "$TSCONFIG"
if [ $? != 0 ]; then exit $?; fi

"$SCRIPTDIR"/link-build-assets.sh
if [ $? != 0 ]; then exit $?; fi

# pre-compile plugin registry
echo "compiling plugin registry"
(cd "$TSCONFIG_HOME"/dist/bin && ./compile.js)
