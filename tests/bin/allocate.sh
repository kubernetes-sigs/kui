#
# get an openwhisk key
#
# @param $1 the 
#
# prefix of the namespace
function allocateHelper {
    PREFIX=$1
    SUFFIX=$2

    SPACE="${PREFIX}${SUFFIX}"

    # create cf space
    if [ ! -f "$AUTHDIR/auth_$i$SUFFIX" ]; then
        echo "Creating namespace"
        bx cf create-space "$SPACE"
    fi

    # fetch openwhisk keys for the new space
    echo "Getting auth key for namespace $SPACE"
    rm -f "$AUTHDIR/auth_$i$SUFFIX" && \
        bx target --cf-api "$IBMCLOUD_API_ENDPOINT" -o "$TEST_ORG" -s "$SPACE" && \
        (bx wsk list | grep -v "Unable to authenticate")

    if [ $? != 0 ]; then
        echo "OpenWhisk creds not ready, yet. Retrying..."
        sleep 1
        allocateHelper $@
    fi
}
function allocate {
    mod=$((KEY % $NUM_OPENWHISK_AUTH_LAYERS))
    if [ $mod == 4 ]; then
        # passes/04/auth.js needs an AUTH2; runTest.sh picks this up via a "b" suffix
        echo "allocating an AUTH2 for $1"
        allocateHelper $1 b

        mv ~/.wskprops ~/.wskpropsb
    fi

    allocateHelper $1
}

allocate $1
