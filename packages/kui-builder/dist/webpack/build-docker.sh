#!/usr/bin/env bash

#
# Copyright 2019 IBM Corporation
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

#
# This script assumes ./build.sh has already been called (that script
# builds the webpack bundles; this script builds the docker image)
#

set -e
set -o pipefail

CLIENT_HOME=${CLIENT_HOME-$(pwd)}
BUILDDIR=${KUI_BUILDDIR-"$CLIENT_HOME"/dist/webpack}
STAGING="${KUI_STAGE}"

APPDIR="$STAGING"/packages/app
CORE_HOME="$STAGING"/node_modules/@kui-shell/core

# create the self-signed certificate
npm run http-allocate-cert

cp -a "$BUILDDIR" build

# some of the assets are in sibling directories; let's copy them here
# to our BUILDDIR directory:
cp "$APPDIR"/build/index-webpack.html "$BUILDDIR"/index.html
cp -r "$CORE_HOME"/web/css/ "$BUILDDIR" # !!! intentional trailing slash: css/

# if we are using a build config override, then copy in its assets
THEME="$CLIENT_HOME"/theme
if [ -d "$THEME"/css ]; then
    cp -r "$THEME"/css/ "$BUILDDIR" # !!! intentional trailing slash: css/
fi
if [ -d "$THEME"/icons ]; then
    cp -r "$THEME"/icons "$BUILDDIR" # !!! intentional NO trailing slash: icons
fi
if [ -d "$THEME"/images ]; then
    cp -r "$THEME"/images "$BUILDDIR" # !!! intentional NO trailing slash: images
fi

# finally, build the docker image
docker build . -t kui-webpack
