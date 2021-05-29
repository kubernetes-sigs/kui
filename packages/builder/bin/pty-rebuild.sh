#!/usr/bin/env bash

#
# Copyright 2021 The Kubernetes Authors
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

if [ -z "$1" ]; then
    echo "please provide a prebuild target, such as electron or nodejs"
    exit 1
fi
 
# Notes: keep the prebuild --target in sync with the major version of
# electron desired for this client; see the dependencies section of
# ../package.json
if [ "$1" = "electron" ]; then
    # create an electron dist to test against
    PLATFORM=$(node -e 'console.log(process.platform)')
    ARCH=$(node -e 'console.log(require("os").arch())')
    TARGET="${PLATFORM}-${ARCH}"
    echo "node-pty PLATFORM=$TARGET"
    mkdir -p node_modules/node-pty/build/Release
    rm -f node_modules/node-pty/build/Release/*
    cp node_modules/@kui-shell/builder/dist/electron/vendor/node-pty/build/$TARGET/electron/* node_modules/node-pty/build/Release
    gunzip node_modules/node-pty/build/Release/*.gz
    ls node_modules/node-pty/build/Release
else
    if [ -e ./node_modules/.bin/rc ] && [ ! -L ./node_modules/.bin/rc ]; then
        echo "rc is not a symlink"
        (cd node_modules/.bin && rm -f rc && node -e 'require("fs").symlinkSync("../rc/cli.js", "rc")')
    fi
    if [ -e ./node_modules/.bin/prebuild-install ] && [ ! -L ./node_modules/.bin/prebuild-install ]; then
        echo "prebuild-install is not a symlink"
        (cd node_modules/.bin && rm -f prebuild-install && node -e 'require("fs").symlinkSync("../prebuild-install/bin.js", "prebuild-install")')
    fi

    cd node_modules/node-pty
    prebuild-install --force --download --runtime $1
fi

# Notes: why --force --download?  for some reason, when run from `npm
# run ...` prebuild-install insists on the --build-from-source option,
# and nothing we do, short of --force, seems to override this
