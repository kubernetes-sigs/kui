#!/usr/bin/env bash

#
# Copyright 2017-18 IBM Corporation
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

if [ ! -d bin ]; then
    mkdir bin
fi

# install jq
# (doing an apt-get update to install jq takes forever; often 80-90 seconds)
JQ_PLATFROM=$(case $TRAVIS_OS_NAME in "linux" ) echo "jq-linux64";; "osx" ) echo "jq-osx-amd64.dms";; esac)
(cd bin && curl -L -O https://github.com/stedolan/jq/releases/download/jq-1.6/${JQ_PLATFROM} && mv ${JQ_PLATFROM} jq && chmod +x jq)

function wait_and_get_exit_codes() {
    children=("$@")
    EXIT_CODE=0
    for job in "${children[@]}"; do
       echo "waiting on ${job}"
       CODE=0;
       wait ${job} || CODE=$?
       if [[ "${CODE}" != "0" ]]; then
           echo "At least one install step failed with a non-zero exit code ${CODE}"
           EXIT_CODE=1;
       fi
   done
}

# NMM 20190202: is this still needed?
# dist/compile.sh needs something here
# (see the call to initOW in openwhisk-core.js)
echo "APIHOST=$API_HOST" > ~/.wskprops
echo "AUTH=nope" >>  ~/.wskprops

if [ -n "$LAYERS" ]; then
    #
    # we are running mocha test suites (which suites as indicated by $LAYERS)
    #

    # if tests need the `ibmcloud` CLI, install it for them
    if [ -n "$NEEDS_IBMCLOUD_CLI" ]; then
        ./tools/travis/installers/ibmcloud.sh &
    fi

    children=()
    if [ "$NEEDS_KUBERNETES" == "true" ]; then
        # install kubectl: no longer needed, as we are getting it from kubeadm-dind
        # ./tools/travis/installers/kubectl.sh &

        # set up a local cluster, using kubeadm-dind
        ./tools/travis/installers/kubeadm-dind/start-cluster.sh &
        children+=("$!")
    fi

    if [ "$NEEDS_OPENWHISK" == "true" ]; then
        # install the openwhisk runtime
        ./tools/travis/installers/openwhisk.sh &
        children+=("$!")
    fi

    # npm install
    echo "starting kui npm install"
    npm install

    # create a dist build to test against
    if [ -n "$NEEDS_HEADLESS" ]; then
        # create a headless dist to test against
        # note that we target the headless build to /tmp/kui; see ./script.sh for the use of it
        # DO NOT DO IN PARALLEL with the electron build; link:init currently updates the client directory
        (cd clients/default && npm run build:headless && tar -C /tmp -jxf dist/headless/Kui-headless.tar.bz2)
        #children+=("$!")
    fi

    if [ -n "$MOCHA_TARGETS" ]; then
        # create mocha targets to test aginst
        for MOCHA_TARGET in $MOCHA_TARGETS; do
          ./tools/travis/test/target.d/$MOCHA_TARGET.sh # DO NOT DO WEBPACK and ELECTRON BUILD IN PARALLEL; link:init updates the client directory
        done
    fi

    # wait for the openwhisk or kubernetes setup logic to complete
    wait_and_get_exit_codes "${children[@]}"
    if [ $EXIT_CODE != 0 ]; then exit $EXIT_CODE; fi

    # start Xvfb to allow for electron to do its thing
    # careful: make sure this comes after the "wait" just above
    idx=1
    for i in $LAYERS; do
        DISPLAY=":$idx"
        echo "spawning Xvfb on DISPLAY=$DISPLAY"
        Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 $DISPLAY -ac >& /dev/null &
        idx=$((idx+1))
    done
fi

if [ -z "$LAYERS" ] && [ -n "$SCRIPTS" ]; then
    #
    # we were asked to run one or more test.d/ scripts and NOT asked
    # to run any mocha layers; in this case, all we need to do is a
    # plain npm install to set things up for the SCRIPTS
    #
    npm install
fi

# we will return to code coverage later:
# if [ -z "$SCRIPTS" ]; then (cd tests && npm run _instrument); fi
