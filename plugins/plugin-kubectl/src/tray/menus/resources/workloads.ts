/*
 * Copyright 2022 The Kubernetes Authors
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

import { CreateWindowFunction } from '@kui-shell/core'
import openWindowWith from './open'

export default function workloadsMenu(
  createWindow: CreateWindowFunction
): import('electron').MenuItemConstructorOptions {
  return {
    label: 'Workloads',
    submenu: [
      { label: 'Pods', click: openWindowWith(['kubectl', 'get', 'pods'], createWindow) },
      { label: 'Deployments', click: openWindowWith(['kubectl', 'get', 'deployments'], createWindow) },
      { label: 'DeploymentConfigs', click: openWindowWith(['kubectl', 'get', 'deploymentconfigs'], createWindow) },
      { label: 'StatefulSets', click: openWindowWith(['kubectl', 'get', 'statefulsets'], createWindow) },
      { label: 'Secrets', click: openWindowWith(['kubectl', 'get', 'secrets'], createWindow) },
      { label: 'ConfigMaps', click: openWindowWith(['kubectl', 'get', 'configmaps'], createWindow) },
      { type: 'separator' },
      { label: 'CronJobs', click: openWindowWith(['kubectl', 'get', 'cronjobs'], createWindow) },
      { label: 'Jobs', click: openWindowWith(['kubectl', 'get', 'jobs'], createWindow) },
      { label: 'DaemonSets', click: openWindowWith(['kubectl', 'get', 'daemonsets'], createWindow) },
      { label: 'ReplicaSets', click: openWindowWith(['kubectl', 'get', 'replicasets'], createWindow) },
      {
        label: 'ReplicationControllers',
        click: openWindowWith(['kubectl', 'get', 'replicationcontrollers'], createWindow)
      },
      { label: 'HorizontalPodAutoscalers', click: openWindowWith(['kubectl', 'get', 'hpa'], createWindow) }
    ]
  }
}
