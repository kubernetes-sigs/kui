#!/usr/bin/env bash

export KUI_USE_HTTP=true
export KUI_PROXY_COHOSTED=true

# start kui proxy
(cd /usr/share/nginx/html/kui && npx start-proxy) &

# start nginx
exec nginx -g 'pid /tmp/nginx.pid; daemon off;'
