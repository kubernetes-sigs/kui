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

#
# This script emits pretty top output periodically. It subsets the top
# columns, and color codes the CPU and COMMAND columns.
#
# Via $NEEDS_TOP_PS, it can optionally generate a `ps` table of
# anonymous `node` processes, which can help with understanding why
# top shows cpu consumption for these otherwise fairly anonymous
# processes.
#

while true; do
    echo
    top -c -bn1 -w 160 | head -20 | awk 'FNR <= 6 { if (FNR == 3) color = 31; else color = 34; printf "\033[1;%dm%s\033[0m\n", color, $0 } FNR > 6 { sub(/\/home\/travis\/build\/[^/]+\//, "", $12); printf("%-6s %-10s \033[1;31m%-5s\033[0m %-4s %-8s \033[1;33m%s\033[0m\n", $1, $6, $9, $10, $11, $12) }'

    # in case you want to know what's going on with anonymous "node" processes
    if [ -n "$NEEDS_TOP_PS" ]; then
        echo
        echo -e "\033[32mhere are the node processes\033[0m"
        ps -ef | grep 'node ' | grep -v grep
    fi

    if [ "$KUI_USE_PROXY" == "true" ]; then
        ps aux | grep bin/www | grep -v grep
        if [ $? != 0 ]; then
            echo -e "\033[31m--- PROXY MIGHT BE DEAD\033[0m"
        else
            NPROXY=$(ps -ef | grep kui | grep stdio | wc -l)
            echo -e "\033[32m+++ proxy is up with $NPROXY tenant processes\033[0m"
        fi
    fi

    echo
    sleep 20
done

