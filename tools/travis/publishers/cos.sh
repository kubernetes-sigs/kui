#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
TOPDIR="$SCRIPTDIR/../../../"

if [ "$TRAVIS_REPO_SLUG" == "composer/cloudshell" ] && [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_EVENT_TYPE" == "push" ] && [ "$TRAVIS_JOB_NUMBER" == "${TRAVIS_BUILD_NUMBER}.1" ]; then
    echo "pushing builds"
    unset TEST_FROM_BUILD
    (cd $TOPDIR/tests && npm run deinstrument)
    (cd $TOPDIR/dist/publishers/s3 && npm install && sudo apt-get install wine fakeroot && BRANCH="dev.$TRAVIS_BUILD_NUMBER" ./publish.sh)

else
    echo "not pushing builds"
fi
