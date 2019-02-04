#!/usr/bin/env bash

echo 'Visit this url:'
echo 'https://localhost:9080'

docker run --rm -p 9080:443 kui-webpack
