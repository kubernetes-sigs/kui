#!/usr/bin/env bash
SCRIPTDIR=$(cd $(dirname "$0") && pwd)
cd "$SCRIPTDIR"/../../tools/go/ibmcloud

echo "Installing Go Stable"
eval "$(gimme stable)";

echo "Building ibmcloud kui binary"
go build

echo "Installing ibmcloud kui plugin"
ibmcloud plugin install ./kui

echo "Testing Kui dist download and duplicate download"
go test ./...
