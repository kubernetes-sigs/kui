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
# @param $2 platform (optional) defaulting to all platforms (you may also set this via PLATFORM env)
#
STAGING="${1-`pwd`}"
PLATFORM=${2-${PLATFORM-all}}

STAGING="$(cd $STAGING && pwd)/kui-electron-tmp"
echo "staging directory: $STAGING"

CLIENT_HOME="$(pwd)"
APPDIR="$STAGING"/node_modules/@kui-shell
CORE_HOME="$STAGING"/node_modules/@kui-shell/core
BUILDER_HOME="$STAGING"/node_modules/@kui-shell/builder
export BUILDDIR="$CLIENT_HOME"/dist/electron

#
# ignore these files when bundling the ASAR (this is a regexp, not glob pattern)
# see the electron-packager docs for --ignore
#
IGNORE='(~$)|(\.ts$)|(monaco-editor/esm)|(monaco-editor/dev)|(monaco-editor/min-maps)|(lerna.json)'

#
# client version; note rcedit.exe fails if the VERSION is "dev"
#
set +e
VERSION=$(cat "$CLIENT_HOME"/package.json | jq --raw-output .version)
if [ $? != 0 ]; then VERSION=0.0.1; fi
set -e
echo "Using VERSION=$VERSION"

function tarCopy {
  if [[ `uname` == Darwin ]]; then
      which gtar || brew install gnu-tar
      TAR=gtar
  else
      TAR=tar
  fi
    # word of warning for linux: in the TAR command below, the `-cf -` has
    # to come before the --exclude rules!
    "$TAR" -C "$CLIENT_HOME" -cf - \
           --exclude "./npm-packs" \
           --exclude "./theme" \
           --exclude "./kui" \
           --exclude "./kui-*-tmp" \
           --exclude "./bin" \
           --exclude "./dist" \
           --exclude "./tools" \
           --exclude "./builds" \
           --exclude "./tests" \
           --exclude "./docs/dev" \
           --exclude "**/package-lock.json" \
           --exclude "lerna-debug.log" \
           --exclude ".git*" \
           --exclude ".travis*" \
           --exclude "node_modules/@kui-shell/build" \
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
	   --exclude "monaco-editor/dev" \
	   --exclude "monaco-editor/esm" \
	   --exclude "monaco-editor/min-maps" \
           --exclude "node_modules/@types" \
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

    if [ -n "$TARBALL_ONLY" ]; then exit; fi
}

# TODO share this with headless/build.sh, as they are identical
function configure {
    # so that electron's prune doesn't eliminate @kui-shell/settings
    mkdir "$STAGING"/settings
    echo '{ "name": "@kui-shell/settings", "version": "0.0.1" }' > "$STAGING"/settings/package.json
    npm install --save --no-package-lock --ignore-scripts "$STAGING"/settings

    CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" node "$BUILDER_HOME"/lib/configure.js
    UGLIFY=true npx --no-install kui-prescan
}

function init {
    rm -rf "$STAGING"
    mkdir -p "$STAGING"
    cd "$STAGING"

    # make the build directory
    mkdir -p "$BUILDDIR"
}

# check for prerequisites
function prereq {
    if [ ! -d theme ]; then
        echo "Your client directory does not define a theme/ subdirectory"
        exit 1
    fi
}

function assembleHTMLPieces {
    export ELECTRON_VERSION=$(BUILDER_HOME=$BUILDER_HOME node -e 'console.log((require(require("path").join(process.env.BUILDER_HOME, "dist/electron/package.json")).devDependencies.electron).replace(/^[~^]/, ""))')
    echo "ELECTRON_VERSION=$ELECTRON_VERSION"

    # product name
    export PRODUCT_NAME="${PRODUCT_NAME-`cat $APPDIR/settings/config.json | jq --raw-output .theme.productName`}"
    echo "PRODUCT_NAME=$PRODUCT_NAME"

    # filesystem icons
    THEME="$CLIENT_HOME"/theme
    ICON_MAC="$THEME"/`cat $APPDIR/settings/config.json | jq --raw-output .theme.filesystemIcons.darwin`
    ICON_WIN32="$THEME"/`cat $APPDIR/settings/config.json | jq --raw-output .theme.filesystemIcons.win32`
    ICON_LINUX="$THEME"/`cat $APPDIR/settings/config.json | jq --raw-output .theme.filesystemIcons.linux`

    if [ -d "$THEME"/css ]; then
        echo "copying in theme css"
        cp -r "$THEME"/css/ "$STAGING"/node_modules/@kui-shell/build/css
    fi
    if [ -d "$THEME"/icons ]; then
        echo "copying in theme icons"
        cp -r "$THEME"/icons "$STAGING"/node_modules/@kui-shell/build
    fi
    if [ -d "$THEME"/images ]; then
        echo "copying in theme images"
        cp -r "$THEME"/images "$STAGING"/node_modules/@kui-shell/build
    fi

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

        if [[ `uname` == Darwin ]]; then
          which mono || brew install mono
        fi

        (cd "$BUILDER_HOME/dist/electron" && npx --no-install electron-packager \
	    "$STAGING" \
	    "${PRODUCT_NAME}" \
            ${NO_PRUNE} \
            --electron-version $ELECTRON_VERSION \
	    --asar \
	    --ignore="$IGNORE" \
            --app-version=$VERSION \
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
            --app-version=$VERSION \
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

        if [[ `uname` == Darwin ]]; then
          which dpkg || brew install dpkg
          which fakeroot || brew install fakeroot
        fi

        (cd "$BUILDER_HOME/dist/electron" && npx --no-install electron-packager \
	    "$STAGING" \
	    "${PRODUCT_NAME}" \
            ${NO_PRUNE} \
            --electron-version $ELECTRON_VERSION \
	    --asar \
	    --ignore="$IGNORE" \
            --app-version=$VERSION \
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
            "$BUILDER_HOME"/dist/electron/builders/deb.sh &
            LINUX_DEB_PID=$!
        fi
    fi
}

function tarball {
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
}

# copy the npmrc into the client staging area
function npmrc {
    cp "$BUILDER_HOME"/npmrc "$STAGING/.npmrc"
    (cd "$STAGING" && npm rebuild --update-binary)
}

# this is the main routine
function build {
    echo "prereq" && prereq
    echo "init" && init
    echo "tarCopy" && tarCopy
    echo "npmrc" && npmrc
    echo "configure" && configure
    echo "assembleHTMLPieces" && assembleHTMLPieces
    echo "win32" && win32
    echo "mac" && mac
    echo "linux" && linux
    echo "tarball" && tarball
    echo "cleanup" && cleanup
}

# line up the work
build

PRETTY_BUILDDIR="$(node -e 'console.log(require("path").normalize(process.env.BUILDDIR))')"
echo "electron client build finished, here is what we built in $PRETTY_BUILDDIR:"
ls -lh "$BUILDDIR" | grep -v headless

exit $CODE
