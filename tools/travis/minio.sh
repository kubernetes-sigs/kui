#!/usr/bin/env bash

if [ -n "$NEEDS_MINIO" ]; then
    if [ "$TRAVIS_OS_NAME" = "osx" ]; then
        OS=darwin
    else
        OS="$TRAVIS_OS_NAME"
    fi

    wget https://dl.min.io/server/minio/release/${OS}-amd64/minio
    chmod +x minio
    ./minio server MinioData &
fi
