#!/usr/bin/env bash

#
# Copyright 2018 IBM Corporation
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

# directory of script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOTDIR="$DIR/.."

cd "$ROOTDIR"

rm -f "${BUILDDIR}/installers/*.deb"

./node_modules/.bin/electron-installer-debian --src "${BUILDDIR}/${PRODUCT_NAME}-linux-x64" --dest ${BUILDDIR}/installers/ --arch amd64 --config dpkg-config.json

for deb in "${BUILDDIR}/installers/*.deb"; do
    mv -f $deb "${BUILDDIR}/${PRODUCT_NAME}-linux-x64.deb"
done
