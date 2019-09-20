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

APPDIR="$STAGING"/node_modules/@kui-shell
CORE_HOME="$STAGING"/node_modules/@kui-shell/core

echo "build-webpack CLIENT_HOME=$CLIENT_HOME"
echo "build-webpack BUILDDIR=$BUILDDIR"
echo "build-webpack STAGING=$STAGING"
echo "build-webpack CORE_HOME=$CORE_HOME"
echo "build-webpack APPDIR=$APPDIR"

function pre {
    (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/pre' -exec {} \;)
    # (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/pre' -exec rm node_modules/@kui-plugin/{} \;)
    # npm prune --production
}

function post {
    (cd "$TOPDIR" && find -L "node_modules/.bin/@kui-plugin" -type f -path '*webpack/post' -exec {} \;)
    # npm install
}

# copy the core bits to the staging area
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
           --exclude "./dist" \
           --exclude "./kui" \
           --exclude "./kui-*-tmp" \
           --exclude '.git*' \
           --exclude '*flycheck_*.js' \
           --exclude '*.icns' \
           --exclude '*~' \
           --exclude '*.d.ts' \
           --exclude package-lock.json \
           --exclude "./node_modules/husky" \
           --exclude "node_modules/@types" \
	   --exclude "monaco-editor/dev" \
	   --exclude "monaco-editor/min-maps" \
           --exclude '*/tests/*' \
           --exclude './packages/proxy/*.js' \
           --exclude "./build/*/node_modules/*" \
           --exclude "./packages/*/node_modules/*" \
           --exclude "./plugins/*/node_modules/*" \
           --exclude './packages/kui-builder' \
           --exclude './tests' . | "$TAR" -C "$STAGING" -xf -

    echo "tar copy done"
}

# TODO share this with headless/build.sh, as they should eventually be identical
function configure {
    # so that electron's prune doesn't eliminate @kui-shell/settings
    mkdir "$STAGING"/settings
    echo '{ "name": "@kui-shell/settings", "version": "0.0.1" }' > "$STAGING"/settings/package.json
    npm install --save --no-package-lock --ignore-scripts ./settings

    # note that we will do this again in webpack.config.js; we need to
    # wait until we have the webpack build hash but, for now, we need
    # to do it here, too, at least so that the next line (npm install
    # --save) works
    CLIENT_HOME=$CLIENT_HOME KUI_STAGE="$STAGING" node "$BUILDER_HOME"/lib/configure.js webpack

    # generate prescan.json
    UGLIFY=true npx --no-install kui-prescan

    mv node_modules/@kui-shell/prescan.json .            # /// prune will remove prescan.json

    # remove any dev dependencies
    npm prune --production

    mv prescan.json node_modules/@kui-shell/prescan.json # \\\ restore it after the prune
}

# check for prerequisites
function prereq {
    if [ ! -d theme ]; then
        echo "Your client directory does not define a theme/ subdirectory"
        exit 1
    fi
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
    cp -a "$BUILDER_HOME"/../webpack/{package.json,webpack.config.js,build-docker.sh,Dockerfile,Dockerfile.http,bin,conf.d} .
    npm install --no-package-lock
    popd > /dev/null
}

# build the webpack bundles
function webpack {
    pushd "$STAGING_DIR" > /dev/null
    rm -f "$BUILDDIR"/*.js*
    CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" KUI_BUILDDIR="$BUILDDIR" KUI_BUILDER_HOME="$BUILDER_HOME" npx --no-install webpack-cli --mode production
    popd > /dev/null
}

# build a docker image that can serve the webpack client
function docker {
    if [ -z "${NO_DOCKER}" ]; then
        pushd "$STAGING_DIR" > /dev/null
        CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" KUI_BUILDDIR="$BUILDDIR" ./build-docker.sh
        popd > /dev/null
    fi
}

# some of the assets are in sibling directories; let's copy them here
# to our BUILDDIR directory:
function assembleHTMLPieces {
    cp "$APPDIR"/build/index-webpack.html "$BUILDDIR"/index.html
    cp -a "$CORE_HOME"/web/css/* "$BUILDDIR" # Note: we want to copy the directory contents here

    # if we are using a build config override, then copy in its assets
    THEME="$CLIENT_HOME"/theme
    if [ -d "$THEME"/css ]; then
        cp -a "$THEME"/css/* "$BUILDDIR" # Note: we want to copy the directory contents here
    fi
    if [ -d "$THEME"/icons ]; then
        cp -a "$THEME"/icons "$BUILDDIR" # Note: we want to copy the entire directory here, not just the contents
    fi
    if [ -d "$THEME"/images ]; then
        cp -a "$THEME"/images "$BUILDDIR" # Note: we want to copy the entire directory here, not just the contents
    fi
}

# remove the staging area
function clean {
    if [ -z "$NO_CLEAN" ]; then
        rm -rf "$STAGING"
    fi
}

# were we asked to enter watch mode?
function watch {
    if [ -z "$WATCH" ]; then
        echo "no watch"
        # returning 1 will cause the || docker && clean to execute
        return 1
    else
        echo "watching"
        CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" KUI_BUILDDIR="$BUILDDIR" KUI_BUILDER_HOME="$BUILDER_HOME" npx --no-install webpack-cli --watch --progress
        return 0
    fi
}

# this is the main routine
function build {
    prereq
    init
    tarCopy
    initWebpack
    configure
    webpack
    assembleHTMLPieces
    watch || docker && clean
}

build
