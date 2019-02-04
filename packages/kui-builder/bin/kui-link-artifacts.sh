#!/usr/bin/env bash

#
# Copyright 2017-18 IBM Corporation
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

function link {
    echo "linking build artifact $1 -> $2"
    rm -f "$2"
    ln -s "$1" "$2"
}

cd node_modules/@kui-shell

# note how, with the two `cd` just above, we will be working in
# node_modules/@kui-shell; so TOPDIR is two levels up
TOPDIR=../..
BUILDDIR="$TOPDIR/build"

echo "linking prescan"
link "$BUILDDIR"/.pre-scanned.json prescan.json

if [ -d "$TOPDIR"/packages/app/build ]; then
    echo "linking application configuration"
    link "$TOPDIR"/packages/app/build settings
fi
