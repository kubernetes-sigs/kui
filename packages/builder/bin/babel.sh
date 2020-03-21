#!/usr/bin/env bash

#
# Copyright 2020 IBM Corporation
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

# Explanation of babel plugins:
#  - @babel/plugin-transform-modules-commonjs
#      static import x from
#
#  - dynamic-import-node-babel-7
#      dynamic import()
#
#  - babel-plugin-ignore-html-and-css-imports
#      removes any css or html imports from the commonjs code
#
PLUGINS=@babel/plugin-transform-modules-commonjs,dynamic-import-node-babel-7,babel-plugin-ignore-html-and-css-imports

for i in {packages,plugins}/*; do
    if [ -d $i/mdist ]; then
        OUT=dist
        if [ "$i" == "packages/builder" ]; then OUT=build; fi

        npx babel --plugins $PLUGINS $i/mdist --out-dir $i/$OUT &

        for j in $i/*; do
            if [ -d $j/mdist ]; then
               npx babel --plugins $PLUGINS $j/mdist --out-dir $j/dist &
            fi
        done
    fi
done

wait
