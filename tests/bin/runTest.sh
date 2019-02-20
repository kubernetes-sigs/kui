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

#
# This script runs a given test suite "layer". We try at most three
# times for success.
#

set -e
set -o pipefail

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../.."

if [ -n "$LAYER" ]; then
    # user asked to run tests in just one specified layer, e.g. "07"

    if [ -n "$NEEDS_OPENWHISK" ]; then
        #
        # allocate openwhisk keys
        #

        #
        # Notes:
        # - in Travis, where we use a travis-local openwhisk, we
        # need to allocate auth keys on the fly
        #
        # - for local (not travis) testing, the openwhisk auth model
        # will use ~/.wskprops of process.env.WSK_CONFIG_FILE as per
        # the nominal openwhisk behavior
        #
        echo "Allocating OpenWhisk keys for travis"

        export WSK_CONFIG_FILE=~/.wskprops_${KEY}_${PORT_OFFSET}
        export WSK_CONFIG_FILEb=~/.wskpropsb_${KEY}_${PORT_OFFSET}
        export TEST_SPACE="${TEST_SPACE_PREFIX-ns}${KEY}_${PORT_OFFSET}"
        export TEST_SPACE2="${TEST_SPACE_PREFIX-ns}${KEY}_${PORT_OFFSET}b"
        "$SCRIPTDIR"/allocate.sh "$TEST_SPACE" "$TEST_SPACE2"

        if [ -f "$WSK_CONFIG_FILEb" ]; then
            . "$WSK_CONFIG_FILEb"
            export AUTH2=$AUTH
            echo "Key from layer2 '$TEST_SPACE2' '$AUTH2'"
        fi

        . "$WSK_CONFIG_FILE"
        export AUTH=$AUTH
        export __OW_APIGW_TOKEN=$APIGW_ACCESS_TOKEN

        echo "Key from layer '$TEST_SPACE' '${AUTH}'"
    fi

    LAYER="passes/${LAYER}"
fi

if [ -n "$TRAVIS_JOB_ID" ]; then
    echo "DISPLAY=$DISPLAY"
else
    export DISPLAY=:0
fi

#
# note that, in the following, passing --bail to mocha means we fail
# fast, if any test within the test suite fails
#

NYC="${SCRIPTDIR}/../node_modules/.bin/nyc"
export RUNNING_SHELL_TEST=true

function go {
    NO_USAGE_TRACKING=true mocha -c --exit --bail --recursive --timeout ${TIMEOUT-60000} tests/$LAYER --grep "${TEST_FILTER:-.*}"
}

if [ -n "$TRAVIS_JOB_ID" ]; then
    go || go || go || go
else
    go
fi
