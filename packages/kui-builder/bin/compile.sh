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
    TSCONFIG_HOME="$SCRIPTDIR/.."
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

"$TSCONFIG_HOME"/bin/prescan.sh
