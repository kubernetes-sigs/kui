#!/usr/bin/env bash

# this should point to the root of kui
# .. is the case when running in the docker container
export CLIENT_HOME=${CLIENT_HOME-..}

/usr/bin/env node ${CLIENT_HOME}/dist/headless/kui-proxy.min.js
