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

# Usage: launch this in the background, and then visit localhost:9080

#
# Details. This script launches one local service:
# 1) the kui client and proxy server on port 9080
#

# uncomment if you need extra logging from the proxy
# DEBUG="-e DEBUG=*"

docker run --name kui -e KUBECONFIG=${KUBECONFIG//$HOME/\/root} $DEBUG --rm -p 9080:9080 kuishell/kui
