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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR="${SCRIPTDIR}/../../.."
BUILDDIR="${TOPDIR}/build"

cd "$SCRIPTDIR/.."

mkdir "$BUILDDIR" >& /dev/null
touch "$BUILDDIR"/.pre-scanned.json

# link lib and web files
(cd "$TOPDIR" && "$SCRIPTDIR"/link-source-assets.sh)
if [ $? != 0 ]; then exit $?; fi

# compile source
echo "compiling source"
npx tsc
if [ $? != 0 ]; then exit $?; fi

(cd "$TOPDIR" && "$SCRIPTDIR"/link-build-assets.sh)
if [ $? != 0 ]; then exit $?; fi

# pre-compile plugin registry
echo "compiling plugin registry"
(cd ./dist/bin && ./compile.js)
