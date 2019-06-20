#!/usr/bin/env bash

set -e

# Build script for Travis

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../../.."

WHISKDIR="$ROOTDIR/openwhisk"
WHISKPORT=9953
WHISK_APIHOST=http://localhost:$WHISKPORT

KEY=$TRAVIS_JOB_NUMBER

echo "installing openwhisk"

mkdir "$WHISKDIR"
cd "$WHISKDIR"

# we will need a jdk to run openwhisk (no: travis comes with one by default)
# "$SCRIPTDIR"/jdk.sh &

# download the prebuilt openwhisk jar
curl -LO https://s3.us-south.cloud-object-storage.appdomain.cloud/openwhisk/openwhisk-standalone.jar &

# download the prebuilt openwhisk CLI
#curl -L https://github.com/apache/incubator-openwhisk-cli/releases/download/latest/OpenWhisk_CLI-latest-linux-amd64.tgz | tar zxf -
#chmod +x ./wsk

cat <<EOF > /tmp/whisk.conf
include classpath("standalone.conf")

whisk {
  metrics {
    kamon-enabled = false
    kamon-tags-enabled = false
    prometheus-enabled = false
  }

  config {
    whisk-api-host-name = "localhost"
    controller-instances = 1
    limits-actions-sequence-maxLength = 50
    limits-triggers-fires-perMinute = 60
    limits-actions-invokes-perMinute = 600
    limits-actions-invokes-concurrent = 30
  }

  users {
EOF

idx=1
for i in $LAYERS; do
    PORT_OFFSET=$idx
    SPACE=${TEST_SPACE_PREFIX-ns}${KEY}_${PORT_OFFSET}

    WHISK_USER=`uuidgen`
    WHISK_USERb=`uuidgen`
    WHISK_PASSWORD="007zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP"
    WHISK_AUTH="${WHISK_USER}:${WHISK_PASSWORD}"
    WHISK_AUTHb="${WHISK_USERb}:${WHISK_PASSWORD}"

    echo "    \"${TEST_ORG}_${SPACE}\" = \"${WHISK_AUTH}\"" >> /tmp/whisk.conf
    echo "    \"${TEST_ORG}_${SPACE}b\" = \"${WHISK_AUTHb}\"" >> /tmp/whisk.conf

    F=~/.wskprops_${KEY}_${PORT_OFFSET}
    echo "APIHOST=${WHISK_APIHOST}" > $F
    echo "AUTH=${WHISK_AUTH}" >> $F
    echo "INSECURE_SSL=true" >> $F
    echo "APIGW_ACCESS_TOKEN=true" >> $F
    echo "APIHOST=${WHISK_APIHOST}" >> $F

    F2=~/.wskpropsb_${KEY}_${PORT_OFFSET}
    echo "APIHOST=${WHISK_APIHOST}" > $F2
    echo "AUTH=${WHISK_AUTHb}" >> $F2
    echo "INSECURE_SSL=true" >> $F2
    echo "APIGW_ACCESS_TOKEN=true" >> $F2
    echo "APIHOST=${WHISK_APIHOST}" >> $F2

    # it doesn't matter which, but move at least one of the wskprops into ~/.wskprops
    cp $F ~/.wskprops

    idx=$((idx+1))
done

cat <<EOF >> /tmp/whisk.conf
  }
}
EOF

echo "here is our whisk.conf:"
cat /tmp/whisk.conf

# Configure runtimes
if [ -n "$NEEDS_OPENWHISK_JAVA8" ]; then
    if [ -n "$NEEDS_OPENWHISK_NODEJS8" ]; then
        export MANIFEST="$SCRIPTDIR/openwhisk-runtimes-with-java8-and-nodejs8.json"
    else
        export MANIFEST="$SCRIPTDIR/openwhisk-runtimes-with-java8.json"
    fi
elif [ -n "${NEEDS_OPENWHISK_NODEJS8}" ]; then
    export MANIFEST="$SCRIPTDIR/openwhisk-runtimes-with-nodejs8.json"
else
    export MANIFEST="$SCRIPTDIR/openwhisk-runtimes.json"
fi

wait

echo "Using this openwhisk manifest: $MANIFEST"

# launch openwhisk
java -Xmx3G -server -jar openwhisk-standalone.jar --port $WHISKPORT -c /tmp/whisk.conf -m $MANIFEST > /tmp/openwhisk.out 2> /tmp/openwhisk.err &

# wait for it to come up
echo -n "waiting for openwhisk to come up"
set +e
while true; do
    curl http://localhost:$WHISKPORT/ping
    if [ $? == 0 ]; then
        echo "openwhisk is ready for e-business"
        break
    else
        echo "still waiting for openwhisk to come up"
        sleep 1
    fi
