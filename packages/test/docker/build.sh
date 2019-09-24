#!/usr/bin/env bash

TAG=shell-test-base
#TAG=starpit/ibm-functions-shell-base  # sometimes helpful for local deployment

# fetch a later version of chromedriver; spectron is pegged currently at 2.27
curl -O https://chromedriver.storage.googleapis.com/2.33/chromedriver_linux64.zip \
     && unzip chromedriver_linux64.zip \
     && rm chromedriver_linux64.zip

docker build -t $TAG .
