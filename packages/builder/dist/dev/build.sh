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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR="${SCRIPTDIR}/../../../.."
STAGING="${TOPDIR}"/node_modules/@kui-shell/build
THEME="${TOPDIR}"/node_modules/@kui-shell/client

if [ ! -d "$STAGING" ]; then
  mkdir -p "$STAGING"
fi

(cd "$STAGING" && rm -f css && ln -s "$TOPDIR"/packages/core/web/css)

if [ -d "$THEME"/icons ]; then
    echo "linking in client icons"
    rm -f "$STAGING"/icons && \
        (cd "$STAGING" && ln -s "$THEME"/icons)
fi
if [ -d "$THEME"/images ]; then
    echo "linking in client images"
    rm -f "$STAGING"/images && \
        (cd "$STAGING" && ln -s "$THEME"/images)
fi
