#
# Copyright 2017 IBM Corporation
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

#!/usr/bin/env bash

# TODO this only handles MacOS right now

#ICON=../app/content/icons/png/OpenWhisk-512x512.png
ICON=`cat ./build/config.json | jq --raw-output .appIcon`

APPNAME=`cat ./build/config.json | jq --raw-output .productName`

echo "Using appName=${APPNAME} and appIcon=${ICON}"

if [ ! -x ./node_modules/.bin/fileicon ]; then
    echo "Not setting icon, as fileicon npm not installed"
    exit;
fi

if [ $? == 0 ]; then
    ./node_modules/.bin/fileicon set ./node_modules/electron/dist/Electron.app/ $ICON >& /dev/null

    # echo "Updating app name"
    plist="`pwd`/node_modules/electron/dist/Electron.app/Contents/Info.plist"
    # echo $plist
    defaults write "${plist}" CFBundleName -string "$APPNAME"
    defaults write "${plist}" CFBundleDisplayName -string "$APPNAME"

    exit

    # the remainder is probably needed for the official builds, but doesn't seem to work for the dev environment
    # echo "Updating executable bits"
    defaults write "${plist}" CFBundleExecutable -string OpenWhisk
    if [ -f node_modules/electron/dist/Electron.app/Contents/MacOS/Electron ]; then
	# echo "Moving binary"
	mv node_modules/electron/dist/Electron.app/Contents/MacOS/Electron node_modules/electron/dist/Electron.app/Contents/MacOS/OpenWhisk
	mv node_modules/electron/dist/Electron.app node_modules/electron/dist/OpenWhisk.app

	echo "dist/OpenWhisk.app/Contents/MacOS/OpenWhisk" > node_modules/electron/path.txt
    fi
fi
