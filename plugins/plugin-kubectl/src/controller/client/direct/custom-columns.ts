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

import jsonpath from '@kui-shell/jsonpath'
import { Arguments, Row, Table, encodeComponent } from '@kui-shell/core'
import { KubeOptions, withKubeconfigFrom } from '../../kubectl/options'
import { TrafficLight, KubeStatusAny, KubeItems, isKubeItems, KubeResource } from '@kui-shell/plugin-kubectl-core'
import {
  computeDurations,
  cssForKey,
  cssForReadyCount,
  cssForValue,
  outerCSSForKey,
  rowKeyFor,
  tagForKey,
  tagsForKind
} from '../../../lib/view/formatTable'

type ParsedQuery = ReturnType<typeof jsonpath.parse>

/** map from column name to jsonpath */
type CustomColumns = { key: string; query: ParsedQuery }[]

/**
 * Interpret a custom-columns spec-as-string
 *
 */
function parse(spec: string): CustomColumns {
  const match = spec.match(/custom-columns=(.+)/)

  if (!match) {
    throw new Error('Invalid custom column specification' + spec)
  }

  return match[1]
    .split(/,/)
    .map(column => {
      const idx = column.indexOf(':')
      if (idx >= 0) {
        const key = column.slice(0, idx)
        const query = column.slice(idx + 1)
        if (key && query) {
          return {
            key,
            query: jsonpath.parse('$' + query.replace(/\.(\w+-\w+)/g, (_, p1) => `["${p1}"]`))
            // the jsonpath npm needs a leading "$", and does not handle -
            // see https://github.com/dchester/jsonpath/issues/90
          }
        }
      }

      throw new Error('Invalid custom column: ' + column)
    })
    .filter(_ => _)
}

/**
 * Generate a table Row for the given resource, using the queries from
 * the given CustomColumns.
 *
 */
export function evaluate<S extends KubeStatusAny, R extends KubeResource<S>>(
  resource: R,
  args: Pick<Arguments<KubeOptions>, 'parsedOptions'>,
  drilldownCommand: string,
  kind: string,
  custo: CustomColumns
): Row {
  const attributes = custo.map(({ key, query }) => {
    const value = jsonpath.value(resource, query as any as string) // bad typing in @types/jsonpath

    return {
      key,
      value,
      tag: tagForKey[key] || (tagsForKind[kind] && tagsForKind[kind][key]),
      outerCSS: outerCSSForKey[key],
      css: [
        cssForKey[key],
        cssForValue[value],
        /Ready/i.test(key) ? cssForReadyCount(value) : '',
        /failed/i.test(value) ? TrafficLight.Red : ''
      ].join(' ')
    }
  })

  return {
    key: attributes[0].key,
    rowKey: rowKeyFor(resource.metadata, kind),
    name: attributes[0].value,
    attributes: attributes.slice(1),
    onclick: withKubeconfigFrom(
      args,
      `${drilldownCommand} get ${kind} ${encodeComponent(resource.metadata.name)} -o yaml -n ${
        resource.metadata.namespace
      }`
    )
  }
}

/** See ./watch.ts; it will send row updates here for parsing */
export function toKuiTableForUpdateFromCustomColumns(
  resource: KubeResource,
  args: Pick<Arguments<KubeOptions>, 'parsedOptions'>,
  drilldownCommand: string,
  kind: string,
  spec: string
): Pick<Table, 'header' | 'body'> {
  const custo = parse(spec)

  const header = {
    name: custo[0].key,
    attributes: custo.slice(1).map(_ => ({ key: _.key, value: _.key }))
  }

  const body = [evaluate(resource, args, drilldownCommand, kind, custo)]

  return computeDurations({
    header,
    body
  })
}

/** See ./get.ts; it will send full table (as KubeItems) here for parsing */
export function toKuiTableFromCustomColumns(
  list: KubeResource | KubeItems,
  args: Pick<Arguments<KubeOptions>, 'parsedOptions'>,
  drilldownCommand: string,
  kind: string,
  spec: string
): Table {
  const custo = parse(spec)

  const header = {
    name: custo[0].key,
    attributes: custo.slice(1).map(_ => ({ key: _.key, value: _.key }))
  }

  const body = isKubeItems(list)
    ? list.items.map(_ => evaluate(_, args, drilldownCommand, kind, custo))
    : [evaluate(list, args, drilldownCommand, kind, custo)]

  return computeDurations({
    header,
    body,
    resourceVersion: list.metadata.resourceVersion
  })
}

export default toKuiTableFromCustomColumns
