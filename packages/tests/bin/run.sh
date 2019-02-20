#
# Copyright 2017 IBM Corporation
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

#!/usr/bin/env bash

#
# This script tries to orchestrate the parallel execution of the test
# layers in such a way as to minimize too much concurrent load on a
# poor little travis instance, and also load balance the runs to
# maximize parallel efficiency.
#
# Optionally, you can pass in a list of the layers you'd like to run.
#    NOTE: If you go this route, do not repeat a layer, e.g. attempt
#          to run layer 08 twice in parallel. This is not (yet) supported.
#
# Final note: This script assumes that the shell-test image has already been built.
#             Note how .travis.yml does this with a docker build command in install:
#

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../../"

cd "$SCRIPTDIR"
#START_TIME=$SECONDS               # remember when we started, so that we can report elapsed time

if [ "$#" -ne 0 ]; then
    ./runDocker.sh $@
else
    #./runDocker.sh 08 07 01 02 03 04 05        # these layers are shorter

    ./runDocker.sh 08 01 02 05        # these layers are shorter
    if [ $? != 0 ]; then exit 1; fi   # oops?

    ./runDocker.sh 07 03 04           # these layers are longer
    if [ $? != 0 ]; then exit 1; fi   # oops?
fi

# finally, report elapsed time
#ELAPSED_TIME=$(($SECONDS - $START_TIME))
#echo "Tests completed successfully in $(($ELAPSED_TIME/60)) min $(($ELAPSED_TIME%60)) sec"
