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

set -e
set -o pipefail

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
export CLIENT_HOME=$(cd "$SCRIPTDIR"/../../ && pwd)

if [ ! -d "$CLIENT_HOME/node_modules/@kui-shell" ]; then
    # npm on windows does some hacks to work around windows symlink nonsense
    CLIENT_HOME="$CLIENT_HOME/../.."
fi

export KUI_BUILDDIR=${BUILDDIR-"$CLIENT_HOME"/dist/webpack}

if [ -d "$SCRIPTDIR"/../@kui-shell ]; then
    # normally, this is in node_modules/.bin
    MODULE_HOME=$(cd "$SCRIPTDIR"/../@kui-shell && pwd)
else
    # except e.g. on windows where symlinks don't work; then this is
    # in node_modules/@kui-shell/webpack/bin
    MODULE_HOME=$(cd "$SCRIPTDIR"/../.. && pwd)
fi
BUILDER_HOME="$MODULE_HOME"/builder

CONFIG="$MODULE_HOME"/webpack/webpack.config.js
HEADLESS_CONFIG="$MODULE_HOME"/webpack/headless-webpack.config.js

THEME="${MODULE_HOME}"/client

rm -rf "$KUI_BUILDDIR"/dist/webpack/*

if [ "$TARGET" != "electron-renderer" ]; then
    (cd "${MODULE_HOME}"/proxy && npm install --no-package-lock)
fi

if [ -n "$OPEN" ]; then
    OPEN="--open"
else
    # we use this to tell the dev server to touch a lock file when it is
    # done; below, we will poll until that is the case
    LOCKFILE=/tmp/kui-build-lock.${PORT_OFFSET-0}
    rm -f $LOCKFILE
fi

echo "Watching Kui Headless bundles via webpack"
if [ -n "$LOCKFILE" ]; then
    LOCKFILE2=/tmp/kui-build-lock2.${PORT_OFFSET-0}
    rm -f $LOCKFILE2
fi

LOCKFILE=$LOCKFILE2 npx --no-install webpack watch --progress --config "$HEADLESS_CONFIG" &
echo $! > /tmp/kuiwatch-headless.pid

echo "Watching Kui Client bundles via webpack"
LOCKFILE=$LOCKFILE npx --no-install webpack serve --progress --config "$CONFIG" $OPEN &
echo $! > /tmp/kuiwatch-client.pid

if [ -n "$LOCKFILE" ]; then
    # don't exit until the dev server is ready
    until [ -f $LOCKFILE ]; do sleep 1; done
    rm -f $LOCKFILE
fi

if [ -n "$LOCKFILE2" ]; then
    # don't exit until the dev server is ready
    until [ -f $LOCKFILE2 ]; do sleep 1; done
    rm -f $LOCKFILE2
fi

if [ "$WATCH_ARGS" = "open" ]; then
    npm run open
elif [ "$WATCH_ARGS" = "wait" ]; then
    wait
fi

if [ "$TARGET" != "electron-renderer" ]; then
    npm run proxy &

    if [ -z "$RUNNING_KUI_TEST" ]; then
       # otherwise, the tests won't start...
       wait
    fi
fi
