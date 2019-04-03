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

echo "testing webpack build from $(pwd)"

cd clients/default

#
# we expect "docker not found" error on travis osx
# we still want to test the webpack build logic before building docker image
#
npm run build:webpack

echo "run webpack"
nohup npx kui-run-webpack >/dev/null 2>&1  &
