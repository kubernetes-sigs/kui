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

set -e
set -o pipefail

sudo snap install microk8s --classic --channel=1.23/stable

# do this in advance, so that microk8s running as sudo doesn't create it
mkdir -p ~/.kube

# Download and install misc packages and utilities
pushd /tmp
  # Download and install helm
  #  curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh && chmod +x get_helm.sh && ./get_helm.sh
  if [ -n "$NEEDS_HELM" ]; then
      PLATFORM=`uname | tr '[:upper:]' '[:lower:]'`
      echo "Downloading this helm: https://get.helm.sh/helm-v${TRAVIS_HELM_VERSION}-${PLATFORM}-amd64.tar.gz"
      curl --retry 10 -L "https://get.helm.sh/helm-v${TRAVIS_HELM_VERSION}-${PLATFORM}-amd64.tar.gz" | tar zxf -
      sudo cp ${PLATFORM}-amd64/helm /usr/local/bin
      sudo chmod +x /usr/local/bin/helm
  fi

  # Download and install openshift-client
  if [ -n "$NEEDS_OC" ]; then
      PLATFORM=`uname | tr '[:upper:]' '[:lower:]'`
      echo "Downloading this oc: https://mirror.openshift.com/pub/openshift-v4/clients/ocp/${TRAVIS_OC_VERISON}/openshift-client-${PLATFORM}.tar.gz"
      curl --retry 10 -L "https://mirror.openshift.com/pub/openshift-v4/clients/ocp/${TRAVIS_OC_VERISON}/openshift-client-${PLATFORM}.tar.gz" | tar zxf -
      sudo cp oc /usr/local/bin
      sudo chmod +x /usr/local/bin/oc
      oc version

      echo "Downloading this odo: https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-${PLATFORM}-amd64"
      sudo sh -c "curl --retry 10 -L https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-${PLATFORM}-amd64 -o /usr/local/bin/odo"
      sudo chmod +x /usr/local/bin/odo
      odo version
  fi
popd

# waiting till microk8s is ready
echo "waiting for microk8s to become available"
sudo microk8s.status --wait-ready
echo "microk8s is ready for e-business"

# smash the microk8s config into the place kubectl expects it to be found
echo "smashing microk8s kubeconfig into .kube/config"
sudo sh -c "microk8s.kubectl config view --raw > /tmp/kubeconfig"
sudo chmod a+r /tmp/kubeconfig
sudo chmod -R a+r ~/.kube
cp /tmp/kubeconfig ~/.kube/config
echo "smashing microk8s kubeconfig into .kube/config [SUCCESS]"

# Pods running in kube-system namespace should have cluster-admin role
kubectl create clusterrolebinding add-on-cluster-admin --clusterrole=cluster-admin --serviceaccount=kube-system:default

# Download and install kubectl (microk8s has its own kubectl, make sure we override it with the version we want)
echo "Downloading this kubectl: https://storage.googleapis.com/kubernetes-release/release/v${TRAVIS_KUBE_VERSION}/bin/linux/amd64/kubectl"
  curl --retry 10 -LO https://storage.googleapis.com/kubernetes-release/release/v${TRAVIS_KUBE_VERSION}/bin/linux/amd64/kubectl && \
       sudo cp kubectl /usr/local/bin/kubectl && \
       sudo chmod a+rx /usr/local/bin/kubectl

# Wait for `default` serviceaccount to be ready
# See https://github.com/kubernetes-sigs/kui/issues/7679
echo "Waiting for default serviceaccount to be ready"
n=0; until ((n >= 90)); do kubectl -n default get serviceaccount default -o name && break; n=$((n + 1)); sleep 1; done; ((n < 90))
echo "Waiting for default serviceaccount to be ready: DONE"

echo "microk8s setup script done"

kubectl version -o json
which kubectl
