#!/usr/bin/env bash

#
# Copyright 2018-19 IBM Corporation
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
TOPDIR="$SCRIPTDIR/../../../"

#
# this script expects you tod efine, elsewhere (e.g. a travis env var):
# @env PUBLISH_THIS_REPO_SLUG the "org/repo" that you wish to result in a publish to s3
#
# TODO: For now we hardcoded travis job number in deployment logic. We should consider using Travis Build Stages once ibm travis adds the support.
if [ "$TRAVIS_REPO_SLUG" == "$PUBLISH_THIS_REPO_SLUG" ] && [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_EVENT_TYPE" == "push" ] && [[ "$TRAVIS_JOB_NUMBER" == "${TRAVIS_BUILD_NUMBER}.1" || "$TRAVIS_JOB_NUMBER" == "${TRAVIS_BUILD_NUMBER}.7" ]]; then

    if [ "$TRAVIS_OS_NAME" == linux ]; then
        echo "uploading typecov data"
        (cd "$SCRIPTDIR"/../../typecov && npm run --silent typecov && npm run --silent upload)
    fi

    echo "pushing builds"
    unset TEST_FROM_BUILD

    # NOTE: For now, we cross-build linux and windows electron distribuitions on tarvis linux, and macOS electron distribution on travis macOS
    if [ "$TRAVIS_OS_NAME" == linux ]; then
      sudo apt-get update && sudo apt-get install wine fakeroot
    fi

    (cd $TOPDIR/packages/builder/dist/publishers/s3 && npm install && BRANCH="dev.$TRAVIS_BUILD_NUMBER" ./publish.sh)
else
    echo "not pushing builds"
fi
