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

if [ -z "$1" ] && [ -d node_modules/@kui-shell ]; then
    TOPDIR=node_modules/@kui-shell/core
    BUILDERDIR=node_modules/@kui-shell/builder
    APPDIR="$TOPDIR"
    STAGING="`pwd`"
    export BUILDDIR="`pwd`/builds"
else
    SCRIPTDIR=$(cd $(dirname "$0") && pwd)
    TOPDIR="$SCRIPTDIR/../../../../"
    BUILDERDIR="$TOPDIR"/packages/kui-builder
    APPDIR="$TOPDIR/packages/app"
    STAGING="${1-$TOPDIR}"
    export PATH="$SCRIPTDIR"/../bin:"$SCRIPTDIR"/../../bin:$PATH

    if [ -n "$2" ]; then
        export BUILDDIR="$2"
    else
        export BUILDDIR="$SCRIPTDIR"/../builds
    fi
fi

# product name
export PRODUCT_NAME="${PRODUCT_NAME-`cat "$APPDIR"/build/config.json | jq --raw-output .theme.productName`}"

# targets
DEST="${PRODUCT_NAME}-headless.zip"
DEST_TGZ="${PRODUCT_NAME}-headless.tar.bz2"

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
    # make the staging directory
    if [ ! -d "$STAGING" ]; then
        mkdir -p "$STAGING"
	if [ $? != 0 ]; then
	    exit 1
	fi
    fi

    # make the build directory
    if [ ! -d "$BUILDDIR" ]; then
	mkdir -p $BUILDDIR
	if [ $? != 0 ]; then
	    exit 1
	fi
    fi

    # assemble plugins and by default, we want to uglify the javascript
    #UGLIFY=false ../bin/compile.js
    #if [ $? -ne 0 ]; then
    #    echo "Error in uglify $?"
    #    exit 1
    #fi
    #echo "Done with uglify"

    VERSION=`cat "$APPDIR"/package.json | jq --raw-output .version`
    echo "$VERSION" > "$APPDIR"/.version

    # corral any module-specific tests
    #(cd $TOPDIR/tests && ./bin/corral.sh)
}

