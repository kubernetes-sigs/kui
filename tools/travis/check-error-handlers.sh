#!/usr/bin/env bash

#
# Copyright 2021 The Kubernetes Authors
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

# see https://github.com/IBM/kui/issues/5608
if grep --include '*.ts' --color=never -r Common.oops plugins/*/src/test | grep --color=never await  | grep --color=never -v err | grep --color=never -v '.catch(Common.oops' ; then
    echo "BAD TESTS: Some test error handlers will not fail"
    exit 1
else
    exit 0
fi