done
set -e
echo " [SUCCESS]"

exit





# Prefetch docker images
docker pull openwhisk/controller &
docker pull openwhisk/invoker &
docker pull openwhisk/nodejs6action &
if [ -n "${NEEDS_OPENWHISK_JAVA8}" ]; then
    docker pull openwhisk/java8action &
fi
if [ -n "${NEEDS_OPENWHISK_NODEJS8}" ]; then
    docker pull openwhisk/action-nodejs-v8 &
fi

# Clone OpenWhisk
cd $ROOTDIR
git clone --depth=1 https://github.com/apache/incubator-openwhisk.git openwhisk

if [ `lsb_release  -r -s` == 16.04 ]; then
    echo "Special handling of openwhisk for xenial"
    chmod +x $WHISKDIR/tools/ubuntu-setup/*.sh
    $WHISKDIR/tools/ubuntu-setup/all.sh
    sudo pip install requests==2.18.1 --ignore-installed --force-reinstall
else
    # Install Ansible
    pip install --user ansible==2.5.2
fi

# Configure runtimes
if [ -n "$NEEDS_OPENWHISK_JAVA8" ]; then
    if [ -n "$NEEDS_OPENWHISK_NODEJS8" ]; then
        echo "using the java8+nodejs8 openwhisk configuration"
        cp "$SCRIPTDIR/openwhisk-runtimes-with-java8-and-nodejs8.json" "$WHISKDIR/ansible/files/runtimes.json"
    else
        echo "using the java8 openwhisk configuration"
        cp "$SCRIPTDIR/openwhisk-runtimes-with-java8.json" "$WHISKDIR/ansible/files/runtimes.json"
    fi
elif [ -n "${NEEDS_OPENWHISK_NODEJS8}" ]; then
    echo "using the nodejs8 openwhisk configuration"
    cp "$SCRIPTDIR/openwhisk-runtimes-with-nodejs8.json" "$WHISKDIR/ansible/files/runtimes.json"
else
    echo "using the default openwhisk configuration"
    cp "$SCRIPTDIR/openwhisk-runtimes.json" "$WHISKDIR/ansible/files/runtimes.json"
fi

# Deploy OpenWhisk
cd $WHISKDIR/ansible
ANSIBLE_CMD="ansible-playbook -i ${WHISKDIR}/ansible/environments/local -e docker_image_prefix=openwhisk"
$ANSIBLE_CMD setup.yml
$ANSIBLE_CMD prereq.yml
sudo sh -c "$ANSIBLE_CMD couchdb.yml"
$ANSIBLE_CMD initdb.yml
$ANSIBLE_CMD wipe.yml
$ANSIBLE_CMD openwhisk.yml -e cli_installation_mode=remote -e limit_invocations_per_minute=600 -e lean=true

$ANSIBLE_CMD properties.yml # NOTE: required to run before routemgmt.yml

if [ -n "${NEEDS_OPENWHISK_API_GATEWAY}" ]; then
    $ANSIBLE_CMD apigateway.yml

    set +e # don't fail fast here, because routemgmt needs to be retried
    $ANSIBLE_CMD routemgmt.yml
    if [ $? != 0 ]; then
        # sometimes this step fails; perhaps couchdb isn't ready yet?
        echo "routemgmt failed; retrying in 2 seconds"
        sleep 2
        $ANSIBLE_CMD routemgmt.yml
        if [ $? != 0 ]; then
            # sometimes this step fails; perhaps couchdb isn't ready yet?
            echo "routemgmt failed again; retrying in 20 seconds"
            sleep 20
            $ANSIBLE_CMD routemgmt.yml
            if [ $? != 0 ]; then exit $?; fi
        fi
    fi
fi

set -e

# Log configuration
docker images
docker ps
curl -s -k https://172.17.0.1 | jq .
curl -s -k https://172.17.0.1/api/v1 | jq .

# Setup CLI
WHISK_APIHOST=$(cat $WHISKDIR/whisk.properties | grep edge.host= | sed s/edge\.host=//)
# WHISK_AUTH=`cat ${WHISKDIR}/ansible/files/auth.guest`
WHISK_CLI="${WHISKDIR}/bin/wsk -i"

#${WHISK_CLI} property set --apihost ${WHISK_APIHOST} --auth ${WHISK_AUTH}
${WHISK_CLI} property set --apihost ${WHISK_APIHOST}
${WHISK_CLI} property get

echo "INSECURE_SSL=true" >> ~/.wskprops
echo "AUTH=$AUTH" >> ~/.wskprops
echo "APIGW_ACCESS_TOKEN=true" >> ~/.wskprops
cp ~/.wskprops ~/.wskprops-template
