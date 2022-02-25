#!/usr/bin/env bash

#
# Copyright 2017 The Kubernetes Authors
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
# @param $2 platform (optional) defaulting to all platforms (you may also set this via PLATFORM env)
# @param $3 client directory (optional) defaulting to default
#
PLATFORM=${2-${PLATFORM-all}}
export CLIENT_NAME=${3}

CLIENT_HOME="$(pwd)"
APPDIR="$CLIENT_HOME"/node_modules/@kui-shell
CORE_HOME="$CLIENT_HOME"/node_modules/@kui-shell/core
THEME="$CLIENT_HOME"/node_modules/@kui-shell/client
export BUILDER_HOME="$CLIENT_HOME"/node_modules/@kui-shell/builder
MODULE_HOME="$CLIENT_HOME"/node_modules/@kui-shell
export BUILDDIR="$CLIENT_HOME"/dist/electron
export HEADLESS_BUILDDIR="$CLIENT_HOME"/dist/headless
export KUI_HEADLESS_WEBPACK

#
# client version; note rcedit.exe fails if the VERSION is "dev"
#
export VERSION=$(node -e 'console.log(require((process.env.CLIENT_HOME || ".") + "/node_modules/@kui-shell/client/package.json").version)')
if [ $? != 0 ]; then VERSION=0.0.1; fi
echo "Using VERSION=$VERSION"

# make a bin/ directory inside of $1 and return the full path
function makeBinDirectory {
    local dir="$1/bin"
    if [ ! -d "$dir" ]; then
        mkdir "$dir"
    fi
    echo "$dir"
}

