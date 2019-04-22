#!/usr/bin/env bash

set -e
set -o pipefail

PERCENT=$(cat /tmp/typecov.json | jq --raw-output .stats.percentage)
BADGE_CODE=$(cat ./lib/badge.js | awk '{printf "%s\\n", $0}')
MODEL_CODE=$(cat ./lib/model.js | awk '{printf "%s\\n", $0}')

# format the model; it may be too long for a command line argument to curl
echo "{\"namespace\":\"_\",\"name\":\"kui/typecov-model\",\"exec\":{\"kind\":\"nodejs:default\",\"code\":\"$MODEL_CODE\"},\"annotations\":[{\"key\":\"web-export\",\"value\":true},{\"key\":\"raw-http\",\"value\":false},{\"key\":\"final\",\"value\":true}],\"parameters\":[{\"key\":\"typecov\", \"value\":" > /tmp/model.json
cat /tmp/typecov.json >> /tmp/model.json
echo "}]}" >> /tmp/model.json

# package
curl -XPUT $OPENWHISK_ENDPOINT/packages/kui?overwrite=true \
     -H "Content-Type: application/json" \
     -H "Authorization: basic $OPENWHISK_AUTH" \
     -d "{\"namespace\":\"_\",\"name\":\"kui\"}"

# badge action
curl -XPUT $OPENWHISK_ENDPOINT/actions/kui/typecov-percent?overwrite=true \
     -H "Content-Type: application/json" \
     -H "Authorization: basic $OPENWHISK_AUTH" \
     -d "{\"namespace\":\"_\",\"name\":\"kui/typecov-percent\",\"exec\":{\"kind\":\"nodejs:default\",\"code\":\"$BADGE_CODE\"},\"annotations\":[{\"key\":\"web-export\",\"value\":true},{\"key\":\"raw-http\",\"value\":false},{\"key\":\"final\",\"value\":true}],\"parameters\":[{\"key\":\"typecov\", \"value\": $PERCENT}]}"

# model action
curl -XPUT $OPENWHISK_ENDPOINT/actions/kui/typecov-model?overwrite=true \
     -H "Content-Type: application/json" \
     -H "Authorization: basic $OPENWHISK_AUTH" \
     -d @/tmp/model.json
