/*
 * Copyright 2018-19 IBM Corporation
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

import { Tab } from '@kui-shell/core/webapp/cli'
import repl = require('@kui-shell/core/core/repl')

import { KubeResource } from '../../model/resource'

/** makeButton is passed a subset of SidecarMode */
interface BaseInfo {
  mode: string
  label?: string
  fontawesome?: string
  balloon?: string
}

type Renderer = (resource: KubeResource) => KubeResource

interface Parameters {
  overrides: BaseInfo
  fn: Renderer
}
export const renderButton = async (tab: Tab, { overrides, fn }: Parameters, args): Promise<KubeResource> => {
  const resource = args.resource || args
  const { prettyType, kind = prettyType || '-f', metadata, name, resourceName, namespace: ns } = resource

  const namespace = (metadata && metadata.namespace) || ns
  const commandToExec = `kubectl ${overrides.mode} ${kind} ${resourceName || name || (metadata && metadata.name)} ${
    namespace ? '-n ' + namespace : ''
  }`
  const response: KubeResource = await repl.qexec(`confirm '${commandToExec}'`, undefined, undefined, {
    noStatus: !!fn,
    tab
  })
  return fn ? fn(response) : response
}

const makeButton = (overrides: BaseInfo, fn?: Renderer) =>
  Object.assign(
    {},
    {
      direct: {
        plugin: 'k8s',
        module: 'lib/view/modes/button',
        operation: 'renderButton',
        parameters: { overrides, fn }
      },
      echo: true,
      noHistory: false,
      replSilence: false,
      balloonLength: 'medium',
      actAsButton: true,
      flush: 'right'
    },
    overrides
  )

export default makeButton
