#!/bin/bash
set -e

# Build script for Travis-CI.

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../.."
WHISKDIR="$ROOTDIR/../openwhisk"

# disable controller1 and invoker1
cd $WHISKDIR/ansible/environments/local/
cp hosts.j2.ini hosts.bak
grep -vE 'controller1|invoker1' hosts.bak > hosts.j2.ini

# Install OpenWhisk
cd $WHISKDIR/ansible

# smash in our smaller set up required runtimes
cp "$SCRIPTDIR/runtimes.json" "$WHISKDIR/ansible/files"

# note that we increase the quotas on invocations per minute and concurrent invocations (per namespace)
ANSIBLE_CMD="ansible-playbook -i environments/local -e docker_image_prefix=openwhisk -e limit_invocations_per_minute=600 -e limit_invocations_concurrent=100"

$ANSIBLE_CMD setup.yml
$ANSIBLE_CMD prereq.yml
#(cd $ROOTDIR/tests/docker && ./build.sh) & # initialize test docker base image, in parallel (!!! must be after prereq, as it restarts docker)
$ANSIBLE_CMD couchdb.yml
$ANSIBLE_CMD initdb.yml
$ANSIBLE_CMD apigateway.yml  # not needed directly, but it comes with redis if we need it

cd $WHISKDIR
./gradlew  -PdockerImagePrefix=openwhisk
cd $WHISKDIR/ansible

$ANSIBLE_CMD wipe.yml
$ANSIBLE_CMD openwhisk.yml  -e '{"openwhisk_cli":{"installation_mode":"remote","remote":{"name":"OpenWhisk_CLI","dest_name":"OpenWhisk_CLI","location":"https://github.com/apache/incubator-openwhisk-cli/releases/download/latest"}}}'
$ANSIBLE_CMD postdeploy.yml

cd $WHISKDIR
cat whisk.properties

APIHOST=$(cat $WHISKDIR/whisk.properties | grep edge.host= | sed s/edge\.host=//)
#key=$(cat $WHISKDIR/ansible/files/auth.guest)

echo "APIHOST=$APIHOST" > ~/.wskprops
echo "INSECURE_SSL=true" >> ~/.wskprops

# wait for "initialize test docker image" to complete
wait
