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

CLIENT_HOME=${CLIENT_HOME-$(pwd)}

# make .keys/ssl.crt and .keys/ssl.key
if [ ! -d "$CLIENT_HOME"/.keys ]; then
    if [ -n "$TRAVIS_JOB_ID" ]; then
        # we are running in travis; specify a fake subject on the command line
        echo "using a fake subject for the certificate --- just for travis"
        SUBJECT="-subj /C=GB/ST=London/L=London/O=GlobalSecurity/OU=ITDepartment/CN=example.com"
    fi

    mkdir "$CLIENT_HOME"/.keys && \
        openssl genrsa -out "$CLIENT_HOME"/.keys/ssl.key 2048 && \
        openssl req -new -key "$CLIENT_HOME"/.keys/ssl.key -x509 -days 999 -out "$CLIENT_HOME"/.keys/ssl.crt ${SUBJECT}

    if [ $? != 0 ]; then exit $?; fi
fi

if [ ! -f "$CLIENT_HOME"/.keys/ssl.key ] || [ ! -f "$CLIENT_HOME"/.keys/ssl.crt ]; then
    echo '!!! KUI ERROR: the self-signed cert was not created successfully'
    echo '!!! Make sure to provide at least one non-empty answer to the cert creation step'
    echo '!!! Please try again'
    echo ''
    rm -rf "$CLIENT_HOME"/.keys
    exit 1
fi
