#!/usr/bin/env bash

# Usage: launch this in the background, and then visit localhost:9080

#
# Details. This script launches one local service:
# 1) the kui client and proxy server on port 9080
#

# uncomment if you need extra logging from the proxy
# DEBUG="-e DEBUG=*"

docker run --name kui -e KUBECONFIG=${KUBECONFIG//$HOME/\/root} $DEBUG --rm -p 9080:80 kuishell/kui
