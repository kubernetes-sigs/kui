#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR="$SCRIPTDIR/../../../../../"

BRANCH=${BRANCH-`git rev-parse --abbrev-ref HEAD`}
echo "Building and deploying to this release stream: $BRANCH"

# current base version
BASE_VERSION=`cat "$TOPDIR/packages/app/package.json" | jq --raw-output .version`
echo "Version before publish: $BASE_VERSION"

# if this is a prerelease/feature branch build, then mess with the version
# otherwise, do a verison bump
if [ "$BRANCH" != "master" ]; then
    # then this is a prerelease distribution; fancy up the version stamp
    DATE=`date '+%Y%m%d%H%M%S'`                   # this is the current date
    VERSION="${BASE_VERSION}-${BRANCH}.${DATE}"   # add the branch and date to the base version stamp
    (cd "$TOPDIR/packages/app" && npm version $VERSION)   # smash this into ../app/package.json
    (cd "$TOPDIR/packages/app/build" && npm version $VERSION)   # smash this into ../app/build/package.json

    COS_BUCKET=$BRANCH                            # stash the builds in a bucket named by the branch

else
    # then this is a mainline distribution; do a plain npm verison bump
    # note that the first argument lets the caller choose the type of version bump
    (cd "$TOPDIR"/packages/app && npm version ${1-patch})
    (cd "$TOPDIR"/packages/app/build && npm version ${1-patch})

    # for mainline releases, also tag the repo
    VERSION=`cat "$TOPDIR/packages/app/package.json" | jq --raw-output .version`
    git tag $VERSION

    # stash the builds in a bucket named by the version
    COS_BUCKET=$VERSION
fi

echo "Version after publish: $VERSION"
echo "Storing builds in this bucket: $COS_BUCKET"

# 2. build the platform binary bundles
#     note that it is ok if PLATFORM isn't defined; build.sh will, in this case, build for all platforms
"$TOPDIR"/packages/kui-builder/dist/electron/build.sh $PLATFORM &
"$TOPDIR"/packages/kui-builder/dist/headless/build.sh
if [ $? != 0 ]; then exit $?; fi
wait
if [ $? != 0 ]; then exit $?; fi

echo "here is what we built:"
ls -l "../../builds"

# 3. push the builds to a new OS container
# EXIST_OK means we're ok if the COS bucket already exists
if [ -z "$NO_PUSH" ]; then
    NO_CONFIG_UPDATE=true EXIST_OK=true node ./push-cos.js ${COS_BUCKET}

    # deploy the local-proxy.html which lets us offer kui:// links in
    # unfriendly environs such as github markdown
    EXIST_OK=true node ./push-file.js web-${COS_BUCKET} ../../local-proxy.html

    echo "win32: https://s3-api.us-geo.objectstorage.softlayer.net/kui-${COS_BUCKET}/Kui-win32-x64.zip"
    echo "macOS: https://s3-api.us-geo.objectstorage.softlayer.net/kui-${COS_BUCKET}/Kui.dmg"
    echo "macOS-zip: https://s3-api.us-geo.objectstorage.softlayer.net/kui-${COS_BUCKET}/Kui-darwin-x64.zip"
    echo "linux-zip: https://s3-api.us-geo.objectstorage.softlayer.net/kui-${COS_BUCKET}/Kui-linux-x64.zip"
    echo "linux-deb: https://s3-api.us-geo.objectstorage.softlayer.net/kui-${COS_BUCKET}/Kui-linux-x64.deb"
    echo "headless: https://s3-api.us-geo.objectstorage.softlayer.net/kui-${COS_BUCKET}/Kui-headless.zip"
    echo "headless: https://s3-api.us-geo.objectstorage.softlayer.net/kui-${COS_BUCKET}/Kui-headless.tar.bz2"
fi

# revert version
if [ "$BRANCH" != "master" ]; then
    (cd "$TOPDIR"/packages/app && npm version $BASE_VERSION)
    (cd "$TOPDIR"/packages/app/build && npm version $BASE_VERSION)
fi
