#!/usr/bin/env bash

mkdir bin

# install jq
# (doing an apt-get update to install jq takes forever; often 80-90 seconds)
(cd bin && curl -L -O https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && mv jq-linux64 jq && chmod +x jq)


if [ "$LAYERS" != "LINT" ]; then
    # some tests require ibmcloud, e.g. bash-like; it's fast enough to
    # install, let's not go crazy with optimizing
    ./tools/travis/installers/ibmcloud.sh &

    if [ "$LAYERS" == "k8s" ]; then
        # install kubectl: no longer needed, as we are getting it from kubeadm-dind
        # ./tools/travis/installers/kubectl.sh &

        # set up a local cluster, using kubeadm-dind
        ./tools/travis/installers/kubeadm-dind/start-cluster.sh &
    else
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
        npm install && (cd dist/electron && NO_INSTALLER=true ./build.sh linux)
    else
        npm install && (cd dist/headless && ./build.sh; cd ../builds && tar jxf "Kui-headless.tar.bz2")
    fi

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
    npm install
fi

# we will return to code coverage later:
# if [ "$LAYERS" != "LINT" ]; then (cd tests && npm run _instrument); fi
