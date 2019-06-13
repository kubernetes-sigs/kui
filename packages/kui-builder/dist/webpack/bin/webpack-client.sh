#!/usr/bin/env bash

echo 'Visit this url:'
if [ "$KUI_USE_HTTP" == "true" ]; then
  echo 'http://localhost:9080'
  docker run --rm -p 9080:80 kui-webpack
else
  echo 'https://localhost:9080'
  docker run --rm -p 9080:443 kui-webpack
fi
