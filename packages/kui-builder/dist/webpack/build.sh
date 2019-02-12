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

#
# This script builds two sets of artifacts:
#
#  1. the webpack bundles
#
#  2. at the tail end of this script, ./build-docker.sh is
#  invoked. That script builds a docker image that can be used to
#  serve up the webpack client. Try `npm start` when this script
#  finishes; this will start the docker container, allowing you to
#  debug your webpack client.
#
# Notes on build configuration: see /docs/dev/build-customization.md
#

set -e
set -o pipefail

#
# @param $1 staging directory
#
STAGING="${1-`pwd`}"
STAGING_DIR="$(cd $STAGING && pwd)/kui-webpack-tmp"
STAGING="$STAGING_DIR"/kui
echo "staging directory: $STAGING"

CLIENT_HOME="$(pwd)"
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
BUILDER_HOME="$CLIENT_HOME"/node_modules/@kui-shell/builder
BUILDDIR="$CLIENT_HOME"/dist/webpack

APPDIR="$STAGING"/packages/app
CORE_HOME="$STAGING"/node_modules/@kui-shell/core

echo "build-webpack CLIENT_HOME=$CLIENT_HOME"
echo "build-webpack BUILDDIR=$BUILDDIR"
echo "build-webpack STAGING=$STAGING"
echo "build-webpack CORE_HOME=$CORE_HOME"
echo "build-webpack APPDIR=$APPDIR"

if [[ `uname` == Darwin ]]; then
    # see bin/postinstall; we use brew to ensure we have gtar
    TAR=gtar
else
    TAR=tar
fi

function pre {
    (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/pre' -exec {} \;)
    # (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/pre' -exec rm node_modules/@kui-plugin/{} \;)
    # npm prune --production
}

function post {
    (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/post' -exec {} \;)
    # npm install
}

function tarCopy {
    # word of warning for linux: in the TAR command below, the `-cf -` has
    # to come before the --exclude rules!
    "$TAR" -C "$CLIENT_HOME" -cf - \
           --exclude "./npm-packs" \
           --exclude "./theme" \
           --exclude "./kui" \
           --exclude "./kui-*-tmp" \
           --exclude '.git*' \
           --exclude '*flycheck_*.js' \
           --exclude '*.icns' \
           --exclude '*~' \
           --exclude package-lock.json \
           --exclude '*/tests/*' \
           --exclude './packages/proxy/*.js' \
           --exclude "./build/*/node_modules/*" \
           --exclude "./packages/*/node_modules/*" \
           --exclude "./plugins/*/node_modules/*" \
           --exclude './packages/kui-builder' \
           --exclude './tests' . | "$TAR" -C "$STAGING" -xf -

    echo "tar copy done"
}

# TODO share this with headless/build.sh, as they are identical
function configure {
    UGLIFY=true npx --no-install kui-compile

    # note that we will do this again in webpack.config.js; we need to
    # wait until we have the webpack build hash but, for now, we need
    # to do it here, too, at least so that the next line (npm install
    # --save) works
    CLIENT_HOME=$CLIENT_HOME KUI_STAGE="$STAGING" node "$BUILDER_HOME"/lib/configure.js

    # we need to get @kui-shell/settings into the package
    # dependencies, so that npm prune --production does not remove it;
    # i.e. a self-managed symlink is not sufficient
    npm install --save ./packages/app/build

    npm prune --production
}

# prep the staging area
function init {
    rm -rf "$STAGING_DIR"
    mkdir -p "$STAGING"
    cd "$STAGING"
}

# install the webpackery bits
function initWebpack {
    pushd "$STAGING_DIR" > /dev/null
    cp -a "$BUILDER_HOME"/dist/webpack/{package.json,webpack.config.js,build-docker.sh,Dockerfile,bin,conf.d} .
    if [ -d "$BUILDER_HOME"/dist/webpack/.keys ]; then
        (cp -a "$BUILDER_HOME"/dist/webpack/.keys . || true) # it's ok if this does not exist; we will create some keys, later (in build-docker)
    fi
    npm install --no-package-lock
    popd > /dev/null
}

function webpack {
    pushd "$STAGING_DIR" > /dev/null
    rm -f "$BUILDDIR"/*.js*
    CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" KUI_BUILDDIR="$BUILDDIR" KUI_BUILDER_HOME="$BUILDER_HOME" npx --no-install webpack-cli --mode development
    popd > /dev/null
}

function docker {
    pushd "$STAGING_DIR" > /dev/null
    CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" KUI_BUILDDIR="$BUILDDIR" ./build-docker.sh
    popd > /dev/null
}

# some of the assets are in sibling directories; let's copy them here
# to our BUILDDIR directory:
function assembleHTMLPieces {
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
}

function clean {
    if [ -z "$NO_CLEAN" ]; then
        rm -rf "$STAGING"
    fi
}

function build {
    init
    tarCopy
    initWebpack
    configure
    webpack
    assembleHTMLPieces
    docker
    clean
}

build



#         NO_ARTIFACTS=true "$BUILDER_HOME"/bin/link-build-assets.sh && \
#         (cd "$initialDirectory" && KUI_STAGE="$STAGING" node "$BUILDER_HOME"/lib/configure.js) && \
#         ("$BUILDER_HOME"/bin/kui-link-artifacts.sh) && \
#         (rm -rf "$STAGING"/packages/app/web/css/css) && \
#         rm bak.json) && \

