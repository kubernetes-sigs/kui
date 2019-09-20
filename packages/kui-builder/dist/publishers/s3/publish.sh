#!/usr/bin/env bash

#
# Copyright 2018-2019 IBM Corporation
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
TOPDIR="$SCRIPTDIR"/../../../../../
DISTDIR="$TOPDIR"/clients/default/dist

BRANCH=${BRANCH-`git rev-parse --abbrev-ref HEAD`}
echo "Building and deploying to this release stream: $BRANCH"

# current base version
BASE_VERSION=`cat "$TOPDIR/packages/core/package.json" | jq --raw-output .version`
echo "Version before publish: $BASE_VERSION"

# if this is a prerelease/feature branch build, then mess with the version
# otherwise, do a verison bump
if [ "$BRANCH" != "master" ]; then
    # then this is a prerelease distribution; fancy up the version stamp
    DATE=`date '+%Y%m%d%H%M%S'`                   # this is the current date
    VERSION="${BASE_VERSION}-${BRANCH}.${DATE}"   # add the branch and date to the base version stamp
    (cd "$TOPDIR/packages/core" && npm version $VERSION)   # smash this into packages/core/package.json
    (cd "$TOPDIR/packages/core/build" && npm version $VERSION)   # smash this into packages/core/build/package.json
    (cd "$TOPDIR/clients/default" && npm version $VERSION)   # smash this into clients/default/package.json

    COS_BUCKET=$BRANCH                            # stash the builds in a bucket named by the branch

else
    # then this is a mainline distribution; do a plain npm verison bump
    # note that the first argument lets the caller choose the type of version bump
    (cd "$TOPDIR"/packages/core && npm version ${1-patch})
    (cd "$TOPDIR"/packages/core/build && npm version ${1-patch})

    # for mainline releases, also tag the repo
    VERSION=`cat "$TOPDIR/packages/core/package.json" | jq --raw-output .version`
    git tag $VERSION

    # stash the builds in a bucket named by the version
    COS_BUCKET=$VERSION
fi

echo "Version after publish: $VERSION"
echo "Storing builds in this bucket: $COS_BUCKET"

# 2. build the platform binary bundles
if [ -z $PLATFORM ]; then
    if [[ `uname` == Linux ]]; then
        echo "Building Linux, Windows and Headless distributions from Linux host"
        (cd "$TOPDIR"/clients/default && npm run build:electron linux)
        (cd "$TOPDIR"/clients/default && npm run build:electron windows)
        (cd "$TOPDIR"/clients/default && npm run build:headless)
        echo "confirming what we built for headless:"
        ls "$DISTDIR/headless"
    elif [[ `uname` == Darwin ]]; then
        echo "Building macOS distributions from macOS host"
        (cd "$TOPDIR"/clients/default && npm run build:electron darwin)
    fi
else
    echo "Building $PLATFORM distributions"
    (cd "$TOPDIR"/clients/default && npm run build:electron -- $PLATFORM)
    (cd "$TOPDIR"/clients/default && npm run build:headless)
    echo "confirming what we built for headless:"
    ls "$DISTDIR/headless"
fi

echo "confirming what we built for electron:"
ls "$DISTDIR/electron"

# 3. push the builds to a new OS container
# EXIST_OK means we're ok if the COS bucket already exists
if [ -z "$NO_PUSH" ]; then
    BUILDDIR="$DISTDIR/headless" NO_CONFIG_UPDATE=true EXIST_OK=true node ./push-cos.js ${COS_BUCKET}
    BUILDDIR="$DISTDIR/electron" NO_CONFIG_UPDATE=true EXIST_OK=true node ./push-cos.js ${COS_BUCKET}

    # deploy the local-proxy.html which lets us offer kui:// links in
    # unfriendly environs such as github markdown
    EXIST_OK=true node ./push-file.js web-${COS_BUCKET} "$SCRIPTDIR"/../../local-proxy.html

    KUI_S3=https://s3-api.us-geo.objectstorage.softlayer.net/kui-${COS_BUCKET}

    if [[ `uname` == Linux ]]; then
      echo "win32: ${KUI_S3}/Kui-win32-x64.zip"
      echo "linux-zip: ${KUI_S3}/Kui-linux-x64.zip"
      echo "linux-deb: ${KUI_S3}/Kui-linux-x64.deb"
      echo "headless: ${KUI_S3}/Kui-headless.zip"
      echo "headless: ${KUI_S3}/Kui-headless.tar.bz2"
    elif [[ `uname` == Darwin ]]; then
      echo "macOS: ${KUI_S3}/Kui.dmg"
      echo "macOS-tar: ${KUI_S3}/Kui-darwin-x64.tar.bz2"
    fi
fi

# revert version
if [ "$BRANCH" != "master" ]; then
    (cd "$TOPDIR"/packages/core && npm version $BASE_VERSION)
    (cd "$TOPDIR"/packages/core/build && npm version $BASE_VERSION)
    (cd "$TOPDIR/clients/default" && npm version $BASE_VERSION)
fi
