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
STAGING="${TOPDIR}"/packages/app/build

(cd "$STAGING" && rm -f css && ln -s "$TOPDIR"/packages/app/web/css)

KUI_BUILD_CONFIG=${KUI_BUILD_CONFIG-"$SCRIPTDIR"/../../examples/build-configs/default}
if [ ! -d "$KUI_BUILD_CONFIG" ]; then
    KUI_BUILD_CONFIG="`pwd`/$KUI_BUILD_CONFIG"
    if [ ! -d "$KUI_BIULD_CONFIG" ]; then
        echo "Cannot find KUI_BUILD_CONFIG"
        exit 1
    fi
fi

if [ -d "$KUI_BUILD_CONFIG"/css/themes ]; then
    echo "linking in theme css"
    rm -f "$STAGING"/css/themes && \
        (cd "$STAGING"/css && ln -s "$KUI_BUILD_CONFIG"/css/themes)
fi
if [ -d "$KUI_BUILD_CONFIG"/icons ]; then
    echo "linking in theme icons"
    rm -f "$STAGING"/icons && \
        (cd "$STAGING" && ln -s "$KUI_BUILD_CONFIG"/icons)
fi
if [ -d "$KUI_BUILD_CONFIG"/images ]; then
    echo "linking in theme images"
    rm -f "$STAGING"/images && \
        (cd "$STAGING" && ln -s "$KUI_BUILD_CONFIG"/images)
fi
