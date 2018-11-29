#!/usr/bin/env bash

mkdir bin

# install kubectl
if [ "$LAYERS" == "k8s" ]; then ./tools/travis/installers/kubectl.sh; fi

# install ibmcloud
./tools/travis/installers/ibmcloud.sh &

# install jq
# (doing an apt-get update to install jq takes forever; often 80-90 seconds)
(cd bin && curl -L -O https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && mv jq-linux64 jq && chmod +x jq) &

# wait 
wait

# npm install!
echo "APIHOST=$API_HOST" > ~/.wskprops                                              # dist/compile.sh needs something here
echo "AUTH=nope" >>  ~/.wskprops                                                    # ibid (see the call to initOW in openwhisk-core.js)
npm install &
(cd tests && npm install) &
wait

# if [ "$LAYERS" != "LINT" ]; then (cd tests && npm run _instrument); fi

# start Xvfb
Xvfb $DISPLAY -screen 0 ${WINDOW_WIDTH}x${WINDOW_HEIGHT}x24 -ac >& /dev/null &      # start virtual framebuffer process

# create a dist build to test against
if [ "$LAYERS" != "LINT" ] && [ "$LAYERS" != "BX" ]; then
    (cd dist/electron && NO_INSTALLER=true ./build.sh linux)
fi
    
# corral the tests that plugins might offer
echo "Test corral"
(cd tests && ./bin/corral.sh)

if [ "$LAYERS" == "HEADLESS" ]; then
    (cd dist/headless && ./build.sh; cd ../builds && tar jxf "Kui-headless.tar.bz2")
fi
