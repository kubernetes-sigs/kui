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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

function wait_and_get_exit_codes() {
    children=("$@")
    EXIT_CODE=0
    for job in "${children[@]}"; do
       echo "waiting on ${job}"
       CODE=0;
       wait ${job} || CODE=$?
       if [[ "${CODE}" != "0" ]]; then
           echo "At least one script.sh job failed with a non-zero exit code ${CODE}"
           EXIT_CODE=1;
       fi
   done
}

children=()
if [ -n "$SCRIPTS" ]; then
    #
    # then we were asked to run one or more test.d/ scripts
    #
    for script in $SCRIPTS; do
        echo "spawning test script: $script"
        "$SCRIPTDIR"/test.d/$script &
        children+=("$!")
    done
fi
# for now, wait, as webpack build conflicts with electron build
wait_and_get_exit_codes "${children[@]}"

if [ -n "$LAYERS" ]; then
    #
    # we were asked to run one or more mocha test suites (which suites
    # as indicated by $LAYERS)
    #

    export KEY=$TRAVIS_JOB_NUMBER
    echo "Using KEY=$KEY"

    # remove HEADLESS from the list, as we are handling in specially
    # in the else clause below
    NON_HEADLESS_LAYERS=${LAYERS#HEADLESS}
    if [ -n "$NON_HEADLESS_LAYERS" ]; then
        echo "running these non-headless layers: $NON_HEADLESS_LAYERS"
        (cd packages/tests && ./bin/runLocal.sh $NON_HEADLESS_LAYERS)
        EC=$?
        echo "script.sh thinks runLocal finished with $EC"
        if [ $EC != 0 ]; then exit $EC; fi
    fi

    # is "HEADLESS" on the LAYERS list?
    if [ "$NON_HEADLESS_LAYERS" != "$LAYERS" ]; then
        #
        # for now, the headless test suite (which is also a mocha suite)
        # is a bit of a special case
        #
        echo "running HEADLESS layer"

        # When testing against build headless, we set TEST_SPACE manually
        # since we can't get the env var TEST_SPACE from the previous
        # runLocal.sh => runTest.sh process. Namespace Current tests will
        # fail if we don't have TEST_SPACE.

        export TEST_SPACE="${TEST_SPACE_PREFIX-ns}${KEY}"
        export WSK_CONFIG_FILE=~/.wskprops_${KEY}
        (cd packages/tests && ./bin/allocate.sh "$TEST_SPACE")
        (cd /tmp/kui && npm run test) # see ./install.sh for the /tmp/kui target
        EC=$?
        echo "script.sh thinks headless finished with $EC"
        if [ $EC != 0 ]; then exit $EC; fi
    fi
fi

wait_and_get_exit_codes "${children[@]}"
echo "script.sh exiting with $EXIT_CODE"
exit "$EXIT_CODE"
