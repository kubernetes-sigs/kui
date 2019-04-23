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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

cd /tmp
if [ ! -d typewiz ]; then
    if [ $(uname) = Linux ] && [ -n "$TRAVIS_JOB_ID" ]; then
        # travis is running an older yarn. see https://github.com/travis-ci/travis-ci/issues/9445
        # typewiz needs yarn >= 1.5.1; travis right now has 1.3.2 in /usr/local/bin/yarn
        sudo apt-key adv --fetch-keys http://dl.yarnpkg.com/debian/pubkey.gpg
        echo "deb http://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
        sudo apt-get update -qq
        sudo apt-get install -y -qq yarn
    fi

    # finally, we need to smash /usr/bin up front, to override travis's /usr/local/bin/yarn
    export PATH=/usr/bin:$PATH

    git clone https://github.com/starpit/typewiz.git -b coverage-report
    cd typewiz
    yarn install
    yarn build
fi

echo "typewiz is ready"
