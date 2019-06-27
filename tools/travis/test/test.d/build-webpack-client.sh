#!/usr/bin/env bash

#
# Copyright 2019 IBM Corporation
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

if [ $TRAVIS_OS_NAME = "osx" ]; then
    echo "skipping webpack client build on mac; we will cover this in the linux builds"
    exit 0
fi

#
# This script tests a full build of a webpack client. Note that we do
# this in contrast to the way tools/travis/test/target.d/webpack
# operates. The goal of that other script is to set up webpack for a
# mocha run; it does so using the watch mode of webpack.
#

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR"/../../../..

pushd "$ROOTDIR"/clients/default

echo "$(tput setaf 3)building webpack client plus docker image$(tput sgr0)" # yellow text

export KUI_MONO_HOME="$ROOTDIR"
nice -15 npm run build:webpack
CODE=$!

echo "$(tput setaf 2)ok: webpack client built successfully$(tput sgr0)" # green text

exit $CODE
