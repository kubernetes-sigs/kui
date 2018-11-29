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
set -e
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="${SCRIPTDIR}/../../"
cd "$SCRIPTDIR"

if [[ -z $GITHUB_TOKEN ]]; then
    if [ -f ./upgradeCli-token.txt ]; then
        # maybe it's in a local file (notice how this file is in
        # .gitignore, so it will never be checked in; this is just for
        # convenience, so that devs can keep the token around in their
        # local filesystem
        GITHUB_TOKEN=`cat ./upgradeCli-token.txt`
    fi
    if [[ -z $GITHUB_TOKEN ]]; then
        >&2 echo '$GITHUB_TOKEN must be set'
        exit 1
    fi
fi

NEW_VERSION="$1"
if [[ -z $NEW_VERSION ]]; then
    # try using the version in app/package.json
    NEW_VERSION=`cat "$ROOTDIR/app/package.json" | jq --raw-output .version`
    if [[ -z $NEW_VERSION ]]; then
        >&2 echo 'version number required'
        exit 1
    fi
fi

cd ${TMPDIR-/tmp}
rm -rf cloud-shell-cli
git clone git@github.ibm.com:composer/cloud-shell-cli.git
cd cloud-shell-cli/shell
CURRENT_VERSION=`grep "const PLUGIN_VERSION = " shell.go | awk '{gsub("\"", "", $NF); print $NF}'`
if [ "$CURRENT_VERSION" == "$NEW_VERSION" ]; then
    echo "cloud-shell-cli seems up to date with $NEW_VERSION. Terminating now."
    exit
fi
git checkout -B upgrade-version
sed -i "s/^const PLUGIN_VERSION = \".*/const PLUGIN_VERSION = \"$NEW_VERSION\"/" shell.go  # note that "sed -i" is different in GNU and Mac OS X
git commit -m"version $NEW_VERSION" shell.go
git push -f origin upgrade-version

echo "Creating pull request ..."
response=$(
  curl -X POST -sSw %{http_code} -d@- https://github.ibm.com/api/v3/repos/composer/cloud-shell-cli/pulls?access_token=$GITHUB_TOKEN <<JSON
  {"title": "shell version $NEW_VERSION", "head": "upgrade-version", "base": "master"}
JSON
)
status=${response##*$'\n'}
#response code not beginning with 2 is assumed to be an error
if [[ ${status:0:1} != "2" ]]; then
  >&2 echo "Creating pull request release failed with $status :-("
  >&2 echo "${response%$'\n'*}"
else
  echo "$response" | awk '$1 == "\"html_url\":" {print substr($2, 2, length($2)-3);exit}'
fi
