#!/usr/bin/env bash

#
# Copyright 2017-19 IBM Corporation
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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../../.."

if [ -z "$WHISKDIR" ]; then
    WHISKDIR="$ROOTDIR/openwhisk"
fi

if [ ! -d "$WHISKDIR" ]; then
    echo "Cannot find openwhisk installation"
    exit 1
fi

export WHISKDIR
echo "Found WHISKDIR=$WHISKDIR"

#
# get an openwhisk key
#
# @param $1 the "space" part of the namespce
# @param $2 the path to the wskprops file we should use
#
function allocateHelper {
    USER="${TEST_ORG}_user"
    SPACE="$1"
    NAMESPACE="${TEST_ORG}_${SPACE}"
    WSKPROPS="$2"

    # fetch openwhisk keys for the new space
    echo "Getting auth key for namespace $SPACE"
    AUTH=`"$WHISKDIR/bin/wskadmin" user create "${USER}" -ns "${NAMESPACE}"`

    if [ $? != 0 ]; then
        sleep 2
        AUTH=`"$WHISKDIR/bin/wskadmin" user create "${USER}" -ns "${NAMESPACE}"`
        if [ $? != 0 ]; then
            sleep 2
            AUTH=`"$WHISKDIR/bin/wskadmin" user create "${USER}" -ns "${NAMESPACE}"`
            if [ $? != 0 ]; then
                echo "Failed to allocate OpenWhisk creds $SPACE"
                exit 1
            fi
        fi
    fi

    echo "storing the auth key for $NAMESPACE in $WSKPROPS"
    cp ~/.wskprops-template "$WSKPROPS"
    echo "AUTH=$AUTH" >> "$WSKPROPS"
}

function allocate {
    if [ -n "$NEEDS_SECOND_OPENWHISK_AUTH" ]; then
        allocateHelper "$2" "$WSK_CONFIG_FILEb"
    fi

    allocateHelper "$1" "$WSK_CONFIG_FILE"
}

allocate "$1" "$2"
