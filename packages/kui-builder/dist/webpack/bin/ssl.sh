#!/usr/bin/env bash

# make .keys/ssl.crt and .keys/ssl.key
if [ ! -d .keys ]; then
    if [ -n "$TRAVIS_JOB_ID" ]; then
        # we are running in travis; specify a fake subject on the command line
        echo "using a fake subject for the certificate --- just for travis"
        SUBJECT="-subj /C=GB/ST=London/L=London/O=GlobalSecurity/OU=ITDepartment/CN=example.com"
    fi

    mkdir .keys && \
        openssl genrsa -out .keys/ssl.key 2048 && \
        openssl req -new -key .keys/ssl.key -x509 -days 999 -out .keys/ssl.crt ${SUBJECT}

    if [ $? != 0 ]; then exit $?; fi
fi

if [ ! -f .keys/ssl.key ] || [ ! -f .keys/ssl.crt ]; then
    echo '!!! KUI ERROR: the self-signed cert was not created successfully'
    echo '!!! Make sure to provide at least one non-empty answer to the cert creation step'
    echo '!!! Please try again'
    echo ''
    rm -rf .keys
    exit 1
fi
