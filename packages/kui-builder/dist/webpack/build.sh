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
TOPDIR="${SCRIPTDIR}/../../../../"
STAGING="$SCRIPTDIR/kui"
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

if [ ! -d node_modules ]; then
    npm install
fi

if [[ `uname` == Darwin ]]; then
    # see bin/postinstall; we use brew to ensure we have gtar
    TAR=gtar
else
    TAR=tar
fi

#pre &&

rm -rf kui && \
    mkdir kui && \
    "$TAR" -C "$TOPDIR" --exclude '*flycheck_*.js' --exclude '*.icns' --exclude '*~' --exclude Dockerfile --exclude package-lock.json --exclude '*/tests/*' --exclude './packages/proxy/*.js' --exclude './node_modules' --exclude './plugins/*/node_modules' --exclude './packages/*/node_modules' --exclude '*.ts' --exclude './packages/kui-builder' --exclude './tests' -cf - . | "$TAR" -C kui -xf - && \
    echo "tar copy done" && \
    (cd "$STAGING" && \
         cp package.json bak.json && \
         npx lerna link convert && \
         (node -e 'const pjson = require("./package.json"); const pjson2 = require("./bak.json"); for (let k in pjson2.dependencies) pjson.dependencies[k] = pjson2.dependencies[k]; require("fs").writeFileSync("./package.json", JSON.stringify(pjson, undefined, 2))') && \
         npm install --production --ignore-scripts --no-package-lock && \
         (cd "$STAGING" && "$TOPDIR"/packages/kui-builder/bin/link-build-assets.sh) && \
         rm bak.json) && \
    echo "lerna magic done" && \
    build

if [ -z "$NO_CLEAN" ]; then
    rm -rf "$STAGING"
fi

#post
