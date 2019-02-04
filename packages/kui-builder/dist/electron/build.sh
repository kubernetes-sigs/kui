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
STAGING="$SCRIPTDIR/kui"
APPDIR="$STAGING/packages/app"
KUI_BUILD_CONFIG=${KUI_BUILD_CONFIG-"$SCRIPTDIR"/../../examples/build-configs/default}
export BUILDDIR=$SCRIPTDIR/../builds

initialDirectory=`pwd`
cd $SCRIPTDIR

#
# ignore these files when bundling the ASAR (this is a regexp, not glob pattern)
# see the electron-packager docs for --ignore
#
IGNORE='(~$)|(\.ts$)|(monaco-editor/esm)|(lerna.json)|(node_modules/@kui-plugin)'
      
#
# input params: choose a platform to build for (default: all)
#
PLATFORM=${1-all}

VERSION=`git rev-parse master`

# we will manage devDep pruning ourselves
NO_PRUNE=--no-prune

# if we're running a test against a dist build, then we need to tell
# electron-packager to keep around devDependencies
if [ -n "${TEST_FROM_BUILD}" ]; then
    NO_INSTALLER=true
else
    # by default, we want to uglify the javascript
    #    export UGLIFY=true
    echo "uglify disabled"
fi

if [[ `uname` == Darwin ]]; then
    # see bin/postinstall; we use brew to ensure we have gtar
    TAR=gtar
else
    TAR=tar
fi

function init {
    # word of warning for linux: in the TAR command below, the `-cf -` has
    # to come before the --exclude rules!

    (rm -rf "$STAGING" && mkdir "$STAGING" && cd $TOPDIR && \
         "$TAR" -C . -cf - \
             --exclude "**/kui/*" \
             --exclude "./bin" \
             --exclude "./tools" \
             --exclude "./dist" \
             --exclude "./tests" \
             --exclude "./docs/dev" \
             --exclude ".git*" \
             --exclude ".travis*" \
             --exclude "./node_modules" \
             --exclude "./packages/kui-builder" \
             --exclude "./packages/proxy" \
             --exclude "./build/*/node_modules" \
             --exclude "./plugins/*/node_modules" \
             --exclude "./packages/*/dist" \
             --exclude "./plugins/*/build" \
             --exclude "./plugins/*/dist" \
             --exclude "**/*~" \
             --exclude "**/.bak" \
             --exclude "**/*.ts" \
             --exclude "**/yarn.lock" \
             --exclude "**/*.debug.js" \
             --exclude "**/package-lock.json" \
	     --exclude "monaco-editor/esm" \
             --exclude "node_modules/*.bak/*" \
             --exclude "node_modules/**/*.md" \
             --exclude "node_modules/**/*.DOCS" \
             --exclude "node_modules/**/LICENSE" \
             --exclude "node_modules/**/docs/**/*.html" \
             --exclude "node_modules/**/docs/**/*.png" \
             --exclude "node_modules/**/docs/**/*.js" \
             --exclude "node_modules/**/test/*" . \
             | "$TAR" -C "$STAGING" -xf -)
    echo "tar copy done"

    (cd "$STAGING" && \
         cp package.json bak.json && \
         npx lerna link convert && \
         (node -e 'const pjson = require("./package.json"); const pjson2 = require("./bak.json"); for (let k in pjson2.dependencies) pjson.dependencies[k] = pjson2.dependencies[k]; require("fs").writeFileSync("./package.json", JSON.stringify(pjson, undefined, 2))') && \
         npm install --production --ignore-scripts --no-package-lock && \
         ("$TOPDIR"/packages/kui-builder/bin/link-build-assets.sh) && \
         (cd "$initialDirectory" && KUI_STAGE="$STAGING" node "$TOPDIR"/packages/kui-builder/lib/configure.js) && \
         rm bak.json)
    if [ $? != 0 ]; then
        exit $?
    fi
    echo "lerna magic done"

    if [ -d "$KUI_BUILD_CONFIG"/css ]; then
        echo "copying in theme css"
        cp -r "$KUI_BUILD_CONFIG"/css/ "$STAGING"/packages/app/build/css/
    fi
    if [ -d "$KUI_BUILD_CONFIG"/icons ]; then
        echo "copying in theme icons"
        cp -r "$KUI_BUILD_CONFIG"/icons "$STAGING"/packages/app/build
    fi
    if [ -d "$KUI_BUILD_CONFIG"/images ]; then
        echo "copying in theme images"
        cp -r "$KUI_BUILD_CONFIG"/images "$STAGING"/packages/app/build
    fi

    if [ -n "$TARBALL_ONLY" ]; then exit; fi

    # product name
    export PRODUCT_NAME="${PRODUCT_NAME-`cat $APPDIR/build/config.json | jq --raw-output .theme.productName`}"

    # filesystem icons
    ICON_MAC="$KUI_BUILD_CONFIG"/`cat $APPDIR/build/config.json | jq --raw-output .theme.filesystemIcons.darwin`
    ICON_WIN32="$KUI_BUILD_CONFIG"/`cat $APPDIR/build/config.json | jq --raw-output .theme.filesystemIcons.win32`
    ICON_LINUX="$KUI_BUILD_CONFIG"/`cat $APPDIR/build/config.json | jq --raw-output .theme.filesystemIcons.linux`

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

    # assemble plugins
    # (cd "$STAGING" && "$SCRIPTDIR"/bin/compile.js
    # if [ $? -ne 0 ]; then exit 1; fi

    # minify the css
    cp $APPDIR/web/css/ui.css /tmp
    npx minify /tmp/ui.css
    cp /tmp/ui.min.css $APPDIR/web/css/ui.css

    VERSION=`cat $APPDIR/package.json | jq --raw-output .version`
    echo "$VERSION" > $APPDIR/.version
    
    # (cd "$STAGING" && npm prune --production)
}

