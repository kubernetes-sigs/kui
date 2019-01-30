#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

function wait_and_get_exit_codes() {
    children=("$@")
    EXIT_CODE=0
    for job in "${children[@]}"; do
       echo "waiting on ${job}"
       CODE=0;
       wait ${job} || CODE=$?
       if [[ "${CODE}" != "0" ]]; then
           echo "At least one test failed with a non-zero exit code ${CODE}"
           EXIT_CODE=1;
       fi
   done
}

if [ -n "$SCRIPTS" ]; then
    #
    # then we were asked to run one or more test.d/ scripts
    #
    children=()
    for script in $SCRIPTS; do
        echo "spawning test script: $script"
        "$SCRIPTDIR"/test.d/$script &
        children+=("$!")
    done

    wait_and_get_exit_codes "${children[@]}"
    exit "$EXIT_CODE"
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
