#!/usr/bin/env bash

#
# Copyright 2019 IBM Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

set -e
set -o pipefail

echo "testing webpack build from $(pwd)"

if [ "$1" == "wait" ]; then
    echo -n "waiting for webpack dev server to come up"
    set +e
    while true; do
        curl http://localhost:9080
        if [ $? == 0 ]; then
            echo "webpack dev server is ready for e-business"
            break
        else
            echo "still waiting for webpack to come up"
            sleep 1
        fi
    done
    set -e
    echo " [SUCCESS]"
    exit
fi

pushd clients/default

if [ "$KUI_USE_PROXY" == "true" ]; then
    echo "building proxy"
    CLIENT_HOME=$(pwd)
    STAGING_DIR=/tmp/kui-proxy-tmp

    if [ "$KUI_USE_HTTP" == "true" ]; then
        # configure proxy server to use HTTP and port 3000
        cat <<EOF > theme/config.json
  {
    "proxyServer": {
      "url": "http://localhost:3000/exec",
      "needleOptions": {
          "rejectUnauthorized": false
      }
    }
  }
EOF
    fi

    # use NO_CLEAN=true to keep the staging area of proxy build
    NO_CLEAN=true npm run build:proxy

    # pick up the dependencies of proxy server
    cd ${STAGING_DIR}/app && npm install

    # the docker image should be built successfully, but we don't use docker to start proxy for k8s tests
    echo "run proxy"
    cd ../kui && ../app/bin/www &
else
    # we aren't using the proxy; make sure to set this in the client config
    echo "not using proxy for webpack client"
    cat <<EOF > theme/config.json
{
  "proxyServer": {
    "enabled": false
  }
}
EOF
fi

popd

#
# we expect "docker not found" error on travis osx
# we still want to test the webpack build logic before building docker image
#
echo "starting webpack dev server"
nohup npm run watch:webpack 2>&1 | tee nohup.out &
