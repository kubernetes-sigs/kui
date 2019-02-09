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

#
# @param $1 staging directory
# @param $2 platform (optional) defaulting to all platforms
#
STAGING="${1-`pwd`}"
PLATFORM=${2-all}

STAGING="$(cd $STAGING && pwd)/kui-electron-tmp"
echo "staging directory: $STAGING"

CLIENT_HOME="$(pwd)"
APPDIR="$STAGING"/packages/app
CORE_HOME="$STAGING"/node_modules/@kui-shell/core
BUILDER_HOME="$STAGING"/node_modules/@kui-shell/builder
export BUILDDIR="$CLIENT_HOME"/dist/electron

KUI_BUILD_CONFIG=${KUI_BUILD_CONFIG-"$CLIENT_HOME"/theme}

#
# ignore these files when bundling the ASAR (this is a regexp, not glob pattern)
# see the electron-packager docs for --ignore
#
IGNORE='(~$)|(\.ts$)|(monaco-editor/esm)|(lerna.json)|(node_modules/@kui-plugin)'

set +e
VERSION=`git rev-parse master 2> /dev/null`
if [ $? != 0 ]; then VERSION=dev; fi
set -e

# we will manage devDep pruning ourselves
#NO_PRUNE=--no-prune

if [[ `uname` == Darwin ]]; then
    # see bin/postinstall; we use brew to ensure we have gtar
    TAR=gtar
else
    TAR=tar
fi

function tarCopy {
    # word of warning for linux: in the TAR command below, the `-cf -` has
    # to come before the --exclude rules!
    "$TAR" -C "$CLIENT_HOME" -cf - \
           --exclude "./npm-packs" \
           --exclude "./kui" \
           --exclude "./kui-*-tmp" \
           --exclude "./bin" \
           --exclude "./dist" \
           --exclude "./tools" \
           --exclude "./dist" \
           --exclude "./builds" \
           --exclude "./tests" \
           --exclude "./docs/dev" \
           --exclude "**/package-lock.json" \
           --exclude "lerna-debug.log" \
           --exclude ".git*" \
           --exclude ".travis*" \
           --exclude "./build/*/node_modules/*" \
           --exclude "./packages/*/node_modules/*" \
           --exclude "./plugins/*/node_modules/*" \
           --exclude "./packages/*/dist" \
           --exclude "./plugins/*/build" \
           --exclude "./plugins/*/dist" \
           --exclude "**/*~" \
           --exclude "**/.bak" \
           --exclude "**/yarn.lock" \
           --exclude "**/*.debug.js" \
	   --exclude "monaco-editor/esm" \
           --exclude "node_modules/*.bak/*" \
           --exclude "node_modules/**/*.md" \
           --exclude "node_modules/**/*.DOCS" \
           --exclude "node_modules/**/LICENSE" \
           --exclude "node_modules/**/docs/**/*.html" \
           --exclude "node_modules/**/docs/**/*.png" \
           --exclude "node_modules/**/docs/**/*.js" \
           --exclude "node_modules/**/test/*" . \
        | "$TAR" -C "$STAGING" -xf -

    echo "tar copy done"
}

# TODO share this with headless/build.sh, as they are identical
function configure {
    UGLIFY=true npx --no-install kui-compile
    CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" node "$BUILDER_HOME"/lib/configure.js

    # we need to get @kui-shell/settings into the package
    # dependencies, so that electron's prune code (which seems to be
    # equivalent, in this regard, to an npm prune --production) does
    # not remove it; i.e. a self-managed symlink is not sufficient
    (cd "$STAGING" && npm install --save ./packages/app/build)
}

function init {
    rm -rf "$STAGING"
    mkdir -p "$STAGING"
    cd "$STAGING"
}

