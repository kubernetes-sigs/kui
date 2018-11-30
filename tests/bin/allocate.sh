SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../.."

if [ -z "$WHISKDIR" ]; then
    WHISKDIR="$ROOTDIR/openwhisk"
fi

if [ ! -d "$WHISKDIR" ]; then
    echo "Please set $WHISKDIR"
    exit 1
fi

export WHISKDIR
echo "Found WHISKDIR=$WHISKDIR"


#
# get an openwhisk key
#
# @param $1 the 
#
# prefix of the namespace
function allocateHelper {
    PREFIX=$1
    SUFFIX=$2

    USER="${TEST_ORG}_user"
    SPACE="${PREFIX}${SUFFIX}"
    NAMESPACE="${TEST_ORG}_${SPACE}"

    # fetch openwhisk keys for the new space
    echo "Getting auth key for namespace $SPACE"
    AUTH=`"$WHISKDIR/bin/wskadmin" user create "${USER}" -ns "${NAMESPACE}"`

    if [ $? != 0 ]; then
        echo "Failed to allocate OpenWhisk creds"
        "$WHISKDIR/bin/wskadmin" user create "${USER}" -ns "${NAMESPACE}"
        exit 1
    fi

    cp ~/.wskprops-template ~/.wskprops
    echo "AUTH=$AUTH" >> ~/.wskprops
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
