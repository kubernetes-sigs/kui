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

PERCENT=$(cat /tmp/typecov.json | jq --raw-output .stats)
CORE_PERCENT=$(node "$SCRIPTDIR"/../lib/core-percent.js /tmp/typecov.json)

BADGE_CODE=$(cat "$SCRIPTDIR"/../lib/badge.js | awk '{printf "%s\\n", $0}')
PERCENTAGE_CODE=$(cat "$SCRIPTDIR"/../lib/raw.js | awk '{printf "%s\\n", $0}')
MODEL_CODE=$(cat "$SCRIPTDIR"/../lib/model.js | awk '{printf "%s\\n", $0}')

# format the model; it may be too long for a command line argument to curl
echo "{\"namespace\":\"_\",\"name\":\"kui/typecov-model\",\"exec\":{\"kind\":\"nodejs:default\",\"code\":\"$MODEL_CODE\"},\"annotations\":[{\"key\":\"web-export\",\"value\":true},{\"key\":\"raw-http\",\"value\":false},{\"key\":\"final\",\"value\":true}],\"parameters\":[{\"key\":\"typecov\", \"value\":" > /tmp/model.json
cat /tmp/typecov.json | jq -c 'del(.breakdowns.identifiers)' >> /tmp/model.json
echo "}]}" >> /tmp/model.json

# package
curl -XPUT $OPENWHISK_ENDPOINT/packages/kui?overwrite=true \
     -H "Content-Type: application/json" \
     -H "Authorization: basic $OPENWHISK_AUTH" \
     -d "{\"namespace\":\"_\",\"name\":\"kui\"}"

# badge action
curl -XPUT $OPENWHISK_ENDPOINT/actions/kui/badge?overwrite=true \
     -H "Content-Type: application/json" \
     -H "Authorization: basic $OPENWHISK_AUTH" \
     -d "{\"namespace\":\"_\",\"name\":\"kui/badge\",\"exec\":{\"kind\":\"nodejs:default\",\"code\":\"$BADGE_CODE\"},\"annotations\":[{\"key\":\"web-export\",\"value\":true},{\"key\":\"raw-http\",\"value\":false},{\"key\":\"final\",\"value\":true}],\"parameters\":[{\"key\":\"typecov\", \"value\": { \"overall\": $PERCENT, \"core\": $CORE_PERCENT }}]}"

# raw action
curl -XPUT $OPENWHISK_ENDPOINT/actions/kui/typecov-percent?overwrite=true \
     -H "Content-Type: application/json" \
     -H "Authorization: basic $OPENWHISK_AUTH" \
     -d "{\"namespace\":\"_\",\"name\":\"kui/typecov-percent\",\"exec\":{\"kind\":\"nodejs:default\",\"code\":\"$PERCENTAGE_CODE\"},\"annotations\":[{\"key\":\"web-export\",\"value\":true},{\"key\":\"raw-http\",\"value\":false},{\"key\":\"final\",\"value\":true}],\"parameters\":[{\"key\":\"typecov\", \"value\": { \"overall\": $PERCENT, \"core\": $CORE_PERCENT }}]}"

# model action
curl -XPUT $OPENWHISK_ENDPOINT/actions/kui/typecov-model?overwrite=true \
     -H "Content-Type: application/json" \
     -H "Authorization: basic $OPENWHISK_AUTH" \
     -d @/tmp/model.json
