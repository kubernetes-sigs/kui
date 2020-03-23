/*
 * Copyright 2019 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Tab, i18n, encodeComponent } from '@kui-shell/core'
import { IBMCloudCluster, isIBMCloudClusterWithAvailableUpdates } from '../models/cluster'

const strings = i18n('plugin-ibmcloud/ks')

/**
 * Display resource version as a badge
 *
 */
export default {
  when: isIBMCloudClusterWithAvailableUpdates,
  mode: {
    mode: 'update',
    label: strings('Update Cluster'),
    command: (tab: Tab, cluster: IBMCloudCluster) =>
      `ibmcloud ks cluster update --cluster ${encodeComponent(cluster.metadata.name)} --kube-version ${encodeComponent(
        cluster.content.targetVersion
      )}`,
    confirm: true,
    kind: 'drilldown' as const
  }
}
