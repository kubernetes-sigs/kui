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
    echo "Error: execute this script from the top level of the kui project"
    exit 1
fi

# we will work in node_modules/@kui; so TOPDIR is two levels up
cd node_modules
TOPDIR=../..
BUILDDIR="$TOPDIR/build"

# echo for sanity checking; we won't use ABS after this
ABS=$(cd "$TOPDIR" && pwd)
echo "Running under this absolute path: $ABS"

if [ ! -d @kui ]; then
    mkdir @kui
fi
cd @kui

function link {
    echo "linking build asset $1"
    rm -f "$2"
    ln -s "$1" "$2"
}

for pluginPath in "$BUILDDIR"/plugins/*; do
    plugin=`basename $pluginPath`
    link "$pluginPath" "$plugin"
done

echo "linking build asset core"
link "$BUILDDIR"/packages/app/src core
(cd core && link ../../"$BUILDDIR"/packages/app/tests tests)
(cd core && link ../../"$BUILDDIR"/packages/app/package.json package.json)

echo "linking prescan"
link "$BUILDDIR"/.pre-scanned.json prescan.json

echo "linking config"
link "$TOPDIR"/packages/app/build settings
link "$TOPDIR"/packages/app/content content
