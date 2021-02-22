#!/usr/bin/env bash

#
# Copyright 2017-18 The Kubernetes Authors
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
# Code coverage instrumentation logic
#

set -e
set -o pipefail

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOT="$SCRIPTDIR"/../..

# recompile source, so that we don't attempt to instrument previously instrumented code
function deinstrument {
    echo "$(tput setaf 3)code coverage: de-instrumenting$(tput sgr0)" # yellow text

    pushd "$ROOT" >& /dev/null
    npm run -s compile:clean && npm run -s compile && find packages/core -name '*flycheck*.js' -exec rm {} \;
    popd >& /dev/null

    echo "$(tput setaf 2)ok: code coverage de-instrumentation successful$(tput sgr0)" # green text
}

function instrument {
    echo "$(tput setaf 3)code coverage: instrumenting$(tput sgr0)" # yellow text

    pushd "$ROOT"/packages >& /dev/null
    rm -rf corei && npx nyc instrument --complete-copy core corei && rm -rf corei/src && for i in corei/*; do rm -rf core/$(basename $i) && mv $i core/$(basename $i); done
    popd >& /dev/null

    echo "$(tput setaf 2)ok: code coverage instrumentation successful$(tput sgr0)" # green text
}

if [ -n "$NYC" ] && [ -z "$NYC_NO_INSTRUMENT" ]; then
    if [ -z "$TRAVIS_JOB_ID" ]; then
        # not travis: recompile source, so that we don't attempt to instrument previously instrumented code
        deinstrument
    fi

    instrument
fi
