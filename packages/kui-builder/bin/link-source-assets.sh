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

grep name package.json | grep kui-shell >& /dev/null
if [ $? == 1 ]; then
    if [ ! -d packages ] && [ ! -d plugins ]; then
        echo "Error: execute this script from the top level of the kui project"
        exit
    fi
fi

TOPDIR=.
BUILDDIR="${TOPDIR}/build"

# special case for kui-builder for now
if [ -d packages/kui-builder ]; then
    pluginPath=packages/kui-builder
    plugin=`basename "$pluginPath"`
    target="$BUILDDIR"/$pluginPath/src
    mkdir -p "$target"
    (cd "$pluginPath/$subdir" && npm run tsconfig:prepack)
    (cd "$target" && rm -f tsconfig.json && cp "../../../../$pluginPath/tsconfig.json" .)
    (cd "$pluginPath/$subdir" && npm run tsconfig:postpack)
    for subdir in i18n bin lib examples dist package.json; do
        (cd "$target" && rm -rf "$subdir" && ln -sf "../../../../$pluginPath/$subdir")
    done
fi

for pluginPath in plugins/* packages/app; do
    plugin=`basename "$pluginPath"`
    for subdir in i18n bin plugin tests samples templates vendor web package.json; do
        if [ "$subdir" == "package.json" ] && [ "$plugin" == "app" ]; then continue; fi

        if [ -e "$pluginPath/$subdir" ]; then
            echo "linking library $plugin/$subdir"
            target="$BUILDDIR"/$pluginPath/src
            mkdir -p "$target"
            (cd "$target" && rm -rf "$subdir" && ln -sf "../../../../$pluginPath/$subdir")
        fi
    done
done
