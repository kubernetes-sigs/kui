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
# @param $3 client directory (optional) defaulting to default
#
STAGING="${1-`pwd`}"
PLATFORM=${2-${PLATFORM-all}}
export CLIENT_NAME=${3}

STAGING="$(cd $STAGING && pwd)/kui-electron-tmp"
echo "staging directory: $STAGING"

CLIENT_HOME="$(pwd)"
APPDIR="$STAGING"/node_modules/@kui-shell
CORE_HOME="$STAGING"/node_modules/@kui-shell/core
THEME="$CLIENT_HOME"/node_modules/@kui-shell/client
export BUILDER_HOME="$STAGING"/node_modules/@kui-shell/builder
export BUILDDIR="$CLIENT_HOME"/dist/electron

#
# ignore these files when bundling the ASAR (this is a regexp, not glob pattern)
# see the electron-packager docs for --ignore
#
export IGNORE='(~$)|(\.ts$)|(lerna\.json)|(@types)|(tsconfig\.json)|(webpack\.config\.json)|(\.cache)|(\.map$)|(jquery)|(/node_modules/d3)|(/node_modules/elkjs)|(monaco-editor)|(xterm)|(bak\.json)|(@kui-shell/.*/mdist)|(node_modules/.*/fonts/)|(\.scss$)|(\.woff$)|(/node_modules/@carbon)|(/node_modules/carbon-components)'

#
# client version; note rcedit.exe fails if the VERSION is "dev"
#
set +e
export VERSION=$(cat "$CLIENT_HOME"/package.json | jq --raw-output .version)
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
    "$TAR" -C "$CLIENT_HOME" -h -cf - \
           --exclude "./npm-packs" \
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
           --exclude "./packages" \
           --exclude "./plugins" \
           --exclude "**/*~" \
           --exclude "**/.bak" \
           --exclude "**/yarn.lock" \
           --exclude "**/*.debug.js" \
	   --exclude "monaco-editor/dev" \
	   --exclude "monaco-editor/min/*/*.js" \
	   --exclude "monaco-editor/min-maps" \
           --exclude "node_modules/*.bak/*" \
           --exclude "node_modules/**/*.md" \
           --exclude "node_modules/**/*.DOCS" \
           --exclude "node_modules/**/LICENSE" \
           --exclude "node_modules/**/docs/**/*.html" \
           --exclude "node_modules/**/docs/**/*.png" \
           --exclude "node_modules/**/docs/**/*.js" \
           --exclude "./plugins" \
           --exclude "./docs" \
           --exclude "./attic" \
           --exclude "./.*" \
           --exclude "./README.md" \
           --exclude "*.tsbuildinfo" \
           --exclude "**/tslint.json" \
           --exclude "node_modules/**/test/*" . \
        | "$TAR" -C "$STAGING" -xf -

    echo "tar copy done"

    if [ -n "$TARBALL_ONLY" ]; then exit; fi
}

# TODO share this with headless/build.sh, as they are identical
function configure {
    UGLIFY=true npx --no-install kui-prescan
}

# prepare staging directory
function initStage {
    rm -rf "$STAGING"
    mkdir -p "$STAGING"
    cd "$STAGING"

    # make the build directory
    mkdir -p "$BUILDDIR"
}

# check for prerequisites
function prereq {
    if [ ! -d "$THEME" ]; then
        echo "You do not provide a client definition"
        exit 1
    fi
}

# compile es6 modules
function es6 {
    if [ -d node_modules/typescript ] && [ -f tsconfig-es6.json ]; then
        npx --no-install tsc -b tsconfig-es6.json
    fi
}

