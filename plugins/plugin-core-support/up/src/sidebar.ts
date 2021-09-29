/*
 * Copyright 2021 The Kubernetes Authors
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

import { StatusModelSection } from '@kui-shell/core'

import Group from './Group'
import Provider from './Provider'

import doCheck from './ui'
import { getUppers } from './registrar'
import { CheckerArgs } from './Checker'

interface Filter {
  all?: boolean
  groups?: Group[]
  providers?: Provider[]
  services?: string[]
}

export default function getUppersAsStatusModel(args: CheckerArgs, filter?: Filter): StatusModelSection[] {
  /* if (filter && filter.providers) {
    filter.providers.forEach(provider => {
      parsedOptions[Provider[provider].toLowerCase()] = true
    })
  }

  if (filter && filter.groups) {
    filter.groups.forEach(group => {
      parsedOptions[Group[group].toLowerCase()] = true
    })
  } */

  return getUppers({ parsedOptions: { all: true } })
    .filter(({ group, service }) => {
      return (
        filter.all ||
        (filter.groups && filter.groups.find(_ => _ === group) !== undefined) ||
        (filter.providers && filter.providers.find(_ => _ === service.provider) !== undefined) ||
        (filter.services && filter.services.find(_ => _ === service.label) !== undefined)
      )
    })
    .reduce((sections, upper) => {
      // primary grouping is by Provider         ---\\\\
      const section = sections.find(_ => _.title === Provider[upper.service.provider]) || {
        title: Provider[upper.service.provider],
        tiles: []
      }

      const tileTitle = upper.service.label
      const tileDescription = upper.service.description

      if (section.tiles.length === 0) {
        sections.push(section)
      }

      const tile = section.tiles.find(_ => _.title === tileTitle) || {
        title: tileTitle,
        description: tileDescription,
        items: [],

        // Fix action
        actions: [] /* [{
                      label: 'Fix it!',
                      isVisible: async (items: KuiSidebarItem[]) => (
                      // add a Fix action only if something needs fixing i.e. !== 'success'
                      upper.fix && await Promise.all(items.map(_ => typeof _.status === 'function' ? _.status() : _.status))
                      .then(_ => !!_.find(status => status !== 'success'))
                      ),
                      onClick: async (items: KuiSidebarItem[]) => {
                      doFix(args, undefined, upper, undefined)
                      return items
                      }
                      }] */
      }

      if (tile.items.length === 0) {
        section.tiles.push(tile)
      }

      tile.items.push({
        title: typeof upper.label === 'string' ? upper.label : upper.label(undefined),
        description: upper.description,
        status: async () => {
          try {
            const resp = await doCheck(args, undefined, upper, undefined)
            return resp.ok ? 'success' : 'error'
          } catch (err) {
            return 'error'
          }
        }
      })

      return sections
    }, [] as StatusModelSection[])
}
