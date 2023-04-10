#!/usr/bin/env bash

#
# Copyright 2020 The Kubernetes Authors
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

function babel {
    local OUT=dist
    if [ "$i" == "packages/builder" ]; then OUT=build; fi

    # echo "babeling $1 to $OUT"
    if [ -z "$WATCH" ]; then
        echo "npx --no-install babel --plugins $PLUGINS $1/mdist --out-dir $1/$OUT --ignore '**/*.d.ts','**/*.js.map' --no-copy-ignored $WATCH"
    else
        npx --no-install babel --plugins $PLUGINS $1/mdist --out-dir $1/$OUT --ignore '**/*.d.ts','**/*.js.map' --no-copy-ignored $WATCH
    fi
}

declare -a LIST=()
declare -a NAMES=()
for i in {packages,plugins}/*; do
    if [ -d $i/mdist ]; then
        if [ -z "$WATCH" ]; then
            cmd=$(babel $i)
            LIST+=("$cmd")
        else
            babel $i &
        fi
    fi

    for j in $i/*; do
        if [ -d $j/mdist ]; then
            if [ -z "$WATCH" ]; then
                cmd=$(babel $j)
                LIST+=("$cmd")
            else
                babel $j &
            fi
        fi
    done
done

# ugh, bash versus quotes; we just gave up and launched node here:
# the L.slice is to strip of the trailing comma that the bash printf line emits
if [ -z "$WATCH" ]; then
    export L=$(printf "\"%s\"," "${LIST[@]}")
    node -e 'require("concurrently")(JSON.parse("[" + process.env.L.slice(0, process.env.L.length - 1) + "]"), { maxProcesses: require("os").cpus().length }).result.then(() => console.log("ok"))'
else
    SAVE_IFS="$IFS"
    IFS=","
    NAMESJOIN="${NAMES[*]}"
    IFS="$SAVE_IFS"

    export L=$(printf "'%s'," "${LIST[@]}")

    wait
    # concurrently -n $NAMESJOIN $L
fi
