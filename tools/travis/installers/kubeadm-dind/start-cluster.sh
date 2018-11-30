#!/usr/bin/env bash

git clone https://github.com/apache/incubator-openwhisk-deploy-kube && \
    cd incubator-openwhisk-deploy-kube && \
    ./tools/travis/start-kubeadm-dind.sh
