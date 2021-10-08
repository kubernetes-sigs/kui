/*
 * Copyright 2020 The Kubernetes Authors
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

import { StatusModel, Registrar, ParsedOptions } from '@kui-shell/core'

import Group from './Group'
import Provider from './Provider'
import getUppersAsStatusModel from './sidebar'

interface Options extends ParsedOptions {
  all?: boolean
  provider?: string | string[]
  group?: string | string[]
  service?: string | string[]
}

function toProviders(providers: string[]): Provider[] {
  const provs = providers.map(_ => Provider[_])

  const invalidIdx = provs.findIndex(_ => _ === undefined)
  if (invalidIdx >= 0) {
    throw new Error(`Invalid Provider option ${providers[invalidIdx]}`)
  } else {
    return provs
  }
}

function toGroups(groups: string[]): Group[] {
  const grps = groups.map(_ => Group[_])

  const invalidIdx = grps.findIndex(_ => _ === undefined)
  if (invalidIdx >= 0) {
    throw new Error(`Invalid Group option ${groups[invalidIdx]}`)
  } else {
    return grps
  }
}

/**
 * This plugin introduces the /prereqs command
 *
 */
export default async (commandTree: Registrar) => {
  commandTree.listen<StatusModel, Options>(
    '/prereqs',
    ({ REPL, createErrorStream, createOutputStream, parsedOptions }) => {
      const filter = {
        all: parsedOptions.all,
        groups:
          parsedOptions.group !== undefined
            ? toGroups(Array.isArray(parsedOptions.group) ? parsedOptions.group : [parsedOptions.group])
            : undefined,
        providers:
          parsedOptions.provider !== undefined
            ? toProviders(Array.isArray(parsedOptions.provider) ? parsedOptions.provider : [parsedOptions.provider])
            : undefined,
        services:
          parsedOptions.service !== undefined
            ? Array.isArray(parsedOptions.service)
              ? parsedOptions.service
              : [parsedOptions.service]
            : undefined
      }

      const sidebarProps: StatusModel = {
        apiVersion: 'kui-shell/v1',
        kind: 'StatusModel',
        metadata: {
          name: 'Prerequisites'
        },
        spec: {
          sections: getUppersAsStatusModel({ REPL, createErrorStream, createOutputStream, parsedOptions }, filter)
        }
      }

      if (sidebarProps.spec.sections.length === 0) {
        throw new Error('No matching prerequisites')
      } else {
        return sidebarProps
      }
    },
    { needsUI: true, preferReExecute: true }
  )
}
