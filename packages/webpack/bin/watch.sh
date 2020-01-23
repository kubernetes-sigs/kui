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

THEME="${MODULE_HOME}"/client

# let the caller take care of building; see https://github.com/IBM/kui/issues/3377
# npx --no-install kui-compile
# KUI_STAGE="$CLIENT_HOME" node "$BUILDER_HOME"/lib/configure.js webpack-watch

pushd "$CLIENT_HOME"
  rm -rf dist/webpack
  if [ ! -d dist/webpack/css ]; then mkdir -p dist/webpack/css; fi
  pushd dist/webpack/css
    for i in "$MODULE_HOME"/core/web/css/*; do
        ln -s $i
    done
    for i in "$THEME"/css/*; do
        ln -s $i
    done
    ln -s "$THEME"/icons
    ln -s "$THEME"/images
  popd
popd

if [ -n "$OPEN" ]; then
    OPEN="--open"
else
    # we use this to tell the dev server to touch a lock file when it is
    # done; below, we will poll until that is the case
    export LOCKFILE=/tmp/kui-build-lock.${PORT_OFFSET-0}
    rm -f $LOCKFILE
fi

npx --no-install webpack-dev-server --progress --config "$CONFIG" $OPEN &

if [ -n "$LOCKFILE" ]; then
    # don't exit until the dev server is ready
    until [ -f $LOCKFILE ]; do sleep 1; done
    rm -f $LOCKFILE
fi
