#!/usr/bin/env bash

#
# Copyright 2018 IBM Corporation
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

if [ $(uname) = Darwin ]; then
    echo "skipping typecov test on mac; we will cover this in the linux builds"
    exit 0
fi

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

(cd "$SCRIPTDIR"/../../../typecov && npm run typecov)

BRANCH=$(cat /tmp/typecov.json | jq .stats.percentage)
MASTER=$(curl -s https://us-south.functions.cloud.ibm.com/api/v1/web/kuishell_production/kui/typecov-percent.json?which=overall | jq .percentage)

echo "  branch=$BRANCH"
echo "  master=$MASTER"

# bash does not support floating point comparison; we use bc -l instead
COMPARO=$(echo $MASTER'<='$BRANCH | bc -l)

if [ $COMPARO == 0 ]; then
    echo "failed: type coverage regression"
    exit 1
else
    echo "ok: type coverage looks good"
fi
