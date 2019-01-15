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

shopt -s extglob

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR="$SCRIPTDIR/../.."
APPDIR="$TOPDIR/app"
cd "$SCRIPTDIR"

# product name
export PRODUCT_NAME="${PRODUCT_NAME-`cat $APPDIR/build/config.json | jq --raw-output .productName`}"

# targets
export BUILDDIR=../builds
DEST="${PRODUCT_NAME}-headless.zip"
DEST_TGZ="${PRODUCT_NAME}-headless.tar.bz2"

function init {
    # make the build directory
    if [ ! -d $BUILDDIR ]; then
	mkdir $BUILDDIR
	if [ $? != 0 ]; then
	    exit 1
	fi
    fi

    if [ ! -d node_modules ]; then
	npm install
    fi

    if [ ! -d $TOPDIR/node_modules/electron ]; then
        # in case we had a failed build-headless in the past
        (cd $TOPDIR && npm install electron)
    fi

    # assemble plugins and by default, we want to uglify the javascript
    UGLIFY=true ../bin/compile.js
    if [ $? -ne 0 ]; then
        echo "Error in uglify $?"
        exit 1
    fi

    echo "Done with uglify"

    VERSION=`cat $APPDIR/package.json | jq --raw-output .version`
    echo "$VERSION" > $APPDIR/.version

    # corral any module-specific tests
    (cd $TOPDIR/tests && ./bin/corral.sh)
}

# hacks to trim down some of the npms
function trimDeps1 {
    (cd "$TOPDIR"/kui/app/plugins/modules/bash-like && npm uninstall --save diff2html)
}