function win32 {
    local ARCH=$1

    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "win32" ] || [ "$PLATFORM" == "windows" ]; then
        # copy over prebuilt node-pty
        npx kui-pty-rebuild electron win32 x64

        # create the bundles
        echo "Electron build for win32 $ARCH"

        if [[ `uname` == Darwin ]]; then
          which mono || brew install mono
        fi

	# hack in node-pty@010.0 just for windows, for now
	# https://github.com/microsoft/node-pty/issues/532
	echo "Hacking win32 node-pty"
	"$BUILDER_HOME"/dist/electron/hack-win32-node-pty/hack.sh "$CLIENT_HOME"/node_modules/node-pty
	echo "Done hacking win32 node-pty"

        (cd "$BUILDER_HOME/dist/electron" && node builders/electron.js "$CLIENT_HOME" "${PRODUCT_NAME}" win32 $ARCH)

	# we want the electron app name to be PRODUCT_NAME, but the app to be in <CLIENT_NAME>-<platform>-<arch>
	if [ "${PRODUCT_NAME}" != "${CLIENT_NAME}" ]; then
	    rm -rf "$BUILDDIR/${CLIENT_NAME}-win32-$ARCH/"
	    mv "$BUILDDIR/${PRODUCT_NAME}-win32-$ARCH/" "$BUILDDIR/${CLIENT_NAME}-win32-$ARCH/"
	fi

        echo "Add kubectl-kui UNIX shell script to electron build win32 $ARCH"
        (cd "$BUILDDIR/${CLIENT_NAME}-win32-$ARCH" && touch kubectl-kui && chmod +x kubectl-kui \
          && echo '#!/usr/bin/env sh
export KUI_POPUP_WINDOW_RESIZE=true
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
"$SCRIPTDIR"/Kui kubectl $@ &' > kubectl-kui)

        echo "Add kubectl-kui PowerShell script to electron build win32 $ARCH"
        (cd "$BUILDDIR/${CLIENT_NAME}-win32-$ARCH" && touch kubectl-kui.ps1 && chmod +x kubectl-kui.ps1 \
          && echo '$Env:KUI_POPUP_WINDOW_RESIZE="true"
$ScriptDir = Split-Path $script:MyInvocation.MyCommand.Path
$argv = "kubectl " + $args
Start-Process -NoNewWindow $ScriptDir/Kui.exe -ArgumentList $argv' > kubectl-kui.ps1)

        # copy in optional custom launcher from custom clients
        if [ -f "$KUI_LAUNCHER" ]; then
            echo "Copying in custom launcher"
            bindir=$(makeBinDirectory "$BUILDDIR/${CLIENT_NAME}-win32-$ARCH")
            cp "$KUI_LAUNCHER" "$bindir"
        fi
	
        #
        # deal with win32 packaging
        #
        if [ -z "$NO_INSTALLER" ]; then
            echo "Zip build for win32"
            (cd $BUILDDIR && zip -q -r "${CLIENT_NAME}-win32-$ARCH" "${CLIENT_NAME}-win32-$ARCH" -x \*~)

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
    DESIRED_ARCH=$ARCH
    local ARCH=$1

    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "mac" ] || [ "$PLATFORM" == "macos" ] || [ "$PLATFORM" == "darwin" ] || [ "$PLATFORM" == "osx" ]; then
        if [ -n "$DESIRED_ARCH" ] && [ "$ARCH" != "$DESIRED_ARCH" ]; then
            return
        fi
        echo "Electron build darwin $ARCH"

        # copy over prebuilt node-pty
        npx kui-pty-rebuild electron darwin "$ARCH"

        if [ ! -f "$KUI_LAUNCHER" ]; then
            echo "Add kubectl-kui to electron build darwin $ARCH"
            (touch kubectl-kui && chmod +x kubectl-kui \
            && echo '#!/usr/bin/env bash
export KUI_POPUP_WINDOW_RESIZE=true

# credit: https://unix.stackexchange.com/a/521984
bash_realpath() {
  # print the resolved path
  # @params
  # 1: the path to resolve
  # @return
  # &1: the resolved link path

  local path="${1}"
  while [[ -L ${path} && "$(ls -l "${path}")" =~ -\>\ (.*) ]]
  do
    path="${BASH_REMATCH[1]}"
  done
  echo "${path}"
}

APP_RESOURCES_DIR="$(dirname "$(bash_realpath "$0")")"
if [ "$KUI" != "true" ]; then
    "$APP_RESOURCES_DIR/../MacOS/Kui" kubectl $@ &
else
    "$APP_RESOURCES_DIR/../MacOS/Kui" kubectl $@
fi
' > kubectl-kui)
            KUI_LAUNCHER="$PWD/kubectl-kui"
            ls -l "$KUI_LAUNCHER"
        fi

        (cd "$BUILDER_HOME/dist/electron" && node builders/electron.js "$CLIENT_HOME" "${PRODUCT_NAME}" darwin $ARCH "$KUI_LAUNCHER")

        # we want the electron app name to be PRODUCT_NAME, but the app to be in <CLIENT_NAME>-<platform>-<arch>
	if [ "${PRODUCT_NAME}" != "${CLIENT_NAME}" ]; then
	    rm -rf "$BUILDDIR/${CLIENT_NAME}-darwin-$ARCH/"
            mv "$BUILDDIR/${PRODUCT_NAME}-darwin-$ARCH/" "$BUILDDIR/${CLIENT_NAME}-darwin-$ARCH/"
	fi

        # create the installers
        #if [ -n "$ZIP_INSTALLER" ]; then
        #node ./builders/zip.js

        if [ -z "$NO_INSTALLER" ]; then
            # build mac dmg installer
            # if [ -z "$NO_MAC_DMG_INSTALLER" ]; then
            #     echo "DMG build for darwin"
            #     (cd "$BUILDER_HOME/dist/electron" && npx --no-install electron-installer-dmg \
	        #     "$BUILDDIR/${CLIENT_NAME}-darwin-$ARCH/${PRODUCT_NAME}.app" \
	        #     "${CLIENT_NAME}" \
	        #     --out="$BUILDDIR" \
            #     --icon="$ICON_MAC" \
            #     --icon-size=128 \
	        #     --overwrite) &
            #     MAC_DMG_PID=$!
            # fi

            echo "TGZ build for darwin"
            tar -C "$BUILDDIR" -jcf "$BUILDDIR/${CLIENT_NAME}-darwin-$ARCH.tar.bz2" "${CLIENT_NAME}-darwin-$ARCH"
        fi
    fi
}

#
# deal with linux packaging
#
function linux {
    local ARCH=$1

    if [ "$PLATFORM" == "all" ] || [ "$PLATFORM" == "linux" ]; then
        echo "Electron build linux $ARCH"

        # copy over prebuilt node-pty
        npx kui-pty-rebuild electron linux ${ARCH-x64}
        
        if [[ `uname` == Darwin ]]; then
          which dpkg || brew install dpkg
          which fakeroot || brew install fakeroot
        fi

        (cd "$BUILDER_HOME/dist/electron" && node builders/electron.js "$CLIENT_HOME" "${PRODUCT_NAME}" linux $ARCH)

	# we want the electron app name to be PRODUCT_NAME, but the app to be in <CLIENT_NAME>-<platform>-<arch>
	if [ "${PRODUCT_NAME}" != "${CLIENT_NAME}" ]; then
	    rm -rf "$BUILDDIR/${CLIENT_NAME}-linux-$ARCH/"
	    mv "$BUILDDIR/${PRODUCT_NAME}-linux-$ARCH/" "$BUILDDIR/${CLIENT_NAME}-linux-$ARCH/"
	fi

        echo "Add kubectl-kui to electron build linux $ARCH"
        (cd "$BUILDDIR/${CLIENT_NAME}-linux-$ARCH" && touch kubectl-kui && chmod +x kubectl-kui \
          && echo '#!/usr/bin/env sh
export KUI_POPUP_WINDOW_RESIZE=true
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
"$SCRIPTDIR"/Kui kubectl $@ &' > kubectl-kui)

        # copy in optional custom launcher from custom clients
        if [ -f "$KUI_LAUNCHER" ]; then
            echo "Copying in custom launcher"
            bindir=$(makeBinDirectory "$BUILDDIR/${CLIENT_NAME}-linux-$ARCH")
            cp "$KUI_LAUNCHER" "$bindir"
        fi

        if [ -z "$NO_INSTALLER" ]; then
            echo "Zip build for linux"
            (cd $BUILDDIR && zip -q -r "${CLIENT_NAME}-linux-$ARCH" "${CLIENT_NAME}-linux-$ARCH" -x \*~)

            echo "DEB build for linux"
            # ARCH=$ARCH "$BUILDER_HOME"/dist/electron/builders/deb.sh &
            # LINUX_DEB_PID=$!
        fi
    fi
}

# install the electron-packager dependencies
function builddeps {
    (cd "$BUILDER_HOME/dist/electron" && npm ci)

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
    echo "builddeps" && builddeps

    if [ -z "$ARCH" ] || [ "$ARCH" = "all" ]; then
	echo "Building all arch for mac"
        mac x64
        mac arm64
    else
        mac ${ARCH-x64}
    fi

    if [ -z "$ARCH" ] || [ "$ARCH" = "all" ]; then
	echo "Building all arch for linux"
	linux x64
	linux arm64
    else
	linux ${ARCH-x64}
    fi

    # must be at the end, for now, due to the way we hack in node-pty
    # 0.10 (see "Hacking win32 node-pty" above)
    win32 x64
}

# line up the work
build

PRETTY_BUILDDIR="$(node -e 'console.log(require("path").normalize(process.env.BUILDDIR))')"
echo "electron client build finished, here is what we built in $PRETTY_BUILDDIR:"
ls -lh "$BUILDDIR" | grep -v headless

exit $CODE
