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

# composer/kui doesn't support travis osx and travis osx doesn't have docker
if [ "$TRAVIS_OS_NAME" == "osx" ] && ([ "$TRAVIS_REPO_SLUG" == composer/kui ] || [ "$NEEDS_OPENWHISK" == true ] || [ "$NEEDS_KUBERNETES" == true ]); then
  exit 0
fi

if [ "$TRAVIS_BUILD_STAGE_NAME" == "Npm release" ]; then
  exit 0
fi

if [ ! -d bin ]; then
    mkdir bin
fi

# install jq on osx (linux travis has built-in jq)
if [[ `uname` == Darwin ]]; then
  which jq || brew install jq
fi

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

function count {
    cnt=0
    for i in $1; do
        cnt=$((cnt+1))
    done
    echo $cnt
}

#
# On linux, we will need to have multiple xvfb DISPLAYs, so that we
# can run tests in parallel. TODO: what about mac and windows?
#
function spawnXvfb {
    # start Xvfb to allow for electron to do its thing
    # careful: make sure this comes after the "wait" just above
    NLAYERS=$(count "$LAYERS")
    NTARGETS=$(count "$MOCHA_TARGETS")
    NDISPLAYS=$((NLAYERS*NTARGETS))
    echo "NLAYERS=$NLAYERS NTARGETS=$NTARGETS NDISPLAYS=$NDISPLAYS"
    for ((idx=1;idx<=$NDISPLAYS;idx++)); do
        DISPLAY=":$idx"
        echo "spawning Xvfb on DISPLAY=$DISPLAY"
        Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 $DISPLAY -ac >& /dev/null &
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

    spawnXvfb

    children=()

    # if tests need the `ibmcloud` CLI, install it for them
    if [ -n "$NEEDS_IBMCLOUD_CLI" ]; then
        ./tools/travis/installers/ibmcloud.sh &
        children+=("$!")
        echo "ibmcloud PID $!"
    fi

    if [ "$NEEDS_KUBERNETES" == "true" ]; then
        # install kubectl: no longer needed, as we are getting it from kubeadm-dind
        # ./tools/travis/installers/kubectl.sh &

        # set up a local cluster, using kubeadm-dind
        ./tools/travis/installers/microk8s/start-cluster.sh &
        children+=("$!")
        echo "microk8s PID $!"
    fi

    if [ "$NEEDS_OPENWHISK" == "true" ]; then
        # install the openwhisk runtime
        echo "Installing openwhisk"
        ./tools/travis/installers/openwhisk.sh &
        children+=("$!")
        echo "openwhisk PID $!"
    fi

    # start the installation; here, we use `npm ci` as 1) it's a bit
    # faster than `npm install`; and 2) we want to avoid any
    # contamination of e.g. package-lock.json
    echo "starting kui npm install"
    npm ci

    # create a dist build to test against
    if [ -n "$NEEDS_HEADLESS" ]; then
        # create a headless dist to test against
        # note that we target the headless build to /tmp/kui; see ./script.sh for the use of it
        # DO NOT DO IN PARALLEL with the electron build; link:init currently updates the client directory
        export NO_ZIPS=true
        (cd clients/default && npm run build:headless && tar -C /tmp -jxf dist/headless/Kui-headless.tar.bz2)
        #children+=("$!")
    fi

    if [ -n "$MOCHA_TARGETS" ]; then
        # create mocha targets to test aginst
        for MOCHA_TARGET in $MOCHA_TARGETS; do
            # we aren't yet ready to build these in parallel; TODO we
            # will need to call link:init first for each in sequence,
            # then we can build the clients in parallel
            if [ "$MOCHA_TARGET" == "webpack" ] && [ "$TRAVIS_OS_NAME" == "osx" ]; then
                echo "skipping webpack target install for osx"
            else
                ./tools/travis/test/target.d/$MOCHA_TARGET.sh
            fi
        done
    fi

    # wait for the openwhisk or kubernetes setup logic to complete
    wait_and_get_exit_codes "${children[@]}"
    if [ $EXIT_CODE != 0 ]; then exit $EXIT_CODE; fi
fi

if [ -z "$LAYERS" ] && [ -n "$SCRIPTS" ]; then
    #
    # we were asked to run one or more test.d/ scripts and NOT asked
    # to run any mocha layers; in this case, all we need to do is a
    # plain npm install to set things up for the SCRIPTS
    # (re: npm ci versus npm install, see the comment above)
    #
    npm ci
fi
