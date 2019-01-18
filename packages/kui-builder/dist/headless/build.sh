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
TOPDIR="$SCRIPTDIR/../../../../"
APPDIR="$TOPDIR/packages/app"
cd "$SCRIPTDIR"

# product name
export PRODUCT_NAME="${PRODUCT_NAME-`cat "$APPDIR"/build/config.json | jq --raw-output .productName`}"

# targets
export BUILDDIR=../builds
DEST="${PRODUCT_NAME}-headless.zip"
DEST_TGZ="${PRODUCT_NAME}-headless.tar.bz2"

if [[ `uname` == Darwin ]]; then
    # see ../electron/bin/postinstall; we use brew to ensure we have gtar
    TAR=gtar
else
    TAR=tar
fi

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
    UGLIFY=false ../bin/compile.js
    if [ $? -ne 0 ]; then
        echo "Error in uglify $?"
        exit 1
    fi

    echo "Done with uglify"

    VERSION=`cat "$APPDIR"/package.json | jq --raw-output .version`
    echo "$VERSION" > "$APPDIR"/.version

    # corral any module-specific tests
    (cd $TOPDIR/tests && ./bin/corral.sh)
}

# hacks to trim down some of the npms
function trimDeps {
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
             && rm -rf terser)
    fi

    if [ -d "$TOPDIR/kui/node_modules/js-yaml" ]; then
        (cd "$TOPDIR/kui/node_modules/js-yaml" \
             && rm dist/js-yaml.js \
             && mv dist/js-yaml.min.js dist/js-yaml.js)
    fi

    # (cd kui && npm uninstall --no-save diff2html terser js-beautify)
}

function cleanup {
    echo "Cleanup"
    rm "$APPDIR"/.version
}

function build {
    echo "Building to $BUILDDIR/$DEST and $BUILDDIR/$DEST_TGZ"
    rm -f "$BUILDDIR/$DEST" "$BUILDDIR/$DEST_TGZ"

    (cd $TOPDIR && rm -rf kui && mkdir kui && mkdir kui/bin && \
         "$TAR" -C . -cf - \
             --exclude "./kui" \
             --exclude ".git*" \
             --exclude ".travis*" \
             --exclude "./docs" \
             --exclude "./node_modules" \
             --exclude "./packages/kui-builder" \
             --exclude "./build/*/node_modules/*" \
             --exclude "./plugins/*/node_modules/*" \
             --exclude "**/node_modules/electron*/*" \
             --exclude "./packages/app/bin/postinstall.js" \
             --exclude "./packages/app/content/icons/*" \
             --exclude "./packages/app/content/images/*" \
             --exclude "**/*~" \
             --exclude "**/.bak" \
             --exclude "**/*.map" \
             --exclude "**/*.png" \
             --exclude "**/*.icns" \
             --exclude "**/*.ico" \
             --exclude "./packages/app/bin/build.js" \
             --exclude "./packages/app/bin/seticon.sh" \
             --exclude "./packages/app/bin/seticon.js" \
             --exclude "./packages/app/build/webpack-stats.html" \
             --exclude "node_modules/monaco-editor" \
             --exclude "node_modules/fsevents" \
             --exclude "node_modules/elkjs" \
             --exclude "node_modules/d3" \
             --exclude "node_modules/jquery" \
             --exclude "node_modules/typescript" \
             --exclude "./plugins/editor" \
             --exclude "./plugins/field-installed-plugins" \
             --exclude "./plugins/grid" \
             --exclude "./plugins/openwhisk-debug" \
             --exclude "./plugins/tutorials" \
             --exclude "./plugins/wskflow" \
             --exclude "**/*.ts" \
             --exclude "./tests/node_modules/*" \
             --exclude "node_modules/*.bak/*" \
             --exclude "node_modules/**/*.md" \
             --exclude "node_modules/**/*.DOCS" \
             --exclude "node_modules/**/LICENSE" \
             --exclude "node_modules/**/docs/**/*.html" \
             --exclude "node_modules/**/docs/**/*.png" \
             --exclude "node_modules/**/docs/**/*.js" \
             --exclude "node_modules/**/test/*" . \
             | "$TAR" -C kui -xf - && \
         node -e 'const pjson = require("./kui/package.json"); delete pjson.devDepdencies; pjson.scripts.test = `SCRIPTDIR=$(cd $(dirname \"$0\") && pwd); npm install --production mocha openwhisk; APP=.. RUNNING_SHELL_TEST=true TEST_ROOT=$SCRIPTDIR/tests KUI=$\{KUI-$SCRIPTDIR/bin/kui\} mocha -c --require module-alias/register --exit --bail --recursive -t 60000 tests/tests --grep "\$\{TEST_FILTER:-.*\}"`; require("fs").writeFileSync("./kui/package.json", JSON.stringify(pjson, undefined, 2))' && \
         (cd kui && cp package.json bak.json) && \
         (cd kui && npx lerna link convert) && \
         (node -e 'const pjson = require("./kui/package.json"); const pjson2 = require("./kui/bak.json"); for (let k in pjson2.dependencies) pjson.dependencies[k] = pjson2.dependencies[k]; require("fs").writeFileSync("./kui/package.json", JSON.stringify(pjson, undefined, 2))') && \
         (cd kui && npm install --production --ignore-scripts --no-package-lock) && \
         trimDeps && \
         cp packages/kui-builder/dist/bin/kui.cmd kui/bin/kui.cmd && \
         find -L kui/tests/tests/passes/ -name '*headless*.js' -prune -o -type f -exec rm {} \; && \
         find -L kui/tests/data -type d -name headless -prune -o -type f -exec rm {} \; && \
         "$TAR" -jcf "$SCRIPTDIR/$BUILDDIR/$DEST_TGZ" \
             --exclude "node_modules/@types" \
             --exclude "node_modules/js-beautify" \
             --exclude "**/.bak" \
             --exclude "**/*.map" \
             --exclude "**/*.png" \
             --exclude "**/*.icns" \
             --exclude "**/*.ico" \
             --exclude "lerna.json" \
             --exclude "**/yarn.lock" \
             --exclude "**/*.debug.js" \
             --exclude "**/package-lock.json" \
             kui && \
         rm -rf kui)

    TEMP="`mktemp -d`"
    (cd "$TEMP" && \
         "$TAR" jxf "$SCRIPTDIR/$BUILDDIR/$DEST_TGZ" && \
         zip -q -r "$SCRIPTDIR/$BUILDDIR/$DEST" kui)
    rm -rf "$TEMP"
}

init && build && cleanup
echo "build-headless.sh finished, here is what we think we built:"
ls -lh $BUILDDIR/*headless*

#         cp tests/data/openwhisk/foo.js tests/data/openwhisk/echo.js kui/tests/data/openwhisk && \
#         (cd kui/tests && cp -a $TOPDIR/tests/lib .) && \
#             --exclude "./plugins/*/tests/data/**" \
