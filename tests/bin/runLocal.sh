#
# Copyright 2017 IBM Corporation
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

#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
export TEST_ROOT="$SCRIPTDIR/.."

# the | tee should fail if runTest fails
set -o pipefail

if [ -z "$API_HOST" ]; then
    . ~/.wskprops
    export API_HOST=$APIHOST
fi

if [ ! -f ~/.wskprops ]; then
    echo "APIHOST=$API_HOST" > ~/.wskprops
    echo "INSECURE_SSL=true" >> ~/.wskprops
fi

export PATH=./node_modules/.bin:$PATH

if [ -z "$REDIS_URL" ]; then
    REDIS_IP=`netstat -rn | awk '$NF=="lo0" && $3=="UGSc" { print substr($1, 1, index($1, "/") - 1)}'`
    if [ $? == 0 ]; then
        export REDIS_URL="redis://${REDIS_IP}:6379"
    fi
fi

if [ -z "$REDIS_URL" ]; then
    # do we need to start redis ourselves?
    redis-server > /dev/null &
    REDIS_PID=$!
fi

if [ ! -d logs ]; then
    mkdir logs
fi

rm logs/* 2> /dev/null

# which tests to run; the default is every test
if [ $# -ne 0 ]; then
    # one or more layers, specified on command line
    for i in $@; do
        WHICH=" $WHICH tests/passes/$i"
    done
elif [ -n "$LAYERS" ]; then
    # one or more layers, specified by env var
    WHICH=tests/passes/$LAYERS
else
    # all layers
    WHICH=tests/passes/*
fi

echo "Running these layers: $# $WHICH"

idx=1
children=()
for i in $WHICH; do
    LAYER=`basename $i`
    echo "spawning mocha layer $LAYER"
    (LAYER=$LAYER DISPLAY=":$idx" PORT_OFFSET=$idx ./bin/runTest.sh 2>&1 | tee logs/$LAYER.out) &

    children+=("$!")
    idx=$((idx+1))
done

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
       else
           echo "job ${job} finished successfully"
       fi
   done
}
wait_and_get_exit_codes "${children[@]}"

# finally, if the tests were successful, report on code coverage
if [ $? == 0 ]; then
    if [ -d .nyc_output ]; then
        # always print something user-friendly to the console
        # nyc's default reporter seems pretty reasonable for this
        ls -l .nyc_output
        (cd .nyc_output && ls -l | sort -k5 -n -r | head -1 | awk '{print $NF}' | xargs head -c 1000) # print a bit of the biggest file
        nyc report

        if [ -n "$TRAVIS" ]; then
            # if in travis, link with codecov, which wants a certain output format
            nyc report --reporter=text-lcov > coverage.lcov && codecov
        fi

        # make sure we don't fail the tests with bugs in this here postscript
        exit 0
    fi
fi

echo "runLocal finished with ${EXIT_CODE-0}"
exit "${EXIT_CODE-0}"