function trimDeps2 {
    if [ -d "$TOPDIR/kui/node_modules/lodash" ]; then
        (cd "$TOPDIR/kui/node_modules" \
             && mv lodash/lodash.min.js ___lodash.js \
             && mv lodash/index.js ___lodash2.js \
             && rm -rf lodash/* \
             && mv ___lodash.js lodash/lodash.js \
             && mv ___lodash2.js lodash/index.js)
    fi

    if [ -d "$TOPDIR/kui/node_modules/async" ]; then
        (cd "$TOPDIR/kui/node_modules" \
             && rm async/*.js \
             && rm async/dist/async.js && mv async/dist/async.min.js async/dist/async.js)
    fi

    if [ -d "$TOPDIR/kui/node_modules/terser" ]; then
        (cd "$TOPDIR/kui/node_modules" \
             && rm -rf terser/{bin,lib,tools} terser/dist/*.map)
    fi

    if [ -d "$TOPDIR/kui/node_modules/js-yaml" ]; then
        (cd "$TOPDIR/kui/node_modules/js-yaml" \
             && rm dist/js-yaml.js \
             && mv dist/js-yaml.min.js dist/js-yaml.js)
    fi
}

function cleanup {
    echo "Cleanup"
    rm $APPDIR/.version
}

function build {
    echo "Building to $BUILDDIR/$DEST and $BUILDDIR/$DEST_TGZ"
    rm -f "$BUILDDIR/$DEST" "$BUILDDIR/$DEST_TGZ"

    (cd $TOPDIR && rm -rf kui && mkdir kui && mkdir kui/bin && \
         tar -C . -cf - \
             --exclude "^kui" \
             --exclude ".git/*" \
             --exclude "^dist" \
             --exclude "**/node_modules/electron*/*" \
             --exclude "^app/bin/postinstall.js" \
             --exclude "^app/content/icons/*" \
             --exclude "^app/content/images/*" \
             --exclude "**/*~" \
             --exclude "**/.bak" \
             --exclude "**/*.map" \
             --exclude "**/*.png" \
             --exclude "**/*.icns" \
             --exclude "**/*.ico" \
             --exclude "^app/bin/build.js" \
             --exclude "^app/bin/seticon.sh" \
             --exclude "^app/bin/seticon.js" \
             --exclude "^app/build/*.br" \
             --exclude "^app/build/webpack-stats.html" \
             --exclude "node_modules/monaco-editor" \
             --exclude "node_modules/fsevents" \
             --exclude "node_modules/elkjs" \
             --exclude "node_modules/d3" \
             --exclude "node_modules/jquery" \
             --exclude "node_modules/typescript" \
             --exclude "node_modules/@types" \
             --exclude "^app/plugins/modules/editor" \
             --exclude "^app/plugins/modules/grid" \
             --exclude "^app/plugins/modules/openwhisk-debug" \
             --exclude "^app/plugins/modules/tutorials" \
             --exclude "^app/plugins/modules/wskflow" \
             --exclude "**/*.ts" \
             --exclude "**/package-lock.json" \
             --exclude "^tests/node_modules/*" \
             --exclude "node_modules/*.bak/*" \
             --exclude "node_modules/**/*.md" \
             --exclude "node_modules/**/*.DOCS" \
             --exclude "node_modules/**/LICENSE" \
             --exclude "node_modules/**/docs/**/*.html" \
             --exclude "node_modules/**/docs/**/*.png" \
             --exclude "node_modules/**/docs/**/*.js" \
             --exclude "node_modules/**/test/*" \
             --exclude "node_modules/js-beautify" . \
             | tar -C kui -xf - && \
         (mkdir kui/app/plugins/modules/editor || true) && \
         (mkdir kui/app/plugins/modules/grid || true) && \
         (mkdir mkdir kui/app/plugins/modules/openwhisk-debug || true) && \
         (mkdir kui/app/plugins/modules/tutorials || true) && \
         (mkdir kui/app/plugins/modules/wskflow || true) && \
         node -e 'const pjson = require("./kui/package.json"); delete pjson.devDepdencies; delete pjson.dependencies["@kui-plugin/editor"]; delete pjson.dependencies["@kui-plugin/wskflow"]; delete pjson.dependencies["js-beautify"]; delete pjson.dependencies["@kui-plugin/grid"]; delete pjson.dependencies["@kui-plugin/openwhisk-debug"]; delete pjson.dependencies["@kui-plugin/tutorials"]; delete pjson.dependencies["@kui-plugin/field-installed-plugins"]; pjson.scripts.test = `SCRIPTDIR=$(cd $(dirname \"$0\") && pwd); npm install --production mocha openwhisk; APP=.. RUNNING_SHELL_TEST=true TEST_ROOT=$SCRIPTDIR/tests KUI=$\{KUI-$SCRIPTDIR/bin/kui\} mocha -c --require module-alias/register --exit --bail --recursive -t 60000 tests/tests --grep "\$\{TEST_FILTER:-.*\}"`; require("fs").writeFileSync("./kui/package.json", JSON.stringify(pjson, undefined, 2))' && \
         trimDeps1 && \
         (cd kui && npm prune --production) && \
         trimDeps2 && \
         cp dist/bin/kui.cmd kui/bin/kui.cmd && \
         find -L kui/tests/tests/passes/ -name '*headless*.js' -prune -o -type f -exec rm {} \; && \
         find -L kui/tests/data -type d -name headless -prune -o -type f -exec rm {} \; && \
         tar -jcf "$SCRIPTDIR/$BUILDDIR/$DEST_TGZ" kui && \
         rm -rf kui)

    TEMP="`mktemp -d`"
    (cd "$TEMP" && \
         tar jxf "$SCRIPTDIR/$BUILDDIR/$DEST_TGZ" && \
         zip -q -r "$SCRIPTDIR/$BUILDDIR/$DEST" kui)
    rm -rf "$TEMP"
}

init && build && cleanup
echo "build-headless.sh finished, here is what we think we built:"
ls -lh $BUILDDIR/*headless*

#         cp tests/data/openwhisk/foo.js tests/data/openwhisk/echo.js kui/tests/data/openwhisk && \
#         (cd kui/tests && cp -a $TOPDIR/tests/lib .) && \
#             --exclude "^app/plugins/modules/*/tests/data/**" \
