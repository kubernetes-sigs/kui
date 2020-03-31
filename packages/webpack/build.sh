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
THEME="$CLIENT_HOME"/node_modules/@kui-shell/client

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
           --exclude './packages/builder' \
           --exclude './tests' . | "$TAR" -C "$STAGING" -xf -

    echo "tar copy done"
}

# TODO share this with headless/build.sh, as they should eventually be identical
function configure {
    # generate prescan.json
    UGLIFY=true npx --no-install kui-prescan

    mv node_modules/@kui-shell/prescan.json .            # /// prune will remove prescan.json

    # remove any dev dependencies
    npm prune --production

    mv prescan.json node_modules/@kui-shell/prescan.json # \\\ restore it after the prune
}

# check for prerequisites
function prereq {
    if [ ! -d "$THEME" ]; then
        echo "Your do not provide client definition"
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
    cp -a "$BUILDER_HOME"/../webpack/{package.json,webpack.config.js} .

    if [ -z "$NO_DOCKER" ]; then
      cp -a "$BUILDER_HOME"/../webpack/{build-docker.sh,Dockerfile,Dockerfile.http,bin,conf.d} .
    fi

    popd > /dev/null
}

# build the webpack bundles
function webpack {
    pushd "$STAGING_DIR" > /dev/null
    rm -f "$BUILDDIR"/*.js*
    MODE="${MODE-production}" CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" KUI_BUILDDIR="$BUILDDIR" KUI_BUILDER_HOME="$BUILDER_HOME" npx --no-install webpack-cli --mode production
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

# remove the staging area
function clean {
    if [ -z "$NO_CLEAN" ]; then
        rm -rf "$STAGING"
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
    docker
    clean
}

build
