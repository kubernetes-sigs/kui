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

TOPDIR=.
BUILDDIR="${TOPDIR}/build"

for pluginPath in plugins/* packages/app; do
    plugin=`basename "$pluginPath"`
    for subdir in bin tests lib web package.json; do
        if [ -e "$pluginPath/$subdir" ]; then
            echo "linking library $plugin/$subdir"
            if [ ! -d "$BUILDDIR/$pluginPath" ]; then
                mkdir -p "$BUILDDIR/$pluginPath"
            fi
            (cd "$BUILDDIR/$pluginPath" && rm -rf "$subdir" && ln -sf "../../../$pluginPath/$subdir")
        fi
    done
done
