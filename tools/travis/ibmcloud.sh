#!/usr/bin/env bash

echo "Installing ibmcloud CLI"
n=0
until [ $n -ge 20 ]; do
    curl -L https://clis.ng.bluemix.net/install/${TRAVIS_OS_NAME} | bash - && break
    n=$[$n+1]
    sleep 2
done
