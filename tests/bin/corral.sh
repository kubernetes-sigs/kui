#!/usr/bin/env bash

#
# Copyright 2018 IBM Corporation
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
           
# are we setting up links or tearing them down (a.k.a. clean)?
if [ "$1" == "clean" ]; then
    CLEAN=true
fi

if [ -d bin ]; then
    ROOTDIR=..
else
    ROOTDIR=../../
fi

if [ ! -f $ROOTDIR/tests/bin/corral.sh ]; then
    echo "Please execute this script from tests/bin"
    exit 1
fi

# scan for tests
TESTS=`find -L "$ROOTDIR/node_modules/@kui-plugin" -maxdepth 2 -name tests`

# set up (or tear down) links
for test in $TESTS; do
    echo
    echo "Scanning $test"

    if [ -d "$test/data" ]; then
        echo "  - found test input data"

        for data in "$test"/data/*; do
            base=`basename $data`
            if [ -n "$CLEAN" ]; then
                echo -e "    $CROSS unlinking data $base"
                (cd data && rm -f "$base")
            elif [ ! -L "data/$base" ]; then
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
            if [ -n "$CLEAN" ]; then
                echo -e "    $CROSS unlinking lib $base"
                (cd lib && rm -f "$base")
            elif [ ! -L "lib/$base" ]; then
                echo -e "    $CHECK linking lib $base"
                (cd lib && ln -s "../$lib" .)
            else
                echo -e "    $DASH already linked lib $base"
            fi
        done
    fi

    if [ -d "$test/tests/passes" ]; then
        echo
        echo "  - found javascript tests"

        for pass in "$test"/tests/passes/*; do
            base=`basename $pass`
            if [ -n "$CLEAN" ]; then
                echo -e "    $CROSS unlinking pass $base"
                (cd tests/passes && rm -f "$base")
            elif [ ! -L "tests/passes/$base" ]; then
                echo -e "    $CHECK linking pass $base"
                (cd tests/passes && ln -s "../../$pass" .)
            else
                echo -e "    $DASH already linked pass $base"
            fi
        done
    fi
done

# scan for typescript core tests
if [ -d "$ROOTDIR/build" ]; then
    TESTS=`find -L "$ROOTDIR/build" -maxdepth 3 -path '*/build/test'`
    for test in $TESTS; do
        echo
        echo "  - found typescript tests $test"

        for pass in "$test"/*; do
            base=`basename $pass`
            if [ -n "$CLEAN" ]; then
                echo -e "    $CROSS unlinking pass $base"
                (cd tests/passes && rm -f "$base")
            elif [ ! -L "tests/passes/$base" ]; then
                echo -e "    $CHECK linking pass $base"
                (cd tests/passes && ln -s "../../$pass" .)
            else
                echo -e "    $DASH already linked pass $base"
            fi
        done
    done
fi

# scan for typescript plugin tests
if [ -d "$ROOTDIR/build/@kui-plugin" ]; then
    TESTS=`find -L "$ROOTDIR/build/@kui-plugin" -maxdepth 3 -path '*/src/test'`
    for test in $TESTS; do
        echo
        echo "  - found typescript tests $test"

        for pass in "$test"/*; do
            base=`basename $pass`
            if [ -n "$CLEAN" ]; then
                echo -e "    $CROSS unlinking pass $base"
                (cd tests/passes && rm -f "$base")
            elif [ ! -L "tests/passes/$base" ]; then
                echo -e "    $CHECK linking pass $base"
                (cd tests/passes && ln -s "../../$pass" .)
            else
                echo -e "    $DASH already linked pass $base"
            fi
        done
    done
fi
