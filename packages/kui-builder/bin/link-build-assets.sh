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

shopt -s extglob

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

grep name package.json | grep kui-shell >& /dev/null
if [ $? == 1 ]; then
    if [ ! -e lerna.json ]; then
        echo "Error: execute this script from the top level of the kui project"
        exit 1
    fi
fi

cd node_modules
if [ ! -d @kui-shell ]; then
    mkdir @kui-shell
fi
cd @kui-shell

# note how, with the two `cd` just above, we will be working in
# node_modules/@kui-shell; so TOPDIR is two levels up
TOPDIR=../..
BUILDDIR="$TOPDIR/build"

# echo for sanity checking; we won't use ABS after this
ABS=$(cd "$TOPDIR" && pwd)
echo "Running under this absolute path: $ABS"

function link {
    if [ "$2" != "*" ]; then
        echo "linking build asset $1 -> $2"
        rm -f "$2"
        ln -s "$1" "$2"
    fi
}

if [ -d "$BUILDDIR"/plugins ]; then
    for pluginPath in "$BUILDDIR"/plugins/*; do
        plugin=`basename $pluginPath`
        link "$pluginPath"/src "$plugin"
    done
fi

if [ -n "$MONOREPO_MODE" ] && [ -d "$BUILDDIR"/packages ]; then
    for pluginPath in "$BUILDDIR"/packages/!(kui-builder|app); do
        # ugh, i can't remember the bash magic right now to avoid empty expansion; set -u??
        if [ "$pluginPath" == "$BUILDDIR/packages/!(kui-builder|app)" ]; then continue; fi

        plugin=`basename $pluginPath`
        link "$pluginPath"/src "$plugin"
    done

    if [ -d "$BUILDDIR"/packages/app/src ]; then
        echo "linking build asset core"
        link "$BUILDDIR"/packages/app/src core
        (cd core && link ../../"$BUILDDIR"/packages/app/package.json package.json)
    fi
fi

if [ -z "$NO_ARTIFACTS" ]; then
    (cd "$TOPDIR" && "$SCRIPTDIR"/kui-link-artifacts.sh)
fi
