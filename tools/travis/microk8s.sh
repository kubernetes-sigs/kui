#!/usr/bin/env bash

set -e
set -o pipefail

sudo snap install microk8s --classic --channel=1.17/stable

# do this in advance, so that microk8s running as sudo doesn't create it
mkdir -p ~/.kube

# Download and install misc packages and utilities
pushd /tmp
  # Download and install kubectl
  (curl -LO https://storage.googleapis.com/kubernetes-release/release/v${TRAVIS_KUBE_VERSION}/bin/linux/amd64/kubectl && \
       sudo cp kubectl /usr/local/bin/kubectl && \
       sudo chmod a+rx /usr/local/bin/kubectl) &

  # Download and install helm
  #  curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh && chmod +x get_helm.sh && ./get_helm.sh
  if [ -n "$NEEDS_HELM" ]; then
      # Need socat for helm to forward connections to tiller on ubuntu 16.04
      (sudo apt-get update && sudo apt install -y socat) &

      PLATFORM=`uname | tr '[:upper:]' '[:lower:]'`
      echo "Downloading this helm: https://get.helm.sh/helm-v${TRAVIS_HELM_VERSION}-${PLATFORM}-amd64.tar.gz"
      curl -L "https://get.helm.sh/helm-v${TRAVIS_HELM_VERSION}-${PLATFORM}-amd64.tar.gz" | tar zxf -
      sudo cp ${PLATFORM}-amd64/helm /usr/local/bin
      sudo chmod +x /usr/local/bin/helm
  fi

  # Download and install openshift-client
  if [ -n "$NEEDS_OC" ]; then
      PLATFORM=`uname | tr '[:upper:]' '[:lower:]'`
      echo "Downloading this oc: https://mirror.openshift.com/pub/openshift-v4/clients/ocp/${TRAVIS_OC_VERISON}/openshift-client-${PLATFORM}.tar.gz"
      curl -L "https://mirror.openshift.com/pub/openshift-v4/clients/ocp/${TRAVIS_OC_VERISON}/openshift-client-${PLATFORM}.tar.gz" | tar zxf -
      sudo cp oc /usr/local/bin
      sudo chmod +x /usr/local/bin/oc
      oc version

      echo "Downloading this odo: https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-${PLATFORM}-amd64"
      sudo sh -c "curl -L https://mirror.openshift.com/pub/openshift-v4/clients/odo/latest/odo-${PLATFORM}-amd64 -o /usr/local/bin/odo"
      sudo chmod +x /usr/local/bin/odo
      odo version
  fi

  # wait for the kubectl download and socat installation
  wait
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

kubectl version -o json

echo "microk8s setup script done"
