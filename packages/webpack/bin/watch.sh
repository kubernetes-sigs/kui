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

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
export CLIENT_HOME=$(cd "$SCRIPTDIR"/../../ && pwd)
MODULE_HOME=$(cd "$SCRIPTDIR"/../@kui-shell && pwd)
BUILDER_HOME="$MODULE_HOME"/builder

CONFIG="$MODULE_HOME"/webpack/webpack.config.js

npx --no-install kui-compile

KUI_STAGE="$CLIENT_HOME" node "$BUILDER_HOME"/lib/configure.js webpack-watch

# we need to get @kui-shell/settings into the package
# dependencies, so that npm prune --production does not remove it;
# i.e. a self-managed symlink is not sufficient
#npm install --save "$CLIENT_HOME"/packages/app/build

pushd "$CLIENT_HOME"
  rm -rf dist/webpack
  mkdir -p dist/webpack/css
  pushd dist/webpack/css
    for i in "$MODULE_HOME"/core/web/css/*; do
        ln -s $i
    done
    for i in "$CLIENT_HOME"/theme/css/*; do
        ln -s $i
    done
    ln -s "$CLIENT_HOME"/theme/icons
    ln -s "$CLIENT_HOME"/theme/images
  popd

  if [ -f theme/config.json ]; then
      echo "linking config-dev.json"
      pushd "$MODULE_HOME"/settings
        rm -f config-dev.json
        cp "$CLIENT_HOME"/theme/config.json config-dev.json
      popd
  fi
popd

npx --no-install webpack-dev-server --progress --config "$CONFIG"
