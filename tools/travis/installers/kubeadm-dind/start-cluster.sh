#!/usr/bin/env bash

#sudo apt-get install build-essential
#wget http://ftp.gnu.org/gnu/bash/bash-4.4.18.tar.gz
#tar xf bash-4.4.18.tar.gz
#cd bash-4.4.18
#./configure
#make -j2
#sudo make install

# ugh, the dind-cluster-vxxx.sh script is hard-wired to use /bin/bash
#sudo mv /bin/bash /bin/bash.orig
#sudo mv /usr/local/bin/bash /bin/bash

#echo "Checking /bin/bash version"
#/bin/bash --version

#git clone https://github.com/apache/incubator-openwhisk-deploy-kube && \
#    cd incubator-openwhisk-deploy-kube && \
#    ./tools/travis/start-kubeadm-dind.sh

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

USE_HAIRPIN=true "$SCRIPTDIR"/dind-cluster-v${TRAVIS_KUBE_VERSION}.sh up

# restore bash, after our mayhem
#sudo mv /bin/bash.orig /bin/bash




## copied from https://github.com/apache/incubator-openwhisk-deploy-kube/blob/master/tools/travis/start-kubeadm-dind.sh

# Install kubectl in /usr/local/bin so subsequent scripts can find it
sudo cp $HOME/.kubeadm-dind-cluster/kubectl-v$TRAVIS_KUBE_VERSION* /usr/local/bin/kubectl

echo "Kubernetes cluster is deployed and reachable"
kubectl describe nodes

# Download and install misc packages and utilities
pushd /tmp
  # Need socat for helm to forward connections to tiller on ubuntu 16.04
  sudo apt update
  sudo apt install -y socat

  # Download and install helm
  curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh && chmod +x get_helm.sh && ./get_helm.sh
popd

# Pods running in kube-system namespace should have cluster-admin role
kubectl create clusterrolebinding add-on-cluster-admin --clusterrole=cluster-admin --serviceaccount=kube-system:default

# Install tiller into the cluster
/usr/local/bin/helm init --service-account default

# Wait for tiller to be ready
TIMEOUT=0
TIMEOUT_COUNT=60
until [ $TIMEOUT -eq $TIMEOUT_COUNT ]; do
  TILLER_STATUS=$(kubectl -n kube-system get pods -o wide | grep tiller-deploy | awk '{print $3}')
  TILLER_READY_COUNT=$(kubectl -n kube-system get pods -o wide | grep tiller-deploy | awk '{print $2}')
  if [[ "$TILLER_STATUS" == "Running" ]] && [[ "$TILLER_READY_COUNT" == "1/1" ]]; then
    break
  fi
  echo "Waiting for tiller to be ready"
  kubectl -n kube-system get pods -o wide
  let TIMEOUT=TIMEOUT+1
  sleep 5
done

if [ $TIMEOUT -eq $TIMEOUT_COUNT ]; then
  echo "Failed to install tiller"

  # Dump lowlevel logs to help diagnose failure to start tiller
  $HOME/dind-cluster.sh dump
  kubectl -n kube-system describe pods
  exit 1
fi