# copy over the theme bits
function theme {
    # filesystem icons
    ICON_MAC="$THEME"/$(cd $THEME && node -e 'console.log(require("./config.d/icons").filesystem.darwin)')
    ICON_WIN32="$THEME"/$(cd $THEME && node -e 'console.log(require("./config.d/icons").filesystem.win32)')
    ICON_LINUX="$THEME"/$(cd $THEME && node -e 'console.log(require("./config.d/icons").filesystem.linux)')

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

        (cd "$BUILDER_HOME/dist/electron" && node builders/electron.js "$STAGING" "${PRODUCT_NAME}" win32 $ICON_WIN32)

	# we want the electron app name to be PRODUCT_NAME, but the app to be in <CLIENT_NAME>-<platform>-<arch>
	if [ "${PRODUCT_NAME}" != "${CLIENT_NAME}" ]; then
	    rm -rf "$BUILDDIR/${CLIENT_NAME}-win32-x64/"
	    mv "$BUILDDIR/${PRODUCT_NAME}-win32-x64/" "$BUILDDIR/${CLIENT_NAME}-win32-x64/"
	fi

        echo "Add kubectl-kui UNIX shell script to electron build win32"
        (cd "$BUILDDIR/${CLIENT_NAME}-linux-x64" && touch kubectl-kui && chmod +x kubectl-kui \
          && echo '#!/usr/bin/env sh
export KUI_POPUP_WINDOW_RESIZE=true
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
"$SCRIPTDIR"/Kui kubectl $@ &' >> kubectl-kui)

        echo "Add kubectl-kui PowerShell script to electron build win32"
        (cd "$BUILDDIR/${CLIENT_NAME}-linux-x64" && touch kubectl-kui.ps1 && chmod +x kubectl-kui.ps1 \
          && echo '$Env:KUI_POPUP_WINDOW_RESIZE="true"
$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
Write-Host "Current script directory is $ScriptDir"
Write-Host "yoyo $args"
$argv = "kubectl " + $args
Start-Process -NoNewWindow $ScriptDir/Kui.exe -ArgumentList $argv' >> kubectl-kui.ps1)

        #
        # deal with win32 packaging
        #
        if [ -z "$NO_INSTALLER" ]; then
            echo "Zip build for win32"
            (cd $BUILDDIR && zip -q -r "${CLIENT_NAME}-win32-x64" "${CLIENT_NAME}-win32-x64" -x \*~) &
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
    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "mac" ] || [ "$PLATFORM" == "macos" ] || [ "$PLATFORM" == "darwin" ] || [ "$PLATFORM" == "osx" ]; then
        echo "Electron build darwin $STAGING"

        (cd "$BUILDER_HOME/dist/electron" && node builders/electron.js "$STAGING" "${PRODUCT_NAME}" darwin $ICON_MAC)

        # use a custom icon for mac
        cp $ICON_MAC "$BUILDDIR/${PRODUCT_NAME}-darwin-x64/${PRODUCT_NAME}.app/Contents/Resources/electron.icns"

        # we want the electron app name to be PRODUCT_NAME, but the app to be in <CLIENT_NAME>-<platform>-<arch>
	if [ "${PRODUCT_NAME}" != "${CLIENT_NAME}" ]; then
	    rm -rf "$BUILDDIR/${CLIENT_NAME}-darwin-x64/"
            mv "$BUILDDIR/${PRODUCT_NAME}-darwin-x64/" "$BUILDDIR/${CLIENT_NAME}-darwin-x64/"
	fi

        echo "Add kubectl-kui to electron build darwin"
        (cd "$BUILDDIR/${CLIENT_NAME}-darwin-x64" && touch kubectl-kui && chmod +x kubectl-kui \
          && echo '#!/usr/bin/env sh
export KUI_POPUP_WINDOW_RESIZE=true
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
"$SCRIPTDIR"/Kui.app/Contents/MacOS/Kui kubectl $@ &' >> kubectl-kui)

        # create the installers
        #if [ -n "$ZIP_INSTALLER" ]; then
        #node ./builders/zip.js

        if [ -z "$NO_INSTALLER" ]; then
            if [ -z "$NO_MAC_DMG_INSTALLER" ]; then
                echo "DMG build for darwin"
                (cd "$BUILDER_HOME/dist/electron" && npx --no-install electron-installer-dmg \
	            "$BUILDDIR/${CLIENT_NAME}-darwin-x64/${PRODUCT_NAME}.app" \
	            "${CLIENT_NAME}" \
	            --out="$BUILDDIR" \
	            --icon="$ICON_MAC" \
	            --icon-size=128 \
	            --overwrite) &
                MAC_DMG_PID=$!
            fi

            echo "TGZ build for darwin"
            tar -C "$BUILDDIR" -jcf "$BUILDDIR/${CLIENT_NAME}-darwin-x64.tar.bz2" "${CLIENT_NAME}-darwin-x64" &
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

        (cd "$BUILDER_HOME/dist/electron" && node builders/electron.js "$STAGING" "${PRODUCT_NAME}" linux $ICON_LINUX)

	# we want the electron app name to be PRODUCT_NAME, but the app to be in <CLIENT_NAME>-<platform>-<arch>
	if [ "${PRODUCT_NAME}" != "${CLIENT_NAME}" ]; then
	    rm -rf "$BUILDDIR/${CLIENT_NAME}-linux-x64/"
	    mv "$BUILDDIR/${PRODUCT_NAME}-linux-x64/" "$BUILDDIR/${CLIENT_NAME}-linux-x64/"
	fi

        echo "Add kubectl-kui to electron build linux"
        (cd "$BUILDDIR/${CLIENT_NAME}-linux-x64" && touch kubectl-kui && chmod +x kubectl-kui \
          && echo '#!/usr/bin/env sh
export KUI_POPUP_WINDOW_RESIZE=true
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
"$SCRIPTDIR"/Kui kubectl $@ &' >> kubectl-kui)

        if [ -z "$NO_INSTALLER" ]; then
            echo "Zip build for linux"
            (cd $BUILDDIR && zip -q -r "${CLIENT_NAME}-linux-x64" "${CLIENT_NAME}-linux-x64" -x \*~) &
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

# make sure we have the needed native modules compiled and ready
function native {
    (cd "$STAGING" && npx --no-install kui-pty-rebuild electron)
}

# install the webpackery bits
function initWebpack {
    pushd "$STAGING" > /dev/null
    cp -a "$BUILDER_HOME"/../webpack/webpack.config.js .
    (cd node_modules/.bin && rm -f webpack-cli && ln -s ../webpack-cli/bin/cli.js webpack-cli)
    popd > /dev/null
}

# build the webpack bundles
function webpack {
    pushd "$STAGING" > /dev/null
    rm -f "$BUILDDIR"/*.js*
    TARGET=electron-renderer MODE=${MODE-production} CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" KUI_BUILDDIR="$BUILDDIR" KUI_BUILDER_HOME="$BUILDER_HOME" npx --no-install webpack-cli
    popd > /dev/null
}

# install the electron-packager dependencies
function builddeps {
    (cd "$BUILDER_HOME/dist/electron" && npm install)

    export ELECTRON_VERSION=$(BUILDER_HOME=$BUILDER_HOME node -e 'console.log((require(require("path").join(process.env.BUILDER_HOME, "dist/electron/package.json")).devDependencies.electron).replace(/^[~^]/, ""))')
    echo "ELECTRON_VERSION=$ELECTRON_VERSION"

    # product name
    CONIFG_PRODUCT_NAME=$(cd "$THEME" && node -e 'console.log(require("./config.d/name").productName)')
    export PRODUCT_NAME="${PRODUCT_NAME-$CONIFG_PRODUCT_NAME}"
    [[ -z ${CLIENT_NAME} ]] && export CLIENT_NAME="${PRODUCT_NAME}"
    echo "PRODUCT_NAME=$PRODUCT_NAME"
    echo "Using CLIENT_NAME=$CLIENT_NAME"
}

# this is the main routine
function build {
    echo "prereq" && prereq
    echo "es6" && es6
    echo "initStage" && initStage
    echo "tarCopy" && tarCopy
    echo "initWebpack" && initWebpack
    echo "native" && native
    echo "configure" && configure
    echo "webpack" && webpack
    echo "builddeps" && builddeps
    echo "theme" && theme
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
