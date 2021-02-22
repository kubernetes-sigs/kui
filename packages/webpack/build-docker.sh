#!/usr/bin/env bash

#
# Copyright 2019 The Kubernetes Authors
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

#
# This script assumes ./build.sh has already been called (that script
# builds the webpack bundles; this script builds the docker image)
#

set -e
set -o pipefail

CLIENT_HOME=${CLIENT_HOME-$(pwd)}
BUILDDIR="$CLIENT_HOME"/dist/webpack

echo "build-docker CLIENT_HOME=$CLIENT_HOME"
echo "build-docker BUILDDIR=$BUILDDIR"

#rm -rf "$BUILDDIR"/conf.d && mkdir "$BUILDDIR"/conf.d
#cp "$CLIENT_HOME"/node_modules/@kui-shell/webpack/conf.d/default.conf "$BUILDDIR"/conf.d/
cp "$CLIENT_HOME"/node_modules/@kui-shell/webpack/Dockerfile "$BUILDDIR"/Dockerfile

# finally, build the docker image
(cd "$BUILDDIR" && docker build . -t kui-shell/kui)
