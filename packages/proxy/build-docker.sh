#!/usr/bin/env bash

#
# Copyright 2018 The Kubernetes Authors
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

export CLIENT_HOME=${CLIENT_HOME-$(pwd)}
PROXY_HOME="$CLIENT_HOME"/node_modules/@kui-shell/proxy

BUILDDIR="$CLIENT_HOME"/dist/webpack

# accepted environment variables
KUBE_VERSION=${KUBE_VERSION-1.22.1}
HELM_VERSION=${HELM_VERSION-3.6.3}
OC_VERSION=${OC_VERSION-4.7.0}

for d in "$PROXY_HOME"/defaults/*.sh; do
    if [ -f "$d" ]; then
        echo "Reading defaults $(basename $d)"
        . "$d"
    fi
done

function kubeconfig {
    if [ -n "$INJECT_KUBECONFIG" ] && [ -n "$KUBECONFIG" ]; then
        # ONLY DO THIS FOR DEVELOPMENT
        echo "$(tput setaf 1)!!!!!!!!!!!! WARNING: injecting your KUBECONFIG into the container !!!!!!!!!!!!$(tput sgr0)"
        echo "$(tput setaf 1)!!!!!!!!!!!! If this is not a development build, redo this command without setting INJECT_KUBECONFIG$(tput sgr0)"

        if [ -d ~/.kube ]; then
            rm -rf "$BUILDDIR"/.kube
            cp -a ~/.kube "$BUILDDIR"
        fi
        if [ -d ~/.bluemix ]; then
            echo "$(tput setaf 1)!!!!!!!!!!!! WARNING: injecting your IBM Cloud config into the container !!!!!!!!!!!!$(tput sgr0)"
            rm -rf "$BUILDDIR"/.bluemix
            cp -a ~/.bluemix "$BUILDDIR"
        fi
    elif [ ! -d "$BUILDDIR"/.kube ]; then
        # avoid COPY failure in Dockerfile
        mkdir "$BUILDDIR"/.kube
        mkdir "$BUILDDIR"/.bluemix
    fi
}

function webpack {
    echo "Building webpack bundles"
    rm -rf "$BUILDDIR"/*
    KUI_PROXY_WEBPACK=true KUI_HEADLESS_WEBPACK=true npx kui-build-webpack
}

function nginx {
    echo "nginx config"
    if [ ! -d "$BUILDDIR"/conf.d ]; then mkdir "$BUILDDIR"/conf.d; fi
    cp "$CLIENT_HOME"/node_modules/@kui-shell/proxy/conf.d/* "$BUILDDIR"/conf.d
    mv "$BUILDDIR"/conf.d/proxy.conf "$BUILDDIR"/conf.d/default.conf

    # this is for configuring tzdata in the Dockerfile
    cp "$CLIENT_HOME"/node_modules/@kui-shell/proxy/preseed.txt "$BUILDDIR"/
}

function proxy {
    echo "proxy"
    cp "$CLIENT_HOME"/node_modules/@kui-shell/proxy/{*.sh,Dockerfile,.dockerignore} "$BUILDDIR"/
    rm -rf "$BUILDDIR"/kui/app
    cp -a "$CLIENT_HOME"/node_modules/@kui-shell/proxy/app "$BUILDDIR"/kui
}

function copyKui {
    echo "copy kui"
    rm -rf "$BUILDDIR"/kui && mkdir "$BUILDDIR"/kui
    mkdir -p "$BUILDDIR"/kui/dist && cp -a "$CLIENT_HOME"/dist/headless "$BUILDDIR"/kui/dist
    cp "$CLIENT_HOME"/package.json "$BUILDDIR"/kui/
}

function cleanKui {
    echo "clean kui"
    rm -rf "$BUILDDIR"/kui
}

function kui {
    echo "kui"
    webpack
    cleanKui
    copyKui
}

function profiled {
    echo "profile.d"
    rm -rf "$BUILDDIR"/profile.d
    cp -a "$CLIENT_HOME"/node_modules/@kui-shell/proxy/profile.d "$BUILDDIR"
}

function image {
    echo "docker"
    if [ -f "$CSP" ]; then
        echo "Loading ContentSecurityPolicy from file $CSP"
        CSP=$(cat "$CSP")
    elif [ -n "$CSP" ]; then
        echo "Loading ContentSecurityPolicy from env $CSP"
    fi

    NODE_PTY_VERSION=$(npm view node-pty version)
    (cd "$BUILDDIR" && docker build . -t kuishell/kui --build-arg CSP="$CSP" --build-arg OPENGRAPH="$OPENGRAPH" --build-arg KUBE_VERSION=$KUBE_VERSION --build-arg HELM_VERSION=$HELM_VERSION --build-arg OC_VERSION=$OC_VERSION $KUBECONFIG_ARG --build-arg NODE_PTY_VERSION=$NODE_PTY_VERSION)
}

if [ "$1" != "dockeronly" ]; then
    # kinda expensive. sometimes it is helpful to skip this during developing
    kui
fi

nginx
proxy
kubeconfig
profiled
image
