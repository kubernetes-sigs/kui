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

if [ ! -d bin ]; then
    mkdir bin
fi

# install jq
# (doing an apt-get update to install jq takes forever; often 80-90 seconds)
(cd bin && curl -L -O https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && mv jq-linux64 jq && chmod +x jq)

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
    if [ $? != 0 ]; then exit $?; fi

    # create a dist build to test against
    if [ -n "$NEEDS_HEADLESS" ]; then
        # create a headless dist to test against
        (cd packages/kui-builder/dist/headless && ./build.sh; cd ../builds && tar jxf "Kui-headless.tar.bz2") &
    fi
    if [ $? != 0 ]; then exit $?; fi

    if [ -n "$NEEDS_ELECTRON" ]; then
        # create an electron dist to test against
        (cd packages/kui-builder/dist/electron && NO_INSTALLER=true ./build.sh linux) &
        children+=("$!")
    fi
    if [ $? != 0 ]; then exit $?; fi

    # wait for the openwhisk or kubernetes setup logic to complete
    wait_and_get_exit_codes "${children[@]}"
    if [ $EXIT_CODE != 0 ]; then exit $EXIT_CODE; fi

    # start Xvfb to allow for electron to do its thing
    # careful: make sure this comes after the "wait" just above
    SCREEN_WIDTH="$((5*WINDOW_WIDTH))"
    echo "SCREEN_WIDTH=$SCREEN_WIDTH"
    Xvfb $DISPLAY -screen 0 ${SCREEN_WIDTH}x${WINDOW_HEIGHT}x24 -ac >& /dev/null &

    # corral the tests that plugins might offer
    echo "Test corral"
    (cd tests && ./bin/corral.sh)
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
