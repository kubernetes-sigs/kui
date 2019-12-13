#!/usr/bin/env bash

#
# Copyright 2017-19 IBM Corporation
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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

if [ -n "$NYC" ]; then
    if [ -z "$TRAVIS_JOB_ID" ]; then
        # for travis, we will do the instrumentation in advance, in tools/travis/install.sh
        # for not-travis, do the instrumentation now:
        "$SCRIPTDIR"/../../../tools/codecov/instrument.sh

        # also for non-travis: clean out any prior code coverage data
        rm -rf .nyc_output
    fi
fi

if [ -z "$MONOREPO_MODE" ]; then
    echo "running as external custom client"
    ROOT="$SCRIPTDIR"/../..
    export TEST_SUITE_ROOT="$ROOT"/node_modules/@kui-shell
    export TEST_ROOT="$TEST_SUITE_ROOT"/test
    cd "$SCRIPTDIR"
else
    ROOT="$SCRIPTDIR"/../../..
    echo "running in monorepo $ROOT"
    export TEST_SUITE_ROOT="$ROOT"/node_modules/@kui-shell
    export TEST_ROOT="$ROOT"/packages/test
fi

if [ -z "$API_HOST" ]; then
    if [ -f ~/.wskprops ]; then
        . ~/.wskprops
        export API_HOST=$APIHOST
    elif [ -z "$LAYERS" ]; then
        export EXCLUDE_OW_TEST=true
    fi
fi

if [ ! -f ~/.wskprops ]; then
    echo "APIHOST=$API_HOST" > ~/.wskprops
    echo "INSECURE_SSL=true" >> ~/.wskprops
fi

export PATH=./node_modules/.bin:$PATH

# which tests to run; the default is every test
if [ $# -ne 0 ]; then
    # one or more layers, specified on command line
    WHICH=$@
elif [ -n "$LAYERS" ]; then
    # one or more layers, specified by env var
    WHICH=$LAYERS
else
    # all layers
    WHICH=""
fi

echo "Running these layers: $# $WHICH"

children=()
childrenNames=()

function kill_them_all() {
    children=("$@")
    for job in "${children[@]}"; do
       echo "killing ${job}"
       kill -9 ${job}
    done
    exit
}
trap kill_them_all INT

idx=${PORT_OFFSET_BASE-${PORT_OFFSET-1}}
if [ -z "$WHICH" ]; then
    (LAYER=$LAYER DISPLAY=":$idx" PORT_OFFSET=$idx "$TEST_ROOT"/bin/runTest.sh 2>&1)
else
    for i in $WHICH; do
        LAYER=`basename $i`
        echo "spawning mocha layer $LAYER PORT_OFFSET=$idx"
        (LAYER=$LAYER DISPLAY=":$idx" PORT_OFFSET=$idx "$TEST_ROOT"/bin/runTest.sh 2>&1) &
        children+=("$!")
        childrenNames+=("$LAYER")
        idx=$((idx+1))
    done
fi

function wait_and_get_exit_codes() {
    children=("$@")
    EXIT_CODE=0
    # the ! gives us indices
    for jobIdx in "${!children[@]}"; do
       job="${children[$jobIdx]}"
       jobName="${childrenNames[$jobIdx]}"
       echo "$(tput setaf 3)waiting on ${jobName} with PID ${job}$(tput sgr0)" # yellow text
       CODE=0;
       wait ${job} || CODE=$?
       if [[ "${CODE}" != "0" ]]; then
           echo "$(tput setaf 1)failing: job ${jobName} exited with a non-zero code ${CODE}$(tput sgr0)" # red text
           EXIT_CODE=1;
       else
           echo "$(tput setaf 2)ok: mocha job ${jobName} exited with success$(tput sgr0)" # red text
       fi
   done
}
wait_and_get_exit_codes "${children[@]}"

# finally, if the tests were successful, report on code coverage
if [ $EXIT_CODE == 0 ]; then
    if [ -n "$NYC" ]; then
        # in travis, we will do the report generation in tools/travis/script.sh
        if [ -z "$TRAVIS_JOB_ID" ]; then
            set +e # we don't want report generation failures to induce a test failure
            "$SCRIPTDIR"/../../../tools/codecov/report.sh
        fi
    fi
fi

echo "runMochaLayers finished with ${EXIT_CODE-0}"
exit "${EXIT_CODE-0}"
