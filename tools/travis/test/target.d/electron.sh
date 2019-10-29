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

# so that we can build electron and webpack in parallel, clone the
# clients/default directory; keep the clients/electron part in sync
# with .travis.yml: LINUX_BUILD and OSX_BUILD
# we take some care here to exclude any build artifacts in clients/default
(cd clients && mkdir electron && tar -C ${KUI_USE_CLIENT-default} --exclude dist --exclude node_modules --exclude npm-packs --exclude build -cf - . | tar -C electron -xf -)

# create an electron dist to test against
PLATFORM=`uname | tr '[:upper:]' '[:lower:]'`

cd clients/electron

# pick up the dependencies of the client
[[ -n "$KUI_USE_CLIENT" ]] && npm install

NO_INSTALLER=`[[ "$TRAVIS_OS_NAME" == linux ]] && echo true` npm run build:electron -- ${PLATFORM} # we want to test Mac DMG Build

# we expect no mac builds on linux, and no linux builds on mac
# ls exits with code 2 if the file does not exist, which is what we want
if [ "$PLATFORM" == linux ]; then
  ls dist/electron/*darwin* >& /dev/null && exit 1
elif [ "$PLATFORM" == darwin ]; then
  ls dist/electron/*linux* >& /dev/null && exit 1
fi

# if we get here, all's good
echo "it looks like we built the correct electron targets"
exit 0
