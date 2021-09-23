#
# Copyright 2018 The Kubernetes Authors
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

if [ -z "$OPENGRAPH" ]; then
    CONFIG="$CLIENT_HOME"/node_modules/@kui-shell/client/config.d/opengraph.json
    if [ -f "$CONFIG" ]; then
        OGURL=$(cat "$CONFIG" | jq -r .ogUrl)
        OGSITENAME=$(cat "$CONFIG" | jq -r .ogUrl)
        OGTITLE=$(cat "$CONFIG" | jq -r .ogTitle)
        OGDESCRIPTION=$(cat "$CONFIG" | jq -r .ogTitle)
        OGIMAGE=$(cat "$CONFIG" | jq -r .ogImage)
        OGLABEL1=$(cat "$CONFIG" | jq -r .ogLabel1)
        OGLABEL2=$(cat "$CONFIG" | jq -r .ogLabel2)
        OGDATA1=$(cat "$CONFIG" | jq -r .ogData1)
        OGDATA2=$(cat "$CONFIG" | jq -r .ogData2)

        OPENGRAPH=$(cat <<EOF
<meta property="og:type" content="website" />
<meta property="og:url" content="$OGURL" />
<meta property="og:site_name" content="$OGSITENAME" />
<meta property="og:title" content="$OGTITLE" />
<meta property="og:description" content="$OGDESCRIPTION" />
<meta property="og:image" content="$OGIMAGE" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="$OGURL" />
<meta name="twitter:description" content="$OGDESCRIPTION" />
<meta name="twitter:image" content="$OGIMAGE" />
<meta name="twitter:label1" value="$OGLABEL1" />
<meta name="twitter:data1" value="$OGDATA1" />
<meta name="twitter:label2" value="$OGLABEL2" />
<meta name="twitter:data2" value="$OGDATA2" />
EOF
                )
    else
        OPENGRAPH=""
    fi
fi