function build {
    init
    tarCopy
    configure

    export ELECTRON_VERSION=$(BUILDER_HOME=$BUILDER_HOME node -e 'console.log((require(require("path").join(process.env.BUILDER_HOME, "package.json")).dependencies.electron).replace(/^[^~]/, ""))')

    # product name
    export PRODUCT_NAME="${PRODUCT_NAME-`cat $APPDIR/build/config.json | jq --raw-output .theme.productName`}"

    # filesystem icons
    ICON_MAC="$KUI_BUILD_CONFIG"/`cat $APPDIR/build/config.json | jq --raw-output .theme.filesystemIcons.darwin`
    ICON_WIN32="$KUI_BUILD_CONFIG"/`cat $APPDIR/build/config.json | jq --raw-output .theme.filesystemIcons.win32`
    ICON_LINUX="$KUI_BUILD_CONFIG"/`cat $APPDIR/build/config.json | jq --raw-output .theme.filesystemIcons.linux`

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

    # make the build directory
    mkdir -p "$BUILDDIR"

    # minify the core css
    (cd "$BUILDER_HOME/dist/electron" && npm install) # to pick up `minify`
    CSS_SOURCE="$CORE_HOME"/web/css
    CSS_TARGET="$APPDIR"/build/css
    mkdir -p "$CSS_TARGET"
    echo "Minifying core CSS to this directory: $CSS_TARGET"
    for i in "$CSS_SOURCE"/*.css; do
        css=`basename $i`
        echo -n "Minifying $css... "
        cp "$i" /tmp/"$css"
        (cd "$BUILDER_HOME/dist/electron" && npx --no-install minify /tmp/"$css")
        cp /tmp/"$css" "$CSS_TARGET"/"$css"
    done

    rm -f "$STAGING"/packages/app/build/build
}

function cleanup {
    if [ -z "$NO_CLEAN" ] && [ -z "$TARBALL_ONLY" ]; then
        rm -rf "$STAGING"
    fi
}

function win32 {
    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "win32" ] || [ "$PLATFORM" == "windows" ]; then
        # create the bundles
        echo "Electron build for win32"

        (cd "$BUILDER_HOME/dist/electron" && npx --no-install electron-packager \
	    "$STAGING" \
	    "${PRODUCT_NAME}" \
            ${NO_PRUNE} \
            --electron-version $ELECTRON_VERSION \
	    --asar \
	    --ignore="$IGNORE" \
            --build-version=$VERSION \
	    --out=$BUILDDIR \
	    --platform=win32 \
	    --icon=$ICON_WIN32 \
	    --protocol=wsk --protocol-name="Execute ${PRODUCT_NAME} commands" \
	    --overwrite \
	    --win32metadata.CompanyName="Apache" \
	    --win32metadata.ProductName="${PRODUCT_NAME}")

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

        (cd "$BUILDER_HOME/dist/electron" && npx --no-install electron-packager \
	    "$STAGING" \
	    "${PRODUCT_NAME}" \
            ${NO_PRUNE} \
            --electron-version $ELECTRON_VERSION \
	    --asar \
	    --ignore="$IGNORE" \
            --build-version=$VERSION \
	    --out=$BUILDDIR \
	    --platform=darwin \
	    --icon=$ICON_MAC \
	    --protocol=wsk --protocol-name="Execute ${PRODUCT_NAME} commands" \
	    --overwrite)

        # use a custom icon for mac
        cp $ICON_MAC "$BUILDDIR/${PRODUCT_NAME}-darwin-x64/${PRODUCT_NAME}.app/Contents/Resources/electron.icns"

        # create the installers
        #if [ -n "$ZIP_INSTALLER" ]; then
        #node ./builders/zip.js

        if [ -z "$NO_INSTALLER" ]; then
            if [ -z "$NO_MAC_DMG_INSTALLER" ]; then
                echo "DMG build for darwin"
                (cd "$BUILDER_HOME/dist/electron" && npx --no-install electron-installer-dmg \
	            "$BUILDDIR/${PRODUCT_NAME}-darwin-x64/${PRODUCT_NAME}.app" \
	            "${PRODUCT_NAME}" \
	            --out="$BUILDDIR" \
	            --icon="$ICON_MAC" \
	            --icon-size=128 \
	            --overwrite) &
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

        (cd "$BUILDER_HOME/dist/electron" && npx --no-install electron-packager \
	    "$STAGING" \
	    "${PRODUCT_NAME}" \
            ${NO_PRUNE} \
            --electron-version $ELECTRON_VERSION \
	    --asar \
	    --ignore="$IGNORE" \
            --build-version=$VERSION \
	    --out=$BUILDDIR \
	    --platform=linux \
	    --protocol=wsk --protocol-name="Execute ${PRODUCT_NAME} commands" \
            --icon=$ICON_LINUX \
	    --overwrite)

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
build
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

PRETTY_BUILDDIR="$(node -e 'console.log(require("path").normalize(process.env.BUILDDIR))')"
echo "electron client build finished, here is what we built in $PRETTY_BUILDDIR:"
ls -lh "$BUILDDIR" | grep -v headless

exit $CODE
