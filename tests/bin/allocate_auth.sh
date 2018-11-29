#!/usr/bin/env bash

# optional argument: allocate this idx
idx=$1

# number of namespaces to create
N=${N-32}

# prefix of the namespace
export PREFIX="${PREFIX-cloudshella}"

# travis org
export TRAVIS_ORG="${TRAVIS_ORG-composer}"
export TRAVIS_REPO="${TRAVIS_ORG}/cloudshell"

# keys will be stored here
export AUTHDIR="${AUTHDIR-my-auth}"
mkdir -p "$AUTHDIR"

# remember the current space, so we can switch back when we're done
ORG="`bx target | grep Org: | awk '{print $2}'`"
INITIAL_SPACE="`bx target | grep Space: | awk '{print $2}'`"

function stash {
    i=$3
    SUFFIX=$4
    travis env set APIGW_ACCESS_TOKEN_$i$SUFFIX $1 -r "$TRAVIS_REPO"
    travis env set AUTH_$i$SUFFIX $2 -r "$TRAVIS_REPO"
}

function allocate {
    i=$1
    SUFFIX=$2

    SPACE="$PREFIX$i$SUFFIX"

    # create cf space
    if [ ! -f "$AUTHDIR/auth_$i$SUFFIX" ]; then
        echo "Creating namespace"
        bx cf create-space "$SPACE"
    fi

    # fetch openwhisk keys for the new space
    echo "Getting auth key for namespace $SPACE"
    rm -f "$AUTHDIR/auth_$i$SUFFIX" && \
        bx target -s "$SPACE" && \
        (bx wsk list | grep -v "Unable to authenticate") && \
        cat ~/.wskprops > "$AUTHDIR/auth_$i$SUFFIX"

    if [ $? != 0 ]; then
        allocate $@
    else 
        . "$AUTHDIR/auth_$i$SUFFIX"
        echo "Stashing secrets for $SPACE in this travis repo: $TRAVIS_REPO"
        stash $APIGW_ACCESS_TOKEN $AUTH $i $SUFFIX &
    fi
}

function doit {
    i=$1

    allocate $i

    mod=$((i%8))
    if [ $mod == 4 ]; then
        # passes/04/auth.js needs an AUTH2; runTest.sh picks this up via a "b" suffix
        echo "allocating an AUTH2 for $i"
        allocate $i b
    fi
}

if [ -n "$idx" ]; then
    doit $idx
else
    for i in `seq 1 $N`; do
        doit $i
    done
fi

wait

# add org and space travis env vars
# -P means make these "public"; they aren't secrets, and can help
# with debugging logs
echo "Setting org $ORG and space prefix $PREFIX in this travis repo: $TRAVIS_REPO"
travis env set -P TEST_ORG "$ORG" -r "$TRAVIS_REPO"
travis env set -P TEST_SPACE_PREFIX "$PREFIX" -r "$TRAVIS_REPO"

# switch back to original space
echo "Switching back to initial space $INITIAL_SPACE"
bx target -s "$INITIAL_SPACE"

echo "ok"
