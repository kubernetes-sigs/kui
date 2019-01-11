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

cd $SCRIPTDIR

#
# ignore these files when bundling the ASAR (this is a regexp, not glob pattern)
# see the electron-packager docs for --ignore
#
IGNORE='(~$)|(\.ts$)|(^/dist)|(^/tests)|(monaco-editor/esm)'
      
#
# input params: choose a platform to build for (default: all)
#
PLATFORM=${1-all}

# product name
export PRODUCT_NAME="${PRODUCT_NAME-`cat $APPDIR/build/config.json | jq --raw-output .productName`}"

# filesystem icons
ICON_MAC=../`cat $APPDIR/build/config.json | jq --raw-output .filesystemIcons.darwin`
ICON_WIN32=../`cat $APPDIR/build/config.json | jq --raw-output .filesystemIcons.win32`
ICON_LINUX=../`cat $APPDIR/build/config.json | jq --raw-output .filesystemIcons.linux`

VERSION=`git rev-parse master`

# if we're running a test against a dist build, then we need to tell
# electron-packager to keep around devDependencies
if [ -n "${TEST_FROM_BUILD}" ]; then
    NO_PRUNE=--no-prune
    NO_INSTALLER=true
else
    # by default, we want to uglify the javascript
    export UGLIFY=true
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

    # assemble plugins
    ../bin/compile.js

    if [ $? -ne 0 ]; then exit 1; fi

    # minify the css
    cp $APPDIR/content/css/ui.css /tmp
    ./node_modules/.bin/minify /tmp/ui.css
    cp /tmp/ui.min.css $APPDIR/content/css/ui.css

    VERSION=`cat $APPDIR/package.json | jq --raw-output .version`
    echo "$VERSION" > $APPDIR/.version
    
    if [ "$BUILD_ENV" == "production" ]; then (cd $APPDIR/plugins; for i in modules/!(*-preload); do echo "remove devDependencies packages in $i"; (cd $i && npm prune --production); done); fi
}

function cleanup {
    rm $APPDIR/.version
    cp /tmp/ui.css $APPDIR/content/css/ui.css
}

function win32 {
    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "win32" ] || [ "$PLATFORM" == "windows" ]; then
        # create the bundles
        echo "Electron build for win32"

        ./node_modules/.bin/electron-packager \
	    $TOPDIR \
	    "$PRODUCT_NAME" \
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

        # CLI scripts
        # cp ../fsh.js "$BUILDDIR/${PRODUCT_NAME}-win32-x64/fsh"

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
        echo "Electron build darwin"

        ./node_modules/.bin/electron-packager \
	    $TOPDIR \
	    "${PRODUCT_NAME}" \
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

        # CLI script
        # cp ../fsh.js "$BUILDDIR/${PRODUCT_NAME}-darwin-x64/${PRODUCT_NAME}.app/Contents/MacOS/fsh"

        # create the installers
        #if [ -n "$ZIP_INSTALLER" ]; then
        #node ./builders/zip.js

        if [ -z "$NO_INSTALLER" ]; then
            if [ -z "$NO_MAC_DMG_INSTALLER" ]; then
                echo "DMG build for darwin"
                ./node_modules/.bin/electron-installer-dmg \
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

        ./node_modules/.bin/electron-packager \
	    $TOPDIR \
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

        # CLI script
        # cp ../fsh.js "$BUILDDIR/${PRODUCT_NAME}-linux-x64/fsh"

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
