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

if [ -d "$SCRIPTDIR"/../../node_modules/@kui-shell/builder ]; then
    BUILDER_HOME="$SCRIPTDIR"/../../node_modules/@kui-shell/builder
else
    BUILDER_HOME="$SCRIPTDIR/../kui-builder"
fi

# temporary spot for the kui-headless build
NM="$SCRIPTDIR"/node_modules/@kui-shell
STAGING="$SCRIPTDIR"/kui-proxy-tmp

cd "$SCRIPTDIR"
npm install

# ssl cert
(cd "$BUILDER_HOME"/dist/webpack && npm run http-allocate-cert)
rm -rf .keys && cp -r "$BUILDER_HOME"/dist/webpack/.keys .

# this will use place the build in $STAGING
QUIET=true NO_ZIPS=true ../kui-builder/dist/headless/build.sh "$STAGING" && \
    mkdir -p "$NM" && \
    rm -rf "$NM"/core && mv "$STAGING"/kui "$NM"/core && \
    npm run build-docker && \
    if [ -z "$NO_CLEAN" ]; then rm -rf "$STAGING"; fi
