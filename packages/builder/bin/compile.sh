#!/usr/bin/env bash

#
# Copyright 2017 The Kubernetes Authors
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
# @param optionally, a caller may specify the name of a tsconfig.json
# to use; by default, we will use the default behavior of `tsc -b .`,
# executed from the CLIENT_HOME directory; as of this writing, tsc
# looks for a file named "tsconfig.json" in that directory
#
# optional env var parameters
# @env CLIENT_HOME the absolute path to your client's top-level directory; defaults to `pwd`
#

set -e
set -o pipefail

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

# these may no longer be needed, with the non-babel prescan?
export CLIENT_HOME=${CLIENT_HOME-`pwd`}
export PLUGIN_ROOT="$(cd "$TOPDIR" && pwd)/plugins"

#if [ ! -d plugins ] ; then
#    echo "Error: no plugins provided in the plugins/ directory"
#    exit 1
#fi

if [ ! -f tsconfig.json ]; then
    echo "Warning: skipped compiling Typescript because of missing tsconfig.json"
else
  # make typescript happy, until we have the real prescan model ready
  # (produced by builder/lib/configure.js, but which cannot be run
  # until after we've compiled the source)
  mkdir -p ./node_modules/@kui-shell
  echo "{}" > ./node_modules/@kui-shell/prescan.json

  # compile the source
  npx tsc -b ${1-.}
fi

if [ ! -d node_modules/@kui-shell/build ]; then
  mkdir -p node_modules/@kui-shell/build
fi

# generate the plugin registry
if [ -z "$NO_PRESCAN" ]; then
    npx --no-install kui-prescan
fi