# hacks to trim down some of the npms
function trimDeps {
    if [ -d "$STAGING/kui/node_modules/lodash" ]; then
        (cd "$STAGING/kui/node_modules" \
             && mv lodash/lodash.min.js ___lodash.js \
             && mv lodash/index.js ___lodash2.js \
             && rm -rf lodash/* \
             && mv ___lodash.js lodash/lodash.js \
             && mv ___lodash2.js lodash/index.js)
    fi

    if [ -d "$STAGING/kui/node_modules/async" ]; then
        (cd "$STAGING/kui/node_modules" \
             && rm async/*.js \
             && rm async/dist/async.js && mv async/dist/async.min.js async/dist/async.js)
    fi

    if [ -d "$STAGING/kui/node_modules/terser" ]; then
        (cd "$STAGING/kui/node_modules/terser" \
             && rm -rf tools bin lib)
    fi

    if [ -d "$STAGING/kui/node_modules/js-yaml" ]; then
        (cd "$STAGING/kui/node_modules/js-yaml" \
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
    if [ -z "$NO_ZIPS" ]; then
        echo "Building headless dist to $BUILDDIR/$DEST and $BUILDDIR/$DEST_TGZ"
        rm -f "$BUILDDIR/$DEST" "$BUILDDIR/$DEST_TGZ"
    else
        echo "Building headless dist to $STAGING/kui"
    fi

    # word of warning for linux: in the TAR command below, the `-cf -` has
    # to come before the --exclude rules!

    (cd "$STAGING" && rm -rf kui && mkdir kui && mkdir kui/bin && \
         "$TAR" -C "$TOPDIR" -cf - \
             --exclude "./kui" \
             --exclude ".git*" \
             --exclude "./tools" \
             --exclude ".travis*" \
             --exclude "lerna-debug.log" \
             --exclude "./docs" \
             --exclude "./node_modules" \
             --exclude "./packages/kui-builder" \
             --exclude "./packages/proxy" \
             --exclude "./build/*/node_modules/*" \
             --exclude "./plugins/*/node_modules/*" \
             --exclude "**/node_modules/electron*/*" \
             --exclude "./packages/app/content/icons/*" \
             --exclude "./packages/app/content/images/*" \
             --exclude "**/*~" \
             --exclude "**/.bak" \
             --exclude "**/*.map" \
             --exclude "**/*.png" \
             --exclude "**/*.icns" \
             --exclude "**/*.ico" \
             --exclude "./packages/app/build/webpack-stats.html" \
             --exclude "node_modules/monaco-editor" \
             --exclude "node_modules/fsevents" \
             --exclude "node_modules/elkjs" \
             --exclude "node_modules/d3" \
             --exclude "node_modules/jquery" \
             --exclude "node_modules/typescript" \
             --exclude "./plugins/plugin-editor" \
             --exclude "./plugins/plugin-manager" \
             --exclude "./plugins/plugin-grid" \
             --exclude "./plugins/plugin-openwhisk-debug" \
             --exclude "./plugins/plugin-tutorials" \
             --exclude "./plugins/plugin-wskflow" \
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
         node -e 'const pjson = require("./kui/package.json"); delete pjson.devDepdencies; pjson.scripts.test = `SCRIPTDIR=$(cd $(dirname \"$0\") && pwd); cd tests && npm install --no-package-lock && APP=../.. RUNNING_SHELL_TEST=true TEST_ROOT=$SCRIPTDIR/tests KUI=$\{KUI-$SCRIPTDIR/bin/kui\} npx mocha -c --exit --bail --recursive -t 60000 tests --grep "\$\{TEST_FILTER:-.*\}"`; require("fs").writeFileSync("./kui/package.json", JSON.stringify(pjson, undefined, 2))' && \
         (cd kui && cp package.json bak.json) && \
         (cd kui && npx lerna link convert) && \
         (node -e 'const pjson = require("./kui/package.json"); const pjson2 = require("./kui/bak.json"); for (let k in pjson2.dependencies) pjson.dependencies[k] = pjson2.dependencies[k]; require("fs").writeFileSync("./kui/package.json", JSON.stringify(pjson, undefined, 2))') && \
         (cd kui && rm bak.json) && \
         (cd kui && npm install --production --ignore-scripts --no-package-lock) && \
         (cd kui && link-build-assets.sh) && \
         trimDeps && \
         cp "$BUILDERDIR"/dist/bin/kui.cmd kui/bin/kui.cmd && \
         (find -L kui/tests/tests/passes/ -name '*headless*.js' -prune -o -type f -exec rm {} \; || true) && \
         (find -L kui/tests/data -type d -name headless -prune -o -type f -exec rm {} \; || true) && \
         if [ -z "$NO_ZIPS" ]; then "$TAR" -jcf "$BUILDDIR/$DEST_TGZ" \
                --exclude "node_modules/@types" \
                --exclude "node_modules/js-beautify" \
                --exclude "node_modules/.bin" \
                --exclude "**/*-debug.log" \
                --exclude "**/.bak" \
                --exclude "**/*.map" \
                --exclude "**/*.png" \
                --exclude "**/*.icns" \
                --exclude "**/*.ico" \
                --exclude "lerna.json" \
                --exclude "**/yarn.lock" \
                --exclude "**/*.debug.js" \
                --exclude "**/package-lock.json" \
                kui; fi)

    if [ $? != 0 ]; then
        exit $?
    fi

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
    echo "Done. Here is what we built:"
    if [ -z "$NO_ZIPS" ]; then
        ls -lh "$BUILDDIR"/*headless*
    else
        ls -lh "$STAGING"/kui
    fi
fi

#         cp tests/data/openwhisk/foo.js tests/data/openwhisk/echo.js kui/tests/data/openwhisk && \
#         (cd kui/tests && cp -a $TOPDIR/tests/lib .) && \
#             --exclude "./plugins/*/tests/data/**" \
