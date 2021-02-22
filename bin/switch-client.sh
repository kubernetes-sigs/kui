#!/usr/bin/env bash

#
# Copyright 2020 The Kubernetes Authors
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
cd "$SCRIPTDIR"/..

export CLIENTPATH="plugins/plugin-client-$1"

if [ ! -e $CLIENTPATH ]; then
    echo "$(tput setaf 1)Error$(tput sgr0): Specified client does not exist $PWD/$CLIENTPATH"
    exit 1
elif [ ! -e $CLIENTPATH ]; then
    echo "$(tput setaf 1)Error$(tput sgr0): Specified client directory does not exist $PWD/$CLIENTPATH"
fi

echo "$(tput setaf 3)Switching to client $1...$(tput sgr0)"

(cd node_modules/@kui-shell && rm -f client && ln -s ../../$CLIENTPATH client)

npm run compile

echo "$(tput setaf 2)ok$(tput sgr0): Successfully switched to client $1"
