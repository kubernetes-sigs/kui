#!/usr/bin/env bash

#
# Copyright 2018-19 IBM Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

#
# Find plugin-hosted tests
#

SCRIPTDIR=$(cd $(dirname "$0") && pwd)

CROSS='\033[21m\033[31m\xE2\x9C\x98\033[0m' # red heavy ballot x
CHECK='\033[21m\033[32m\xE2\x9C\x93\033[0m' # green check
DASH='\033[21m\033[33m\xE2\x96\xA1\033[0m'  # yellow white square

# we will stash the compiled tests in tests/passes; here, we ensure
# that this directory path exists
if [ ! -d tests ]; then
    mkdir tests
    if [ ! -d tests/passes ]; then
        mkdir tests/passes
    fi
fi

if [ ! -d data ]; then
    mkdir data
fi
if [ ! -d lib ]; then
    mkdir lib
fi

if [ -d bin ]; then
    ROOTDIR=../..
else
    ROOTDIR=../../..
fi
TESTDIR="$SCRIPTDIR"/..

if [ ! -f $ROOTDIR/packages/tests/bin/corral.sh ]; then
    if [ -d ../../../node_modules/@kui-shell ]; then
        ROOTDIR=../../..
    else
        echo "Please execute this script from packages/tests"
        exit 1
    fi
fi

# remove previous work
rm -rf "$TESTDIR"/tests/passes/*
rm -rf "$TESTDIR"/data/*
rm -rf "$TESTDIR"/lib/*
if [ "$1" == "clean" ]; then
    exit
fi

# set up (or tear down) links
function scan {
    TESTS=$(find -L "$1" -maxdepth 2 -name tests)
    for test in $TESTS; do
        echo
        echo "Scanning $test"

        if [ -d "$test/data" ]; then
            echo "  - found test input data"

            for data in "$test"/data/*; do
                base=`basename $data`
                if [ ! -L "data/$base" ]; then
                    echo -e "    $CHECK linking data $base"
                    (cd data && ln -s "../$data" .)
                else
                    echo -e "    $DASH already linked data $base"
                fi
            done
        fi

        if [ -d "$test/lib" ]; then
            echo
            echo "  - found test library files"

            for lib in "$test"/lib/*; do
                base=`basename $lib`
                if [ ! -L "lib/$base" ]; then
                    echo -e "    $CHECK linking lib $base"
                    (cd lib && ln -s "../$lib" .)
                else
                    echo -e "    $DASH already linked lib $base"
                fi
            done
        fi
    done
}

for i in "$ROOTDIR"/packages "$ROOTDIR"/plugins "$ROOTDIR"/node_modules/@kui-shell/{core,plugin-*}; do
    scan $i
done

# scan for typescript core tests
function scanTest {
    if [ -d "$1" ]; then
        TESTS=$(find -L "$1" -maxdepth 3 -path '*/src/test')
        TESTS2=$(find -L "$1" -maxdepth 1 -name test)
        for test in $TESTS $TESTS2; do
            echo
            echo "  - found typescript tests $test"

            for pass in "$test"/*; do
                base=`basename $pass`
                if [ -n "$CLEAN" ]; then
                    echo -e "    $CROSS unlinking pass $base"
                    (cd tests/passes && rm -rf "$base")
                elif [ ! -L "tests/passes/$base" ]; then
                    echo -e "    $CHECK linking pass $base"
                    (cd tests/passes && ln -s "../../$pass" .)
                else
                    echo -e "    $DASH already linked pass $base"
                fi
            done
        done
    fi
}

for i in "$ROOTDIR"/build/packages "$ROOTDIR"/build/plugins "$ROOTDIR"/node_modules/@kui-shell/{core,plugin-*}; do
    scanTest $i
done
