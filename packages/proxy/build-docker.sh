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
    if [ ! -d "$BUILDDIR" ]; then
        echo "Building webpack bundles"
        npx kui-build-webpack
    fi
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

function ptyKui {
    echo "pty for kui"
    PTYDIR="$BUILDDIR"/kui/node_modules/node-pty/build/Release
    mkdir -p "$PTYDIR" && \
        cp node_modules/@kui-shell/builder/dist/electron/vendor/node-pty/build/linux-x64/electron/pty.node.gz "$PTYDIR" && \
        gunzip "$PTYDIR"/pty.node.gz
    # ^^ travis does not seem to have gzcat, which would make the above command marginally more simple
}

function copyKui {
    echo "copy kui"
    rm -rf "$BUILDDIR"/kui && mkdir "$BUILDDIR"/kui
    tar -C "$CLIENT_HOME" -h -cf - --exclude '**/mdist/' packages plugins | tar -C "$BUILDDIR"/kui -xf -
    cp "$CLIENT_HOME"/{package,package-lock}.json "$BUILDDIR"/kui/
}

function installKui {
    echo "install kui"
    # we have to hack out dependencies manually because npm uninstall doesn't know how limit itself to just a scissor cut.
    # (cd "$BUILDDIR"/kui && node -e 'const pjson = require("./package.json"); const remove = ["@kui-shell/plugin-editor", "@kui-shell/plugin-wskflow", "@kui-shell/plugin-client-common", "@kui-shell/plugin-client-default", "@kui-shell/plugin-carbon-themes", "@kui-shell/plugin-core-themes"]; remove.forEach(_ => delete pjson.dependencies[_]); require("fs").writeFileSync("package.json", JSON.stringify(pjson, undefined, 2))')

    (cd "$BUILDDIR"/kui && npm ci --only=production --ignore-scripts)

    cp "$CLIENT_HOME"/node_modules/@kui-shell/prescan.json "$BUILDDIR"/kui/node_modules/@kui-shell/prescan.json
}

function removeLink {
    KUI_LINK="$CLIENT_HOME"/node_modules/@kui-shell/proxy/kui
    if [ -L "$KUI_LINK" ]; then
        echo "removing kui link"
        rm -f "$KUI_LINK"
        RESTORE_KUI_LINK=true
    fi
}

function restoreLink {
    if [ -n "$RESTORE_KUI_LINK" ]; then
        echo "restoring kui link"
        git checkout packages/proxy/kui
    fi
}

function cleanKui {
    echo "clean kui"
    rm -rf "$BUILDDIR"/kui
}

function kui {
    echo "kui"
    webpack
    cleanKui
    removeLink
    copyKui
    installKui
    ptyKui
    restoreLink
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
    (cd "$BUILDDIR" && docker build . -t kuishell/kui --build-arg CSP="$CSP" --build-arg OPENGRAPH="$OPENGRAPH" --build-arg KUBE_VERSION=$KUBE_VERSION --build-arg HELM_VERSION=$HELM_VERSION --build-arg OC_VERSION=$OC_VERSION $KUBECONFIG_ARG)
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
