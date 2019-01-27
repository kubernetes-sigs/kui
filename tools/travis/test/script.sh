#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

if [ -n "$SCRIPTS" ]; then
    #
    # then we were asked to run one or more test.d/ scripts
    #
    for script in $SCRIPTS; do
        echo "spawning test script: $script"
        "$SCRIPTDIR"/test.d/$script &
    done
    wait

else
    #
    # otherwise, we were asked to run one or more mocha test suites
    # (which suites as indicated by $LAYERS)
    #

    export KEY=`node -e 'console.log(parseInt(process.env.IDX) + process.env.NUM_OPENWHISK_AUTH_LAYERS * (process.env.TRAVIS_BUILD_NUMBER % process.env.MAX_TRAVIS_CONCURRENCY))'`
    echo "Using KEY=$KEY"

    if [ "$LAYERS" != "HEADLESS" ]; then
        (cd tests && ./bin/runLocal.sh $LAYERS)

    else
        #
        # for now, the headless test suite (which is also a mocha suite)
        # is a bit of a special case
        #

        # When testing against build headless, we set TEST_SPACE manually
        # since we can't get the env var TEST_SPACE from the previous
        # runLocal.sh => runTest.sh process. Namespace Current tests will
        # fail if we don't have TEST_SPACE.

        export TEST_SPACE="${TEST_SPACE_PREFIX-ns}${KEY}"
        (cd tests && ./bin/allocate.sh "$TEST_SPACE")
        (cd packages/kui-builder/dist/builds/kui && npm run test)
    fi
fi
