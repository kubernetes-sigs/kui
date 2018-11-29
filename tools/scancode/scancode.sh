#!/usr/bin/env bash

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="${SCRIPTDIR}/../../"
cd "$SCRIPTDIR"

rm -rf incubator-openwhisk-utilities
git clone git@github.com:apache/incubator-openwhisk-utilities.git

./incubator-openwhisk-utilities/scancode/scanCode.py --config kui.cfg "$ROOTDIR"
