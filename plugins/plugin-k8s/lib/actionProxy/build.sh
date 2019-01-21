#!/usr/bin/env bash

DOCKER_USER=${DOCKER_USER-starpit}
IMAGE=${DOCKER_USER}/kubectl-action

echo "Building $IMAGE"
cp ../package.json . && docker build . -t $IMAGE; rm package.json
docker push $IMAGE
