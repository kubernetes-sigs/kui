#!/usr/bin/env bash

#
# Copyright 2019 The Kubernetes Authors
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

export DISPLAY=":$((PORT_OFFSET+1))"

if [ -z "$WEBPACK_CLIENT_URL" ]; then
    export WEBPACK_CLIENT_URL=http://localhost:908${PORT_OFFSET-0}/index${PORT_OFFSET}.html
    echo "Using WEBPACK_CLIENT_URL=$WEBPACK_CLIENT_URL"
fi

if [ $# = 0 ]; then
    "$TEST_ROOT"/bin/runTest.sh
else
    for i in $@; do
        export LAYER=$i
        "$TEST_ROOT"/bin/runTest.sh
    done
fi
