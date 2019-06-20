#!/usr/bin/env bash

set -e
set -o pipefail

#!/usr/bin/env bash

set -e
set -o pipefail

echo "commencing jdk installation"

while true; do
    sudo apt install -y socat
    if [ $? != 0 ]; then
        echo "retrying jdk installation"
        sleep 5
    else
        break
    fi
done

echo "successful jdk installation"