function cleanup {
    if [ -z "$NO_CLEAN" ] && [ -z "$TARBALL_ONLY" ]; then
        rm -rf "$SCRIPTDIR/kui"
    fi
}

function win32 {
    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "win32" ] || [ "$PLATFORM" == "windows" ]; then
        # create the bundles
        echo "Electron build for win32"

        npx electron-packager \
	    "$STAGING" \
	    "${PRODUCT_NAME}" \
            ${NO_PRUNE} \
	    --asar \
	    --ignore="$IGNORE" \
            --build-version=$VERSION \
	    --out=$BUILDDIR \
	    --platform=win32 \
	    --icon=$ICON_WIN32 \
	    --protocol=wsk --protocol-name="Execute ${PRODUCT_NAME} commands" \
	    --overwrite \
	    --win32metadata.CompanyName="Apache" \
	    --win32metadata.ProductName="${PRODUCT_NAME}"

        #
        # deal with win32 packaging
        #
        if [ -z "$NO_INSTALLER" ]; then
            echo "Zip build for win32"
            (cd $BUILDDIR && zip -q -r "${PRODUCT_NAME}-win32-x64" "${PRODUCT_NAME}-win32-x64" -x \*~) &
            WIN_ZIP_PID=$!

            # build squirrel and msi installers
            # SETUP_ICON=$ICON_WIN32 node builders/squirrel.js
            # SETUP_ICON=$ICON_WIN32 node builders/msi.js
        fi
    fi
}


