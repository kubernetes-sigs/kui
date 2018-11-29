#!/usr/bin/env bash

#
# this script installs kubectl, helm, and unpacks the credentials
# from travis environment variables
#

echo "Downloading kubectl";
(cd bin && curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && chmod +x kubectl && cp kubectl ~/bin);

echo "Downloading helm";
(cd bin && curl -L https://storage.googleapis.com/kubernetes-helm/helm-v2.11.0-linux-arm64.tar.gz | tar zxf - && mv linux-arm64/{helm,tiller} . && cp helm tiller ~/bin);

echo "Stashing kubeconfig";
mkdir ~/.kube;
echo "${KUBECONFIG_BASE64}" | base64 --decode > ~/.kube/config;

echo "Stashing kube certificate";
echo "${KUBECONFIG_PEM_BASE64}" | base64 --decode > ~/.kube/"${KUBECONFIG_PEM_NAME}";
export KUBECONFIG=~/.kube/config;

echo "Confirming kubectl works";
kubectl config get-contexts;
if [ $? != 0 ]; then echo "kube does not seem to be set up correctly"; exit 1; fi;

echo "Confirming cluster config";
kubectl config get-contexts | grep $KUBE_CLUSTER_NAME;
if [ $? != 0 ]; then echo "kubeconfig does not seem to have our cluster"; exit 1; fi;

echo "Confirming secrets work";
kubectl get pods;
if [ $? != 0 ]; then echo "maybe the kube secrets are not right?"; exit 1; fi;

echo "Ok, everything looks good with kubectl";
