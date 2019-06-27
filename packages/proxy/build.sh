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

set -e
set -o pipefail

STAGING="${1-`pwd`}"
STAGING_DIR="$(cd $STAGING && pwd)/kui-proxy-tmp"
STAGING="$STAGING_DIR"/kui
echo "staging directory: $STAGING"

CLIENT_HOME="$(pwd)"
BUILDER_HOME="$CLIENT_HOME"/node_modules/@kui-shell/builder
PROXY_HOME="$BUILDER_HOME"/../proxy

# prep the staging area
function init {
    rm -rf "$STAGING_DIR"
    mkdir -p "$STAGING"
    cd "$STAGING"
}

# install the proxy-specific build bits
function initProxy {
    pushd "$STAGING_DIR" > /dev/null
    cp -a "$PROXY_HOME"/{package.json,build-docker.sh,Dockerfile,Dockerfile.http,.dockerignore,app} .
    # mkdir .kube and .bluemix if they don't exist, see issue: https://github.com/IBM/kui/issues/1647
    if [ -d ~/.kube ]; then cp -a ~/.kube .; else mkdir .kube; fi
    if [ -d ~/.bluemix/plugins/container-service/clusters ]; then mkdir -p .bluemix/plugins/container-service && cp -a ~/.bluemix/plugins/container-service/clusters .bluemix/plugins/container-service; else mkdir .bluemix; fi
    npm install --no-package-lock
    popd > /dev/null
}

# build a headless distribution
function headless {
    # this will place the build in $STAGING/kui
    pushd "$CLIENT_HOME" > /dev/null
    QUIET=true NO_ZIPS=true npx kui-build-headless "$STAGING_DIR"
    popd > /dev/null
}

# create the self-signed certificate
function cert {
  if [ "$KUI_USE_HTTP" != "true" ]; then
    pushd "$BUILDER_HOME/../webpack" > /dev/null
    CLIENT_HOME="$CLIENT_HOME" npm run http-allocate-cert
    cp -a "$CLIENT_HOME"/.keys "$STAGING_DIR"/app/bin
    popd
  fi
}

# create a docker image that can host the proxy
function docker {
    pushd "$STAGING_DIR" > /dev/null
    CLIENT_HOME="$CLIENT_HOME" KUI_STAGE="$STAGING" KUI_BUILDDIR="$BUILDDIR" ./build-docker.sh
    popd > /dev/null
}

# clean up the staging area
function clean {
    if [ -z "$NO_CLEAN" ]; then
        rm -rf "$STAGING_DIR";
    fi
}

# this is the main routine
function build {
    init
    initProxy
    headless
    cert
    docker
    clean
}

build