#
# deal with darwin/macOS packaging
#
function mac {
    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "mac" ] || [ "$PLATFORM" == "macos" ] || [ "$PLATFORM" == "darwin" ]; then
        echo "Electron build darwin $STAGING"

        npx electron-packager \
	    "$STAGING" \
	    "${PRODUCT_NAME}" \
            ${NO_PRUNE} \
	    --asar \
	    --ignore="$IGNORE" \
            --build-version=$VERSION \
	    --out=$BUILDDIR \
	    --platform=darwin \
	    --icon=$ICON_MAC \
	    --protocol=wsk --protocol-name="Execute ${PRODUCT_NAME} commands" \
	    --overwrite

        # use a custom icon for mac
        cp $ICON_MAC "$BUILDDIR/${PRODUCT_NAME}-darwin-x64/${PRODUCT_NAME}.app/Contents/Resources/electron.icns"

        # create the installers
        #if [ -n "$ZIP_INSTALLER" ]; then
        #node ./builders/zip.js

        if [ -z "$NO_INSTALLER" ]; then
            if [ -z "$NO_MAC_DMG_INSTALLER" ]; then
                echo "DMG build for darwin"
                npx electron-installer-dmg \
	            "$BUILDDIR/${PRODUCT_NAME}-darwin-x64/${PRODUCT_NAME}.app" \
	            "${PRODUCT_NAME}" \
	            --out="$BUILDDIR" \
	            --icon="$ICON_MAC" \
	            --icon-size=128 \
	            --overwrite &
                MAC_DMG_PID=$!
            fi

            echo "TGZ build for darwin"
            tar -C "$BUILDDIR" -jcf "$BUILDDIR/${PRODUCT_NAME}-darwin-x64.tar.bz2" "${PRODUCT_NAME}-darwin-x64" &
            MAC_TAR_PID=$!
        fi
    fi
}

#
# deal with linux packaging
#
function linux {
    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "linux" ]; then
        echo "Electron build linux"

        npx electron-packager \
	    "$STAGING" \
	    "${PRODUCT_NAME}" \
            ${NO_PRUNE} \
	    --asar \
	    --ignore="$IGNORE" \
            --build-version=$VERSION \
	    --out=$BUILDDIR \
	    --platform=linux \
	    --protocol=wsk --protocol-name="Execute ${PRODUCT_NAME} commands" \
            --icon=$ICON_LINUX \
	    --overwrite

        if [ -z "$NO_INSTALLER" ]; then
            echo "Zip build for linux"
            (cd $BUILDDIR && zip -q -r "${PRODUCT_NAME}-linux-x64" "${PRODUCT_NAME}-linux-x64" -x \*~) &
            LINUX_ZIP_PID=$!

            echo "DEB build for linux"
            ./builders/deb.sh &
            LINUX_DEB_PID=$!
        fi
    fi
}


# line up the work
init
win32
mac
linux

# exit code; we'll check the builders in a second, and possibly alter
# the exit code based on their exit codes
CODE=0

# check to see if any of the builders failed; we backgrounded them, so
# this is a bit convulated, in bash
if [ -n "$WIN_ZIP_PID" ]; then
    wait $WIN_ZIP_PID
    if [ $? != 0 ]; then
        echo "Error with windows zip build"
        CODE=1
    fi
fi

if [ -n "$MAC_DMG_PID" ]; then
    wait $MAC_DMG_PID
    if [ $? != 0 ]; then
        echo "Error with mac dmg build"
        CODE=1
    fi
fi

if [ -n "$MAC_TAR_PID" ]; then
    wait $MAC_TAR_PID
    if [ $? != 0 ]; then
        echo "Error with mac tar build"
        CODE=1
    fi
fi

if [ -n "$LINUX_ZIP_PID" ]; then
    wait $LINUX_ZIP_PID
    if [ $? != 0 ]; then
        echo "Error with linux zip build"
        CODE=1
    fi
fi

if [ -n "$LINUX_DMG_PID" ]; then
    wait $LINUX_DMG_PID
    if [ $? != 0 ]; then
        echo "Error with linux dmg build"
        CODE=1
    fi
fi

wait
cleanup

echo "build.sh finished, here is what we think we built:"
ls -lh "$BUILDDIR" | grep -v headless

exit $CODE
