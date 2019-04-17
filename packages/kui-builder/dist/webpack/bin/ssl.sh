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

if [ ! -d "$CLIENT_HOME"/.keys ]; then
    mkdir "$CLIENT_HOME"/.keys
fi

if [ ! -f "$CLIENT_HOME"/.keys/key.pem ]  || [ ! -f "$CLIENT_HOME"/.keys/cert.pem ]; then
    # Notes: the .test TLD is important; it could also be .example and
    # a few other whitelisted TLDs; but most modern browsers
    # completely distrust self-signed certs with a non-dev TLD (and
    # this now includes .dev, because google has now made that a
    # non-test TLD)
    SUBJECT="-subj /C=GB/ST=London/L=London/O=GlobalSecurity/OU=ITDepartment/CN=kui.test"

    openssl req -x509 -newkey rsa:2048 \
            -keyout "$CLIENT_HOME"/.keys/key.pem \
            -out "$CLIENT_HOME"/.keys/cert.pem \
            -days 1000 \
            -passout pass:kuishell \
            -reqexts SAN \
            -extensions SAN \
            -config <(cat /etc/ssl/openssl.cnf <(printf "\n[SAN]\nsubjectAltName=DNS.1:localhost,DNS.2:kui.test,DNS.3:www.kui.test")) \
            $SUBJECT
fi

if [ ! -f "$CLIENT_HOME"/.keys/key.pem ] || [ ! -f "$CLIENT_HOME"/.keys/cert.pem ]; then
    echo '!!! KUI ERROR: the self-signed cert was not created successfully'
    echo '!!! Make sure to provide at least one non-empty answer to the cert creation step'
    echo '!!! Please try again'
    echo ''
    rm -rf "$CLIENT_HOME"/.keys
    exit 1
fi
