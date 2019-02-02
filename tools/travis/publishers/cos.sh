#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR="$SCRIPTDIR/../../../"

#
# this script expects you tod efine, elsewhere (e.g. a travis env var):
# @env PUBLISH_THIS_REPO_SLUG the "org/repo" that you wish to result in a publish to s3
#
if [ "$TRAVIS_REPO_SLUG" == "$PUBLISH_THIS_REPO_SLUG" ] && [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_EVENT_TYPE" == "push" ] && [ "$TRAVIS_JOB_NUMBER" == "${TRAVIS_BUILD_NUMBER}.1" ]; then
    echo "pushing builds"
    unset TEST_FROM_BUILD
    (cd $TOPDIR/tests && npm run deinstrument)
    (cd $TOPDIR/packages/kui-builder/dist/publishers/s3 && npm install && sudo apt-get update && sudo apt-get install wine fakeroot && BRANCH="dev.$TRAVIS_BUILD_NUMBER" ./publish.sh)

else
    echo "not pushing builds"
fi
