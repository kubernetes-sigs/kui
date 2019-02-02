#!/usr/bin/env bash

#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

set -e

# Build script for Travis-CI.

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../../.."
WHISKDIR="$ROOTDIR/openwhisk"

# Prefetch docker images
docker pull openwhisk/controller &
docker pull openwhisk/invoker &
docker pull openwhisk/nodejs6action &
if [ -n "${NEEDS_OPENWHISK_JAVA8}" ]; then
    docker pull openwhisk/java8action &
fi
if [ -n "${NEEDS_OPENWHISK_NODEJS8}" ]; then
    docker pull openwhisk/action-nodejs-v8 &
fi

# Clone OpenWhisk
cd $ROOTDIR
git clone --depth=1 https://github.com/apache/incubator-openwhisk.git openwhisk

# Install Ansible
pip install --user ansible==2.5.2

# Configure runtimes
if [ -n "$NEEDS_OPENWHISK_JAVA8" ]; then
    if [ -n "$NEEDS_OPENWHISK_NODEJS8" ]; then
        echo "using the java8+nodejs8 openwhisk configuration"
        cp "$SCRIPTDIR/openwhisk-runtimes-with-java8-and-nodejs8.json" "$WHISKDIR/ansible/files/runtimes.json"
    else
        echo "using the java8 openwhisk configuration"
        cp "$SCRIPTDIR/openwhisk-runtimes-with-java8.json" "$WHISKDIR/ansible/files/runtimes.json"
    fi
elif [ -n "${NEEDS_OPENWHISK_NODEJS8}" ]; then
    echo "using the nodejs8 openwhisk configuration"
    cp "$SCRIPTDIR/openwhisk-runtimes-with-nodejs8.json" "$WHISKDIR/ansible/files/runtimes.json"
else
    echo "using the default openwhisk configuration"
    cp "$SCRIPTDIR/openwhisk-runtimes.json" "$WHISKDIR/ansible/files/runtimes.json"
fi

# Deploy OpenWhisk
cd $WHISKDIR/ansible
ANSIBLE_CMD="ansible-playbook -i ${WHISKDIR}/ansible/environments/local -e docker_image_prefix=openwhisk"
$ANSIBLE_CMD setup.yml
$ANSIBLE_CMD prereq.yml
$ANSIBLE_CMD couchdb.yml
$ANSIBLE_CMD initdb.yml
$ANSIBLE_CMD wipe.yml
$ANSIBLE_CMD openwhisk.yml -e cli_installation_mode=remote -e limit_invocations_per_minute=600

$ANSIBLE_CMD properties.yml # NOTE: required to run before routemgmt.yml

if [ -n "${NEEDS_OPENWHISK_API_GATEWAY}" ]; then
    $ANSIBLE_CMD apigateway.yml

    set +e # don't fail fast here, because routemgmt needs to be retried
    $ANSIBLE_CMD routemgmt.yml
    if [ $? != 0 ]; then
        # sometimes this step fails; perhaps couchdb isn't ready yet?
        echo "routemgmt failed; retrying in 2 seconds"
        sleep 2
        $ANSIBLE_CMD routemgmt.yml
        if [ $? != 0 ]; then
            # sometimes this step fails; perhaps couchdb isn't ready yet?
            echo "routemgmt failed again; retrying in 20 seconds"
            sleep 20
            $ANSIBLE_CMD routemgmt.yml
            if [ $? != 0 ]; then exit $?; fi
        fi
    fi
fi

set -e

# Log configuration
docker images
docker ps
curl -s -k https://172.17.0.1 | jq .
curl -s -k https://172.17.0.1/api/v1 | jq .

# Setup CLI
WHISK_APIHOST=$(cat $WHISKDIR/whisk.properties | grep edge.host= | sed s/edge\.host=//)
# WHISK_AUTH=`cat ${WHISKDIR}/ansible/files/auth.guest`
WHISK_CLI="${WHISKDIR}/bin/wsk -i"

#${WHISK_CLI} property set --apihost ${WHISK_APIHOST} --auth ${WHISK_AUTH}
${WHISK_CLI} property set --apihost ${WHISK_APIHOST}
${WHISK_CLI} property get

echo "INSECURE_SSL=true" >> ~/.wskprops
echo "APIGW_ACCESS_TOKEN=true" >> ~/.wskprops
cp ~/.wskprops ~/.wskprops-template
