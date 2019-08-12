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

import * as Debug from 'debug'
import { safeDump } from 'js-yaml'

import { rexec as $, qexec as $$ } from '@kui-shell/core/core/repl'
import { SidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { Badge } from '@kui-shell/core/webapp/views/sidecar'
import { Table } from '@kui-shell/core/webapp/models/table'
import { EvaluatorArgs, ParsedOptions } from '@kui-shell/core/models/command'

import { FinalState } from '../model/states'
import {
  KubeStatus,
  DefaultKubeStatus,
  KubeMetadata,
  DefaultKubeMetadata,
  KubeResource,
  Resource
} from '../model/resource'

import { statusButton } from '../view/modes/status'
import { deleteResourceButton } from '../view/modes/crud'

import i18n from '@kui-shell/core/util/i18n'
const strings = i18n('plugin-k8s')

const debug = Debug('k8s/controller/summary')

/**
 * Render a describe summary
 *
 */
const renderDescribe = async (
  command: string,
  getCmd: string,
  summaryCmd: string,
  resource: KubeResource,
  summary: Record<string, string>,
  parsedOptions: ParsedOptions
) => {
  debug('renderDescribe', command, resource, summary)

  const metadata: KubeMetadata = resource.metadata || new DefaultKubeMetadata()
  const status: KubeStatus = resource.status || new DefaultKubeStatus()

  const output = parsedOptions.o || parsedOptions.output || 'yaml'

  const modes: SidecarMode[] = [
    {
      mode: 'summary',
      label: strings('summary'),
      defaultMode: true,
      direct: summaryCmd,
      execOptions: { delegationOk: true },
      leaveBottomStripeAlone: true
    }
  ]
  const yaml = resource
  {
    const command = 'kubectl'
    const resource: Resource = {
      kind: yaml.kind,
      name: yaml.metadata.name,
      resource: yaml
    }
    modes.push(statusButton(command, resource, FinalState.NotPendingLike))
  }
  modes.push({
    mode: 'raw',
    label: 'YAML',
    direct: `${getCmd} -o ${output}`,
    execOptions: { noDelegation: true },
    order: 999,
    leaveBottomStripeAlone: true
  })
  modes.push(deleteResourceButton())

  const badges: Badge[] = []
  badges.push(metadata && metadata.labels && metadata.labels.app)

  // some resources have a notion of duration
  const startTime = resource && status && status.startTime && new Date(status.startTime)
  const endTime = resource && status && status.completionTime && new Date(status.completionTime)
  const duration = startTime && endTime && endTime.getTime() - startTime.getTime()

  const description = {
    type: 'custom',
    isEntity: true,
    duration,
    badges: badges.filter(x => x),
    createdOnString: resource.status && resource.status.startTime ? strings('startedOn') : strings('createdOn'),
    toolbarText: {
      type: 'info',
      text: strings('readonly')
    },
    resource,
    modes,
    contentType: output,
    content: output === 'json' ? summary : safeDump(summary).trim()
  }
  debug('description', description, resource)

  return description
}

/**
 * Turn a one-row Table into a Map
 *
 */
function toMap(table: Table): Record<string, string> {
  return table.body.reduce(
    (map, row) => {
      map[row.key] = row.name

      row.attributes.forEach(({ key, value }) => {
        map[key] = value
      })

      return map
    },
    {} as Record<string, string>
  )
}

/**
 * kubectl describe
 *
 */
const describe = async ({ command, parsedOptions, execOptions }: EvaluatorArgs) => {
  const noDelegationPlease = Object.assign({}, execOptions, { noDelegation: true })
  delete noDelegationPlease.delegationOk

  const getCmd = command.replace(/summary/, 'get').replace(/(-o|--output)[= ](yaml|json)/, '')
  const summaryCmd = command.replace(/get/, 'summary').replace(/(-o|--output)[= ](yaml|json)/, '')
  debug('summaryCmd', summaryCmd)
  debug('getCmd', getCmd)

  const [resource, summary] = await Promise.all([
    $(getCmd, noDelegationPlease) as Promise<KubeResource>,
    $$(`${getCmd} -o wide`, undefined, undefined, noDelegationPlease).then(toMap)
  ])
  debug('resource', resource)
  debug('summary', summary)

  return renderDescribe(command, getCmd, summaryCmd, resource, summary, parsedOptions)
}

export default describe
