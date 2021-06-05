#!/usr/bin/env bash

set -e
set -o pipefail

if [ -n "$NEEDS_MINIO" ]; then
    if [ "$TRAVIS_OS_NAME" = "osx" ]; then
        OS=darwin
    elif [ "$TRAVIS_OS_NAME" = "linux" ]; then
        # pin a linux version
        wget https://dl.min.io/server/minio/release/linux-amd64/archive/${MINIO_VERSION}_amd64.deb
        echo "$MINIO_SHA256 ${MINIO_VERSION}_amd64.deb" | sha256sum -c
        sudo dpkg --install ${MINIO_VERSION}_amd64.deb
        /usr/local/bin/minio server MinioData &
        exit
    else
        OS="$TRAVIS_OS_NAME"
    fi

    wget https://dl.min.io/server/minio/release/${OS}-amd64/minio
    chmod +x minio
    ./minio server MinioData &
fi
