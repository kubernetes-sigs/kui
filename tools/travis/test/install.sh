#!/usr/bin/env bash

mkdir -f bin

# install jq
# (doing an apt-get update to install jq takes forever; often 80-90 seconds)
(cd bin && curl -L -O https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && mv jq-linux64 jq && chmod +x jq)


# are we running a test.d script, or a mocha test suite?
if [ -z "$SCRIPTS" ]; then
    #
    # then we're running one or more mocha test suites (which suites as indicated by $LAYERS)
    #

    # some tests require ibmcloud, e.g. bash-like; it's fast enough to
    # install, let's not go crazy with optimizing
    ./tools/travis/installers/ibmcloud.sh &

    if [ "$NEEDS_KUBERNETES" == "true" ]; then
        # install kubectl: no longer needed, as we are getting it from kubeadm-dind
        # ./tools/travis/installers/kubectl.sh &

        # set up a local cluster, using kubeadm-dind
        ./tools/travis/installers/kubeadm-dind/start-cluster.sh &
    fi

    if [ "$NEEDS_OPENWHISK" == "true" ]; then
        # install the openwhisk runtime
        ./tools/travis/installers/openwhisk.sh &
    fi

    # dist/compile.sh needs something here
    # (see the call to initOW in openwhisk-core.js)
    echo "APIHOST=$API_HOST" > ~/.wskprops
    echo "AUTH=nope" >>  ~/.wskprops

    # npm install
    # and create a dist build to test against
    if [ "$LAYERS" != "HEADLESS" ]; then
        # create an electron dist to test against
        npm install && (cd packages/kui-builder/dist/electron && NO_INSTALLER=true ./build.sh linux)
    else
        # create a headless dist to test against
        npm install && (cd packages/kui-builder/dist/headless && ./build.sh; cd ../builds && tar jxf "Kui-headless.tar.bz2")
    fi

    if [ $? != 0 ]; then exit $?;  fi

    wait
    if [ $? != 0 ]; then
        exit $?
    fi

    # start Xvfb
    Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 -ac >& /dev/null &      # start virtual framebuffer process

    # corral the tests that plugins might offer
    echo "Test corral"
    (cd tests && ./bin/corral.sh)

else
    #
    # otherwise, we were asked to run one or more test.d/ scripts
    # all we need to do is a plain npm install to set them up
    #
    npm install
fi

# we will return to code coverage later:
# if [ -z "$SCRIPTS" ]; then (cd tests && npm run _instrument); fi
