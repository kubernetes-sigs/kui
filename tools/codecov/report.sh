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

#
# Code coverage report generation logic
#

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR"/../..

cd "$ROOTDIR"

echo "$(tput setaf 3)code coverage: test done, generating reports$(tput sgr0)" # yellow text

# To help with debugging, print out the reports we are
# about to upload.
if [ -n "$TRAVIS_JOB_ID" ]; then
    ls -l packages/test/.nyc_output
fi

# Print something user-friendly to the console; nyc's default
# reporter seems pretty reasonable for this.
nyc report -x '**/*.ts' -x '**/core/tests/**'

# print out the keys of a coverage file, so we can confirm them later as being compatible with codecov
# the files should be file paths, and we may need to fix them up in our .codecov.yml
node -e 'const f = require("fs").readdirSync("./packages/test/.nyc_output").find(_ => _.endsWith(".json")); console.log(Object.keys(require(`./packages/test/.nyc_output/${f}`)))' || true

if [ -n "$TRAVIS_JOB_ID" ] && [ -z "$CODECOV_NO_UPLOAD" ]; then
    # In travis, unless otherwise instructed, upload to codecov.

    # First, make sure we have the `codecov` uploader installed.
    echo "$(tput setaf 3)installing code coverage tools$(tput sgr0)" # yellow text
    npm install -g codecov

    # Then, generate a codecov-compatible report, and invoke the codecov tool.
    echo "$(tput setaf 2)uploading code coverage report$(tput sgr0)" # green text
    nyc report --reporter=text-lcov -x '**/*.ts' -x '**/core/tests/**' > coverage.lcov && codecov
fi
