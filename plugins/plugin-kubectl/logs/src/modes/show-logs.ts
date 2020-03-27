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

import { i18n, Tab } from '@kui-shell/core'
import { KubeResource, isJob, isDeployment, isPod, getCommandFromArgs } from '@kui-shell/plugin-kubectl'

const strings = i18n('plugin-kubectl', 'logs')

/**
 * Drill down to deployment logs
 *
 */
function deploymentLogs(tab: Tab, resource: KubeResource, args: { argvNoOptions: string[] }) {
  return `${getCommandFromArgs(args)} logs deployment/${resource.metadata.name} -n ${
    resource.metadata.namespace
  } --all-containers --tail 20`
}

/**
 * Drill down to job logs
 *
 */
function jobLogs(tab: Tab, resource: KubeResource, args: { argvNoOptions: string[] }) {
  return `${getCommandFromArgs(args)} logs job/${resource.metadata.name} -n ${resource.metadata.namespace} --tail 20`
}

/**
 * Drill down to pod logs
 *
 */
function podLogs(tab: Tab, resource: KubeResource, args: { argvNoOptions: string[] }) {
  return `${getCommandFromArgs(args)} logs ${resource.metadata.name} -n ${
    resource.metadata.namespace
  } --all-containers --tail 20`
}

/**
 * @return whether the given resource has a logs
 *
 */
function hasLogs(resource: KubeResource): boolean {
  return isPod(resource) || isDeployment(resource) || isJob(resource)
}

/**
 * Log renderer
 *
 */
const renderLogs = (tab: Tab, resource: KubeResource, args: { argvNoOptions: string[] }) => {
  if (isDeployment(resource)) {
    return deploymentLogs(tab, resource, args)
  } else if (isPod(resource)) {
    return podLogs(tab, resource, args)
  } else if (isJob(resource)) {
    return jobLogs(tab, resource, args)
  } else {
    return ''
  }
}

/**
 * This is our mode model for the Last Applied tab.
 *
 */
export default {
  when: hasLogs,
  mode: {
    mode: 'logs',
    label: strings('Show Logs'),
    command: renderLogs,
    kind: 'drilldown' as const
  }
}
