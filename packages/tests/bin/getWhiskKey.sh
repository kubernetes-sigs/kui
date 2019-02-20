#
# Copyright 2017 IBM Corporation
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

#!/bin/bash

TARGET=`cat ~/.cf/config.json | jq --raw-output .Target`
if [ "$TARGET" == "https://api.stage1.ng.bluemix.net" ]; then
    WSK_APIHOST="https://openwhisk.stage1.ng.bluemix.net"
else
    WSK_APIHOST="https://openwhisk.ng.bluemix.net"
fi

ACCESS_TOKEN=`grep AccessToken ~/.cf/config.json  | awk '{sub("\",$", "", $3); print $3}'`
REFRESH_TOKEN=`grep RefreshToken ~/.cf/config.json  | awk '{sub("\",$", "", $2); print $2}'`

WSK_CREDENTIALS=`curl -s -X POST -H 'Content-Type: application/json' -d '{"accessToken": "'$ACCESS_TOKEN'", "refreshToken": "'$ACCESS_TOKEN'"}' ${WSK_APIHOST-https://openwhisk.ng.bluemix.net}/bluemix/v2/authenticate`

WSK_NAMESPACE=`node -e '{C=require(process.argv[1]); console.log(C.OrganizationFields.Name + "_" + C.SpaceFields.Name) }' ~/.cf/config.json`

node -e '
   const creds = JSON.parse(process.argv[1]),
         selectedNamespace = process.argv[2]
         nsCreds = creds.namespaces.find(ns => ns.name === selectedNamespace)
   if (!nsCreds) {
      console.error(`Cannot find OpenWhisk credentials for ${selectedNamespace}`)
      process.exit(1)
   } else {
      console.log(`${nsCreds.uuid}:${nsCreds.key}`)
   }
' "$WSK_CREDENTIALS" "$WSK_NAMESPACE"

