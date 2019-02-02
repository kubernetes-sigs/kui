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
           echo "At least one test failed with a non-zero exit code ${CODE}"
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
if [ $? != 0 ]; then exit $?; fi

if [ -n "$LAYERS" ]; then
    #
    # we were asked to run one or more mocha test suites (which suites
    # as indicated by $LAYERS)
    #

    export KEY=$TRAVIS_JOB_NUMBER
    echo "Using KEY=$KEY"

    if [ "$LAYERS" != "HEADLESS" ]; then
        (cd tests && ./bin/runLocal.sh $LAYERS)

    else
        #
        # for now, the headless test suite (which is also a mocha suite)
        # is a bit of a special case
        #

        # When testing against build headless, we set TEST_SPACE manually
        # since we can't get the env var TEST_SPACE from the previous
        # runLocal.sh => runTest.sh process. Namespace Current tests will
        # fail if we don't have TEST_SPACE.

        export TEST_SPACE="${TEST_SPACE_PREFIX-ns}${KEY}"
        export WSK_CONFIG_FILE=~/.wskprops_${KEY}
        (cd tests && ./bin/allocate.sh "$TEST_SPACE")
        (cd packages/kui-builder/dist/builds/kui && npm run test)
    fi
fi
if [ $? != 0 ]; then exit $?; fi

wait_and_get_exit_codes "${children[@]}"
exit "$EXIT_CODE"
