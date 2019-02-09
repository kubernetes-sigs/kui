#!/usr/bin/env bash

#
# Copyright 2017-2019 IBM Corporation
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

STAGING="${1-`pwd`}"
STAGING="$(cd "$STAGING" && pwd)"
echo "staging directory $STAGING"

CLIENT_HOME="$(pwd)"
APPDIR="$STAGING"/kui/packages/app
BUILDER_HOME="$STAGING"/kui/node_modules/@kui-shell/builder
export BUILDDIR="$CLIENT_HOME/dist/headless"

if [[ `uname` == Darwin ]]; then
    TAR=gtar
    which gtar >& /dev/null
    if [ $? != 0 ]; then
        brew install gtar
    fi
else
    TAR=tar
fi

function init {
    rm -rf "$STAGING"/kui
    mkdir -p "$STAGING/kui/bin"
    mkdir -p $BUILDDIR

    cd "$STAGING/kui"
}

# hacks to trim down some of the npms
function trimDeps {
    set +e
    if [ -d "node_modules/lodash" ]; then
        (cd "node_modules" \
             && mv lodash/lodash.min.js ___lodash.js \
             && mv lodash/index.js ___lodash2.js \
             && rm -rf lodash/* \
             && mv ___lodash.js lodash/lodash.js \
             && mv ___lodash2.js lodash/index.js)
    fi

    if [ -d "node_modules/async" ]; then
        (cd "node_modules" \
             && rm async/*.js \
             && rm async/dist/async.js && mv async/dist/async.min.js async/dist/async.js)
    fi

    if [ -d "node_modules/terser" ]; then
        (cd "node_modules/terser" \
             && rm -rf tools bin lib dist/bundle.js)
    fi

    if [ -d "node_modules/js-yaml" ]; then
        (cd "node_modules/js-yaml" \
             && rm dist/js-yaml.js \
             && mv dist/js-yaml.min.js dist/js-yaml.js)
    fi
    set -e
}

function cleanup {
    echo "Cleanup"
}

function tarCopy {
    echo "tar copy to $STAGING from $CLIENT_HOME"
    (cd "$STAGING" && \
         "$TAR" -C "$CLIENT_HOME" -cf - \
                --exclude "./npm-packs" \
                --exclude "./kui" \
                --exclude "./kui-*-tmp" \
                --exclude "./bin" \
                --exclude "./tools" \
                --exclude "./dist" \
                --exclude "./builds" \
                --exclude ".git*" \
                --exclude ".travis*" \
                --exclude "**/package-lock.json" \
                --exclude "lerna-debug.log" \
                --exclude "./docs" \
                --exclude "./build/*/node_modules/*" \
                --exclude "./packages/*/node_modules/*" \
                --exclude "./plugins/*/node_modules/*" \
                --exclude "**/*~" \
                --exclude "**/.bak" \
                --exclude "**/*.map" \
                --exclude "**/*.png" \
                --exclude "**/*.icns" \
                --exclude "**/*.ico" \
                --exclude "./theme" \
                --exclude "**/tests/node_modules/*" \
                --exclude "node_modules/*.bak/*" \
                --exclude "node_modules/**/*.md" \
                --exclude "node_modules/**/*.DOCS" \
                --exclude "node_modules/**/LICENSE" \
                --exclude "node_modules/**/docs/**/*.html" \
                --exclude "node_modules/**/docs/**/*.png" \
                --exclude "node_modules/**/docs/**/*.js" . \
             | "$TAR" -C kui -xf -)
}

function configure {
    UGLIFY=true npx --no-install kui-compile
    CLIENT_HOME=$CLIENT_HOME KUI_STAGE="$STAGING"/kui node "$BUILDER_HOME"/lib/configure.js
}

function build {
    tarCopy
    configure

    # product name
    export PRODUCT_NAME="${PRODUCT_NAME-`cat "$APPDIR"/build/config.json | jq --raw-output .theme.productName`}"
    if [ -z "$PRODUCT_NAME" ] || [ "$PRODUCT_NAME" == "null" ]; then
        # choose some default product name
        PRODUCT_NAME="Kui"
    fi

    # targets
    DEST="${PRODUCT_NAME}-headless.zip"
    DEST_TGZ="${PRODUCT_NAME}-headless.tar.bz2"

    if [ -z "$NO_ZIPS" ]; then
        echo "Building headless dist to $BUILDDIR/$DEST and $BUILDDIR/$DEST_TGZ"
        rm -f "$BUILDDIR/$DEST" "$BUILDDIR/$DEST_TGZ"
    else
        echo "Building headless dist to $STAGING/kui"
    fi

    # word of warning for linux: in the TAR command below, the `-cf -` has
    # to come before the --exclude rules!

    pushd "$STAGING" > /dev/null

    # hack in an `npm run test`
    PJSON=$(node -e 'const pjson = require("./kui/package.json"); pjson.scripts.test = `SCRIPTDIR=$(cd $(dirname \"$0\") && pwd); cd tests && npm install --no-package-lock && APP=../.. RUNNING_SHELL_TEST=true TEST_ROOT=$SCRIPTDIR/tests KUI=$\{KUI-$SCRIPTDIR/bin/kui\} npx mocha -c --exit --bail --recursive -t 60000 tests --grep "\$\{TEST_FILTER:-.*\}"`; console.log(JSON.stringify(pjson, undefined, 2))')
    echo "$PJSON" > ./kui/package.json

    #(cd kui && cp package.json bak.json)
    #PJSON=$(node -e 'const pjson = require("./kui/package.json"); const pjson2 = require("./kui/bak.json"); pjson.dependencies = Object.assign(pjson.dependencies || {}, pjson2.dependencies || {}); console.log(JSON.stringify(pjson, undefined, 2))')
    #echo "$PJSON" > ./kui/package.json
    #(cd kui && rm bak.json)

    # at least the first line must be prior to npm prune --production
    cp "$BUILDER_HOME"/dist/bin/kui.cmd kui/bin/kui.cmd
    cp kui/node_modules/@kui-shell/core/bin/* kui/bin

    (cd kui && npm prune --production)
    (cd kui && trimDeps)

    # must be *after* prune, as prune removes this link
    (cd kui/node_modules/@kui-shell && ln -s ../../packages/app/build settings)

    # for now, we do this to get the `npm run test` test bits in place
    "$TAR" -jhcf "$BUILDDIR/$DEST_TGZ" kui
    rm -rf kui
    "$TAR" jxf "$BUILDDIR/$DEST_TGZ"

    #
    # tolerate failures here. we are just attempting to trim off
    # non-headless test input and test data, respectively
    #
    set +e
    find -L kui/node_modules/@kui-shell -type f -path '*/test/*headless*.js' -prune -o -path '*/test/*' -type f -exec rm {} \;
    find -L kui/node_modules/@kui-shell -type d -path '*/tests/data/*/headless' -prune -o -path '*/tests/data/*' -type f -exec rm {} \;
    set -e

    # if there are any associated tests
    if [ -d kui/tests ]; then
       (cd kui/tests && ./bin/corral.sh)
    fi

    "$TAR" -jcf "$BUILDDIR/$DEST_TGZ" \
           --exclude ".pre-scanned.json" \
           --exclude "node_modules/@types" \
           --exclude "node_modules/js-beautify" \
           --exclude "node_modules/.bin" \
           --exclude "**/tests/node_modules" \
           --exclude "**/*-debug.log" \
           --exclude "**/*.ts" \
           --exclude "**/.bak" \
           --exclude "**/*.map" \
           --exclude "**/*.png" \
           --exclude "**/*.icns" \
           --exclude "**/*.ico" \
           --exclude "lerna.json" \
           --exclude "**/yarn.lock" \
           --exclude "**/*.debug.js" \
           --exclude "**/package-lock.json" \
           kui

    popd > /dev/null

    if [ -z "$NO_CLEAN" ] && [ -z "$NO_ZIPS" ]; then
        # if either
        #   1) we were asked not to clean the staging directory; or
        #   2) we were asked not to create the zip/tarballs
        # then do not remove the staging directory
        echo "removing staging directory $STAGING/kui"
        rm -rf "$STAGING"/kui
    fi

    # create zip
    if [ -z "$NO_ZIPS" ]; then
        TEMP="`mktemp -d`"
        (cd "$TEMP" && \
             "$TAR" jxf "$BUILDDIR/$DEST_TGZ" && \
             zip -q -r "$BUILDDIR/$DEST" kui)
        rm -rf "$TEMP"
    fi
}

init && build && cleanup

if [ -z "$QUIET" ]; then
    echo "headless client build finished, here is what we built in $BUILDDIR:"
    ls -lh "$BUILDDIR"
fi
