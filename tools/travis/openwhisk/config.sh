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

TEST_ORG=${TEST_ORG-testorg}
SPACE=${TEST_SPACE_PREFIX-ns}_${PORT_OFFSET-0}

WHISK_USER=`uuidgen`
WHISK_USERb=`uuidgen`
WHISK_PASSWORD="007zO3xZCLrMN6v2BKK1dXYFpXlPkccOFqm12CdAsMgRU4VrNZ9lyGVCGuMDGIwP"
WHISK_AUTH="${WHISK_USER}:${WHISK_PASSWORD}"
WHISK_AUTHb="${WHISK_USERb}:${WHISK_PASSWORD}"

echo "    \"${TEST_ORG}_${SPACE}\" = \"${WHISK_AUTH}\"" >> /tmp/whisk.conf
echo "    \"${TEST_ORG}_${SPACE}b\" = \"${WHISK_AUTHb}\"" >> /tmp/whisk.conf

cat <<EOF >> /tmp/whisk.conf
  }
}
EOF

echo /tmp/whisk.conf
