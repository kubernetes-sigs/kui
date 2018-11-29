#!/bin/bash

if ! which openssl >/dev/null 2>&1; then
    echo "This script requires openssl on your PATH."
fi

template=$(cat <<EOF
_auth = @@AUTHTOKEN@@
email = @@USER@@
always-auth = true
@wdpdist:registry=https://na.artifactory.swg-devops.com/artifactory/api/npm/wdpdist-npm-virtual/
//na.artifactory.swg-devops.com/artifactory/api/npm/wdpdist-npm-virtual/:_password=@@PASSWORD@@
//na.artifactory.swg-devops.com/artifactory/api/npm/wdpdist-npm-virtual/:username=@@USER@@
//na.artifactory.swg-devops.com/artifactory/api/npm/wdpdist-npm-virtual/:email=@@USER@@
//na.artifactory.swg-devops.com/artifactory/api/npm/wdpdist-npm-virtual/:always-auth=true
EOF
)

ask() {
    local prompt="$1"; shift;
    local secret="$1"
    local answer=""
    while [[ -z "$answer" ]]; do
        printf "$prompt " >> /dev/tty
        if [[ -n "$secret" ]]; then
            stty_orig=`stty -g`
            stty -echo
        fi
        read answer
        if [[ -n "$secret" ]]; then
          stty $stty_orig
        fi
    done
    echo "$answer"
}

set -e

username="$(ask 'Enter your IBM intranet ID:')"
password="$(ask 'Enter your IBM intranet password:' secret)"
token="$(echo -n "$username:$password" | openssl base64 -A)"
pass64="$(echo -n "$password" | openssl base64 -A)"

if [[ -f ~/.npmrc ]]; then
    bak=~/.npmrc.$(date +%Y%m%d%H%M%S)
    echo "Backing up your .npmrc as $bak" >&2
    cp ~/.npmrc $bak
fi

echo "$template" | sed -e "s/@@AUTHTOKEN@@/$token/g" \
                       -e "s/@@PASSWORD@@/$pass64/g" \
                       -e "s/@@USER@@/$username/g" > ~/.npmrc

echo "Installed new .npmrc. Testing..." >&2
npm ping @wdpdist >&2
