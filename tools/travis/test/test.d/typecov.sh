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

if [ $TRAVIS_OS_NAME = "osx" ]; then
    echo "skipping typecov test on mac; we will cover this in the linux builds"
    exit 0
fi

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

(cd "$SCRIPTDIR"/../../../typecov && npm run typecov)

MASTER_RAW=$(curl -s https://us-south.functions.cloud.ibm.com/api/v1/web/kuishell_production/kui/typecov-percent.json?which=overall)

BRANCH=$(cat /tmp/typecov.json | jq .stats.percentage)
MASTER=$(echo $MASTER_RAW | jq .percentage)

echo "  branch=$BRANCH"
echo "  master=$MASTER"

# bash does not support floating point comparison; we use bc -l instead
if [ -n "$TRAVIS_JOB_ID" ]; then
    # hmm, travis sometimes doesn't have bc
    sudo apt-get install bc
fi
COMPARO=$(echo $MASTER'<='$BRANCH | bc -l)

if [ $COMPARO == 0 ]; then
    # branch has lower typecov percentage.
    BRANCH_KNOWN=$(cat /tmp/typecov.json | jq .stats.knownTypes)
    BRANCH_TOTAL=$(cat /tmp/typecov.json | jq .stats.totalTypes)

    MASTER_KNOWN=$(echo $MASTER_RAW | jq .knownTypes)
    MASTER_TOTAL=$(echo $MASTER_RAW | jq .totalTypes)

    KNOWN_DELTA=$(( MASTER_KNOWN - BRANCH_KNOWN ))
    TOTAL_DELTA=$(( MASTER_TOTAL - BRANCH_TOTAL ))

    if [[ $KNOWN_DELTA != $TOTAL_DELTA ]]; then
        # the tput bits set this to use red text
        echo "$(tput setaf 1)failing: type coverage regression$(tput sgr0)"
        exit 1
    else
        #
        # Notes: if master percentage < branch percentage, this could
        # be caused by an innocuous removal of well-typed code; this
        # condition would be indicated by a lock-step change in the
        # known and total type counts.
        #
        # For example, if master has 8 known types and 10 total
        # identifiers that could be typed, and the branch has 7 known
        # types and 9 total identifiers that could be typed... this is
        # a reduction in percentage (80% -> 78%), but not indicative
        # of a regression. The known delta in this example is 1 and
        # the total delta is also 1. We have one less known type, but
        # also one less identifier that could have been typed.
        #
        echo "warning: type coverage change; you probably removed some well-typed code"
    fi
else
    echo "$(tput setaf 2)ok: type coverage looks good$(tput sgr0)"
fi
