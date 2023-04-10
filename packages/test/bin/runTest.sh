#!/usr/bin/env bash

#
# Copyright 2017 The Kubernetes Authors
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

#
# This script runs a given test suite "layer". We try at most three
# times for success. It is intended to be called from
# ./runMochaLayers.sh.
#

set -e
set -o pipefail

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

# sigh, for now, we still need to babel the files into CJS :(
(cd "$SCRIPTDIR"/../../.. && "$SCRIPTDIR"/babel.sh)

if [ -n "$LAYER" ]; then
    # user asked to run tests in just one specified layer, e.g. "07"

    if [ -n "$NEEDS_OPENWHISK" ]; then
        #
        # allocate openwhisk keys
        #

        #
        # Notes:
        # - see tools/travis/installers/openwhisk.sh for the creation of these files
        #
        export TEST_SPACE=guest
        #export TEST_SPACE2="${TEST_SPACE_PREFIX-ns}${KEY}_${PORT_OFFSET}b"

        WSK_CONFIG_FILE=~/.wskprops
        echo "Using wskconfig $WSK_CONFIG_FILE"
        echo "Using TEST_SPACE ${TEST_SPACE}"

        # check if we have already did auth allocation from previous tests against other mocha target
        #. ${WSK_CONFIG_FILEb}
        #export AUTH2=$AUTH

        . ${WSK_CONFIG_FILE}
        export API_HOST=$APIHOST
        export AUTH=$AUTH
        export __OW_APIGW_TOKEN=$APIGW_ACCESS_TOKEN
    fi

    if [ -z $EXCLUDE_OW_TEST ]; then
      if [[ $LAYER == *"core"* ]]; then
        TEST_SUITES=$(find -H "$TEST_SUITE_ROOT"/{plugin-*,core,client} -path "*/dist/test/$LAYER" -o -path '*/core/test' -maxdepth 4)
      else
        TEST_SUITES=$(find -H "$TEST_SUITE_ROOT"/{plugin-*,core,client} -path "*/dist/test/$LAYER" -maxdepth 4)
      fi
    else
      if [[ $LAYER == *"core"* ]]; then
        TEST_SUITES=$(find -H "$TEST_SUITE_ROOT"/{plugin-*,core,client} -path "*/dist/test/$LAYER" -o -path '*/core/test' ! -path "*/dist/test/openwhisk*" ! -path "*/dist/test/composer*" ! -path "*/dist/test/grid" -maxdepth 4)
      else
        TEST_SUITES=$(find -H "$TEST_SUITE_ROOT"/{plugin-*,core,client} -path "*/dist/test/$LAYER" ! -path "*/dist/test/openwhisk*" ! -path "*/dist/test/composer*" ! -path "*/dist/test/grid" -maxdepth 4)
      fi
    fi
else
    if [ -z $EXCLUDE_OW_TEST ]; then
      TEST_SUITES=$(find -H "$TEST_SUITE_ROOT"/{plugin-*,core,client} -path "*/dist/test" -o -path '*/core/test' -maxdepth 4)
    else
      TEST_SUITES=$(find -H "$TEST_SUITE_ROOT"/{plugin-*,core,client} -path "*/dist/test" ! -path "*/dist/test/openwhisk*" ! -path "*/dist/test/composer*" ! -path "*/dist/test/grid"  -maxdepth 4)
    fi
fi

echo "Running these test suites: $TEST_SUITES"

# when running on a local (i.e. not-travis) device, we aren't using
# multiple X displays
if [ -n "$TRAVIS_JOB_ID" ]; then
    # travis: we may have multiple DISPLAYs
    echo "DISPLAY=$DISPLAY"
else
    # not travis: just one display
    export DISPLAY=:0
fi
export DISPLAY

# a signifier in case plugins or core want to do something different
# while running tests
export RUNNING_SHELL_TEST=true

#
# Notes:
#
# 1) passing --bail to mocha means we fail fast, if any test within
# the test suite fails
#
# 2) flycheck is an emacs module that integrates with tslint; it
# creates temporary files in-directory :( we use a mocha exclude
# pattern to ensure we aren't executing tests in these temp files
#
# 3) we haven't yet figured out why spectron does not exit gracefully
# on its own, hence we pass --exit to mocha, which tells mocha to do a
# process.exit after the last test has been performed
#
function go {
    NO_USAGE_TRACKING=true mocha \
                     -c \
                     --exit \
                     --reporter ${MOCHA_REPORTER-spec} \
                     --bail \
                     --recursive \
                     --timeout ${TIMEOUT-60000} \
                     --grep "${TEST_FILTER:-.*}" \
                     --exclude "**/*flycheck*" \
                     $TEST_SUITES
}

if [ -n "$TRAVIS_JOB_ID" ]; then
    # travis: we try a few times
    go || go || go || go
else
    # not travis: fail fast
    go
fi
