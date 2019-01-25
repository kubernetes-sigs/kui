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

# this will use place the build in ./kui
NM="`pwd`/node_modules/@kui-shell"
STAGING="$NM/staging"

# ssl cert
(cd ../kui-builder/dist/webpack && npm run http-allocate-cert)
rm -rf .keys && cp -r ../kui-builder/dist/webpack/.keys .

# this will use place the build in $STAGING
QUIET=true NO_ZIPS=true ../kui-builder/dist/headless/build.sh "$STAGING" && \
    rm -rf "$NM"/core && mv "$STAGING"/kui "$NM"/core && \
    npm run build-docker && \
    if [ -z "$NO_CLEAN" ]; then rm -rf "$STAGING"; fi
