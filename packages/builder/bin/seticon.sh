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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR=.
THEME=node_modules/@kui-shell/client

# TODO this only handles MacOS right now

if [[ `uname` != Darwin ]]; then
    echo "Not setting icon"
    exit;
else
    if [ ! -d "$SCRIPTDIR"/../node_modules/fileicon ]; then
        (cd "$SCRIPTDIR"/.. && npm install --no-save --no-package-lock fileicon)
    fi

    ICON="$THEME"/$(cd $THEME && node -e 'console.log(require("./config.d/icons").app)')
    APPNAME=$(cd $THEME && node -e 'console.log(require("./config.d/name").productName)')
    echo "Using appName=${APPNAME} and appIcon=${ICON}"

    npx fileicon set "$TOPDIR"/node_modules/electron/dist/Electron.app/ "$ICON"

    # echo "Updating app name"
    plist="$TOPDIR"/node_modules/electron/dist/Electron.app/Contents/Info.plist
    # echo $plist
    plutil -replace CFBundleName -string "$APPNAME" -- "${plist}"
    plutil -replace CFBundleDisplayName -string "$APPNAME" -- "${plist}"

    # protocol handlers
    plutil -replace CFBundleURLTypes -json '[{"CFBundleURLName": "kui", "CFBundleURLSchemes": ["kui"]}]' -- "${plist}"

    # note: the rest does not work, as currently written; as a
    # consequence, the hover tooltip in the macOS dock will stay say
    # "Electron"; but the above two plutil modifications will ensure
    # that the menubar application menu will properly read APPNAME
    # this only affects "dev" builds; the dist/electron/build.sh
    # builds do the right thing; we can probably fix this, if anyone
    # cares enough [@starpit 20181213]
    exit # <-- intentionally disabling the lines below

    # this attempts to set the executable name, whcih governs e.g. the
    # tooltip when hovering over the app icon in the macOS dock; doing
    # so without the other bits below (which also fail, as written)
    # results in a "forbidden" overlay in the dock icon (white circle
    # with cross)
    plutil -replace CFBundleExecutable -string "${APPNAME}" -- "${plist}"

    # the remainder is probably needed for the official builds, but doesn't seem to work for the dev environment
    # echo "Updating executable bits"
    if [ -f "$TOPDIR"/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron ]; then
	# echo "Moving binary"
	mv "$TOPDIR"/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron "../node_modules/electron/dist/Electron.app/Contents/MacOS/$APPNAME"
	mv "$TOPDIR"/node_modules/electron/dist/Electron.app "../node_modules/electron/dist/$APPNAME.app"

	echo "dist/$APPNAME.app/Contents/MacOS/$APPNAME" > ../node_modules/electron/path.txt
    fi
fi
