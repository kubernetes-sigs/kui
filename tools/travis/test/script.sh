#!/usr/bin/env bash

if [ "$LAYERS" == "k8s" ]; then which kubectl; fi

export KEY=`node -e 'console.log(parseInt(process.env.IDX) + process.env.NUM_OPENWHISK_AUTH_LAYERS * (process.env.TRAVIS_BUILD_NUMBER % process.env.MAX_TRAVIS_CONCURRENCY))'`

echo "Using KEY=$KEY"

if [ "$LAYERS" == "LINT" ]; then
    # npm run lint
    ./tools/scancode/scancode.sh

elif [ "$LAYERS" != "HEADLESS" ]; then
    (cd tests && ./bin/runLocal.sh $LAYERS)

# When testing against build headless, we set TEST_SPACE manually since we can't get the env var TEST_SPACE from the previous runLocal.sh => runTest.sh process. Namespace Current tests will fail if we don't have TEST_SPACE.
else
    export TEST_SPACE="${TEST_SPACE_PREFIX-ns}${KEY}"
    (cd tests && ./bin/allocate.sh "$TEST_SPACE")
    (cd dist/builds/kui && npm run test)
fi
