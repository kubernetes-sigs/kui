#!/usr/bin/env bash

#
# Copyright 2017-2018 IBM Corporation
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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR="${SCRIPTDIR}/../../"
cd $SCRIPTDIR

function trimTutorials {
    (cd "$TOPDIR" \
         && rm -rf node_modules/jquery/src \
         && rm -f node_modules/jquery/external/sizzle/dist/sizzle.js \
         && rm -f node_modules/jquery/dist/core.js \
         && mv -f node_modules/jquery/dist/jquery.min.js node_modules/jquery/dist/jquery.js \
         && rm -f node_modules/jquery/dist/jquery.slim* \
         && mv -f node_modules/jquery/dist/jquery.min.map node_modules/jquery/dist/jquery.map)
}

function trimWskflow {
    (cd "$TOPDIR" \
         && rm -rf node_modules/jquery/src \
         && rm -f node_modules/jquery/external/sizzle/dist/sizzle.js \
         && rm -f node_modules/jquery/dist/core.js \
         && mv -f node_modules/jquery/dist/jquery.min.js node_modules/jquery/dist/jquery.js \
         && rm -f node_modules/jquery/dist/jquery.slim* \
         && mv -f node_modules/jquery/dist/jquery.min.map node_modules/jquery/dist/jquery.map \
         && rm -rf node_modules/d3/src \
         && mv node_modules/d3/d3.min.js node_modules/d3/d3.js \
         && rm -f node_modules/elkjs/lib/elk-worker.js node_modules/elkjs/lib/elk.bundled.js)
}

function pre {
    (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/pre' -exec {} \;)
    # (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/pre' -exec rm node_modules/@kui-plugin/{} \;)
    # npm prune --production
}

function post {
    (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/post' -exec {} \;)
    # npm install
}

function build {
    rm -f ./build/*.js.br
    npx webpack-cli --mode development
}

#pre &&
    build
#post
