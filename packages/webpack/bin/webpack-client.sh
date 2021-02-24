#!/usr/bin/env bash

#
# Copyright 2021 The Kubernetes Authors
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

echo 'Visit this url:'
if [ "$KUI_USE_HTTP" == "true" ]; then
  echo 'http://localhost:9080'
  docker run --rm -p 9080:80 kui-webpack
else
  echo 'https://localhost:9080'
  docker run --rm -p 9080:443 kui-webpack
fi
