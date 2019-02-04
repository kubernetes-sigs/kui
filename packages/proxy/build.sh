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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

if [ -d "$SCRIPTDIR"/../../node_modules/@kui-shell/builder ]; then
    BUILDER_HOME="$SCRIPTDIR"/../../node_modules/@kui-shell/builder
    PROXY_HOME="$BUILDER_HOME"/../proxy
else
    PROXY_HOME="$SCRIPTDIR"
    BUILDER_HOME="$SCRIPTDIR/../kui-builder"
fi

STAGING="$PROXY_HOME" # temporary spot for the kui-headless build
APP="$SCRIPTDIR"/app

# this will use place the build in $STAGING/kui
QUIET=true NO_ZIPS=true "$BUILDER_HOME"/dist/headless/build.sh "$STAGING"

# ssl cert
(cd "$STAGING"/kui && "$BUILDER_HOME"/dist/webpack/bin/ssl.sh)

(cd "$PROXY_HOME" && ./build-docker.sh)

if [ -z "$NO_CLEAN" ]; then rm -rf "$STAGING/kui"; fi
