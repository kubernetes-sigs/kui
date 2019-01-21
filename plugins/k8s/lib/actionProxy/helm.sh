#!/bin/bash

# version of helm to download
HELM_VERSION="v2.10.0"

# location of kubernetes config files
KUBECONFIG_DIR=~/.kube
KUBECONFIG_FILE="$KUBECONFIG_DIR/config"

if [ ! -x ./helm ]; then
    #
    # we need to download the helm binary note how we are hard-coding
    # the HELM_VERSION; this is partly to save about 100ms in cold
    # start latency; it also probably is a good thing to peg a version
    # that we have tested
    #

    curl -s https://storage.googleapis.com/kubernetes-helm/helm-${HELM_VERSION}-linux-amd64.tar.gz | tar zxf -

    # move it into place and make the binary executable
    mv linux-amd64/helm .
    chmod +x helm

    mv linux-amd64/tiller .
    chmod +x tiller
fi

#
# parse the JSON payload; it comes on stdin
#
read ARGS
echo "$ARGS"
cmdline=`echo "$ARGS" | jq --raw-output '."cmdline"'`
output=`echo "$ARGS" | jq --raw-output '."output"'`

if [ "$cmdline" == "null" ]; then
    echo "{\"error\": \"no cmdline received\"}"
    exit 1
fi

#
# a simple "ping" which can be used to probe basic functionality
#
if [ "$cmdline" == "action-proxy-version" ]; then
    version=`cat package.json | jq --raw-output '."version"'`
    echo "{\"version\": \"$version\"}"
    exit 0
fi

#
# check to see if we have the config files on disk already
#
if [ ! -f "$KUBECONFIG_FILE" ]; then
    #
    # then we need to save the config to the local filesystem
    #
    mkdir "$KUBECONFIG_DIR"

    # parse out a few more fields for this one-time (cold-start) init
    # of the config files
    kubeconfig=`echo "$ARGS" | jq --raw-output '."kubeconfig"'`
    ca=`echo "$ARGS" | jq --raw-output '."ca"'`
    cafile=`echo "$ARGS" | jq --raw-output '."cafile"'`

    if [ "$kubeconfig" == "null" ]; then
        echo "{\"error\": \"no kubeconfig provided\"}"
        exit 1
    else
        # write kubeconfig to disk
        echo "$kubeconfig" | base64 -d > "$KUBECONFIG_FILE"
    fi

    if [ "$ca" == "null " ]; then
        echo "{\"error\": \"No ca cert provided\"}"
        exit 1
    elif [ "$cafile" == "null" ]; then
        echo "{\"error\": \"got ca cert, but not the required cafile parameter\"}"
        exit 1
    else
        echo "$ca" | base64 -d > "$KUBECONFIG_DIR/$cafile"
    fi
fi

#
# support for helm -f <filename>
# @param filename is the name of the file we should write
# @param file is the base64-encoded contents of that file
#
numFiles=`echo "$ARGS" | jq --raw-output '."numFiles"'`
echo "numFiles $numFiles"
for i in `seq 0 $((numFiles-1))`; do
    filename=`echo "$ARGS" | jq --raw-output ".filename[$i]"`
    fileIsLocal=`echo "$ARGS" | jq --raw-output ".fileIsLocal[$i]"`
    file=`echo "$ARGS" | jq --raw-output ".file[$i]"`

    if [ "$fileIsLocal" == "true" ] && [ "$file" != "null" ] && [ "$filename" == "null" ]; then
        echo "{\"error\": \"got file, but no filename\"}"
        exit 1
    fi

    if [ "$filename" != "null" ]; then
        if [ "$fileIsLocal" == "true" ]; then
            if [ "$file" == "null" ]; then
                echo "{\"error\": \"got filename, but no file\"}"
                exit 1
            else
                # write file to disk
                echo "$file" | base64 -d > "$filename"
            fi
        fi
    fi
done


#
# now we are ready to execute helm
#
echo "cmdline \"$cmdline\""
RES=`./helm $cmdline 2> /tmp/helm.err`

#
# examine the exit code and send the response
#
if [ $? != 0 ]; then
    #
    # oops, something went wrong; pull the error string from the stderr file
    #
    error="`cat /tmp/helm.err`"
    message=`jq --null-input --compact-output --arg str "$error" '{"error": $str}'`
    echo "$message"
    exit 1
elif [ "$output" == "json" ]; then
    #
    # helm exited normally, and the client asked for JSON output.
    #
    # we should already have pure JSON; we just need to strip the
    # newlines to make the openwhisk controller happy
    #
    echo "$RES" | tr '\n' ' '
else
    #
    # otherwise, we have non-JSON output
    #
    RES64=`echo "$RES" | base64 | tr '\n' ' '`
    echo "{\"result\": \"$RES64\"}"
fi
