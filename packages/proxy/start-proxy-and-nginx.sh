#!/usr/bin/env bash

#
# Copyright 2021 The Kubernetes Authors
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

export KUI_USE_HTTP=${KUI_USE_HTTP-true}
export KUI_PROXY_COHOSTED=true

# start kui proxy
(cd /usr/share/nginx/html/kui && npx start-proxy) &

# start nginx
#exec nginx -g 'pid /tmp/nginx.pid; daemon off;'
exec nginx -g 'daemon off;'
