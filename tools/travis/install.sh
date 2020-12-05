#!/usr/bin/env bash

# see https://github.com/IBM/kui/issues/5608
./tools/travis/check-error-handlers.sh

echo "Launching xvfb"
if [ "$TRAVIS_OS_NAME" = "linux" ]; then
    export DISPLAY=:1; Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 $DISPLAY -ac > /dev/null &
    export DISPLAY=:2; Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 $DISPLAY -ac > /dev/null &
    export DISPLAY=:3; Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 $DISPLAY -ac > /dev/null &
    export DISPLAY=:4; Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 $DISPLAY -ac > /dev/null &
    export DISPLAY=:5; Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 $DISPLAY -ac > /dev/null &
fi

./tools/travis/cleanupNvm.sh

if [ -n "$NEEDS_OPENWHISK" ]; then ./tools/travis/openwhisk/start.sh & ow=$!; fi
if [ -n "$NEEDS_K8S" ]; then ./tools/travis/microk8s.sh & k8s=$!; fi
if [ -n "$NEEDS_MINIO" ]; then ./tools/travis/minio.sh & minio=$!; fi
npm ci
if [ "$CLIENT" != "default" ]; then ./bin/switch-client.sh ${CLIENT-default}; fi
./tools/codecov/instrument.sh
if [ "$MOCHA_RUN_TARGET" = "webpack" ]; then export KUI_USE_PROXY=true; if [ "$DEPLOY" = "cluster" ]; then npx kui-build-webpack && npx kui-build-docker-with-proxy && (kui-run-cproxy &); else npm run watch:webpack; fi; elif [ -z "$TEST_FROM_BUILD" ]; then npm run watch:electron; else npm run build:electron:$TRAVIS_OS_NAME:${TRAVIS_CPU_ARCH-amd64}; fi
if [ -n "$ow" ]; then wait $ow; fi
if [ -n "$k8s" ]; then wait $k8s; fi
if [ -n "$minio" ]; then wait $minio; fi

if [ -n "$NEEDS_GIT" ]; then
    git config --global user.name "GitHub Actions Bot"
    git config --global user.email "<>"
fi

if [ -n "$NEEDS_BASH_PREP" ]; then
    sudo apt-get install wbritish
    ls /usr/share/dict/words
fi
