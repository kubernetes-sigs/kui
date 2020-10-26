#!/usr/bin/env bash

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
