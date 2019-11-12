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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="${SCRIPTDIR}/../../"
cd "$SCRIPTDIR"

# actions
../../bin/kui let travis-for-kui/swapIntoPlace = ./swapIntoPlace.js --kind nodejs:8 -p secrets @"$ROOTDIR/packages/builder/dist/publishers/s3/secrets-cos.json"
../../bin/kui let travis-for-kui/cleanBucket = ./cleanBucket.js --kind nodejs:8 -p secrets @"$ROOTDIR/packages/builder/dist/publishers/s3/secrets-cos.json"

# composition
../../bin/kui wsk app update travis-for-kui/done ./done.js

# make a web action out of the composition
../../bin/kui wsk action webbify travis-for-kui/done
