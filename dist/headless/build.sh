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
TOPDIR="$SCRIPTDIR/../../"
APPDIR="$TOPDIR/app"
export BUILDDIR=../builds

cd "$SCRIPTDIR"

# product name
export PRODUCT_NAME="${PRODUCT_NAME-`cat $APPDIR/build/config.json | jq --raw-output .productName`}"

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

    if [ ! -d $APPDIR/node_modules/electron ]; then
        # in case we had a failed build-headless in the past
        (cd $APPDIR && npm install electron)
    fi

    # assemble plugins and by default, we want to uglify the javascript
    UGLIFY=true ../bin/compile.js
    if [ $? -ne 0 ]; then
        echo "Error in uglify $?"
        exit 1
    fi

    echo "Done with uglify"

    # minify the css
    cp $APPDIR/content/css/ui.css /tmp
    ./node_modules/.bin/minify /tmp/ui.css
    cp /tmp/ui.min.css $APPDIR/content/css/ui.css

    VERSION=`cat $APPDIR/package.json | jq --raw-output .version`
    echo "$VERSION" > $APPDIR/.version

    # corral any module-specific tests
    (cd $TOPDIR/tests && ./bin/corral.sh)

    # echo "npm prune pass"
    (cd $APPDIR && npm prune --production)
    # echo "done with npm prune pass"

    # hack to trim headless build
    (cd $APPDIR/plugins/node_modules \
         && rm -rf lodash.bak async.bak path-parse.bak \
         && cp -r lodash lodash.bak \
         && mv lodash/lodash.min.js ___lodash.js \
         && mv lodash/index.js ___lodash2.js \
         && rm -rf lodash/* \
         && mv ___lodash.js lodash/lodash.js \
         && mv ___lodash2.js lodash/index.js \
         ; cp -r async async.bak \
         && rm async/dist/async.js && mv async/dist/async.min.js async/dist/async.js \
         ; cp -r path-parse path-parse.bak \
         && rm path-parse/index.js && mv path-parse/index.min.js path-parse/index.js \
         && rm path-parse/test.js && mv path-parse/test.min.js path-parse/test.js)
    
    (cd $APPDIR/plugins; for i in modules/!(*-preload); do \
      if [ -d "$i/node_modules/js-yaml" ]; then \
        rm -rf $i/node_modules/js-yaml.bak && cp -r $i/node_modules/js-yaml $i/node_modules/js-yaml.bak \
        && rm $i/node_modules/js-yaml/dist/js-yaml.js && mv $i/node_modules/js-yaml/dist/js-yaml.min.js $i/node_modules/js-yaml/dist/js-yaml.js; \
      fi; done)
}

function cleanup {
    echo "Cleanup"
    echo "--------------------"

    # undo trim headless hack
    (cd $APPDIR/plugins/node_modules; \
     rm -rf lodash async path-parse; \
     mv lodash.bak lodash; \
     mv async.bak async; \
     mv path-parse.bak path-parse)
           
    (cd $APPDIR/plugins; for i in modules/!(*-preload); do if [ -d "$i/node_modules/js-yaml" ]; then rm -rf $i/node_modules/js-yaml && mv $i/node_modules/js-yaml.bak $i/node_modules/js-yaml; fi; done)
    
    rm $APPDIR/.version

    cp /tmp/ui.css $APPDIR/content/css/ui.css

    # undo npm prune
    (cd $TOPDIR && UGLIFY=false npm install)

    git checkout "$APPDIR/package-lock.json"
}

function build {
    DEST="${PRODUCT_NAME}-headless.zip"
    DEST_TGZ="${PRODUCT_NAME}-headless.tar.bz2"

    rm -f "$BUILDDIR/$DEST"
    (cd $TOPDIR && rm -rf kui && mkdir kui && tar -C app -cf - . | tar -C kui -xf - && \
         cp kui/bin/kui.js kui/bin/kui && \
         cp dist/bin/kui.cmd kui/bin/kui.cmd && \
         mkdir -p kui/tests/tests/passes/composer2 && \
         cp tests/tests/passes/composer2/*headless.js kui/tests/tests/passes/composer2 && \
         mkdir -p kui/tests/tests/passes/openwhisk1 && \
         cp tests/tests/passes/openwhisk1/*headless.js kui/tests/tests/passes/openwhisk1 && \
         mkdir -p kui/tests/data && \
         (cd kui && ln -s . app) && \
         mkdir -p kui/tests/data/openwhisk && \
         cp tests/data/openwhisk/foo.js tests/data/openwhisk/echo.js kui/tests/data/openwhisk && \
         node -e 'const pjson = require("./kui/package.json"); pjson.scripts.test = `SCRIPTDIR=$(cd $(dirname \"$0\") && pwd); npm install mocha openwhisk; APP=.. RUNNING_SHELL_TEST=true TEST_ROOT=$SCRIPTDIR/tests KUI=$\{KUI-$SCRIPTDIR/bin/kui\} mocha -c --exit --bail --recursive -t 60000 tests/tests --grep "\$\{TEST_FILTER:-.*\}"`; require("fs").writeFileSync("./kui/package.json", JSON.stringify(pjson, undefined, 2))' && \
         (cd kui/tests && cp -a $TOPDIR/tests/lib .) && \
         tar --exclude "kui/**/node_modules/electron*/*" \
             --exclude "kui/bin/postinstall.js" \
             --exclude "kui/content/icons/*" \
             --exclude "kui/content/images/*" \
             --exclude "**/*~" \
             --exclude "**/*.map" \
             --exclude "kui/**/*.png" \
             --exclude "kui/**/*.icns" \
             --exclude "kui/**/*.ico" \
             --exclude "kui/bin/*.sh" \
             --exclude "kui/bin/build.js" \
             --exclude "kui/bin/seticon.js" \
             --exclude "kui/build/*.br" \
             --exclude "kui/build/webpack-stats.html" \
             --exclude "kui/plugins/modules/*/tests/data/**" \
             --exclude "kui/plugins/modules/*/tests/passes/**" \
             --exclude "kui/plugins/modules/local/node_modules/*" \
             --exclude "kui/plugins/modules/plugin/*" \
             --exclude "kui/plugins/modules/editor/node_modules*" \
             --exclude "kui/**/node_modules/fsevents/*" \
             --exclude "kui/**/node_modules/elkjs/*" \
             --exclude "kui/**/node_modules/d3/*" \
             --exclude "kui/**/node_modules/jquery/*" \
             --exclude "kui/**/node_modules/typescript/*" \
             --exclude "kui/**/node_modules/@types/*" \
             --exclude "kui/**/wskflow/node_modules/*" \
             --exclude "kui/**/*.ts" \
             --exclude "**/package-lock.json" \
             --exclude "**/node_modules/*.bak/*" \
             --exclude "**/node_modules/**/*.md" \
             --exclude "**/node_modules/**/*.DOCS" \
             --exclude "**/node_modules/**/LICENSE" \
             --exclude "**/node_modules/**/docs/**/*.html" \
             --exclude "**/node_modules/**/docs/**/*.png" \
             --exclude "**/node_modules/**/docs/**/*.js" \
             --exclude "**/node_modules/**/test/*" \
             --exclude "**/node_modules/js-beautify/*" \
             -jcf "$SCRIPTDIR/$BUILDDIR/$DEST_TGZ" kui && \
         rm kui/bin/kui && \
         rm -rf kui)

    TEMP="`mktemp -d`"
    (cd "$TEMP" && \
         tar jxf "$SCRIPTDIR/$BUILDDIR/$DEST_TGZ" && \
         rm kui/app && \
         zip -q -r "$SCRIPTDIR/$BUILDDIR/$DEST" kui)
    rm -rf "$TEMP"
}

init && build && cleanup
echo "build-headless.sh finished, here is what we think we built:"
ls -lh $BUILDDIR/*headless*
