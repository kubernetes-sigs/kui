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
const debug = Debug('k8s/view/modes/pods')

import { qexec as $$ } from '@kui-shell/core/core/repl'
import drilldown from '@kui-shell/core/webapp/picture-in-picture'
import { formatMultiListResult } from '@kui-shell/core/webapp/views/table'

import { selectorToString } from '../../util/selectors'

import IResource from '../../model/resource'
import { TrafficLight } from '../../model/states'

import insertView from '../insert-view'
import { getActiveView, formatTable } from '../formatMultiTable'

/** for drilldown back button */
const viewName = 'Pods'

/**
 * Add a Pods mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const addPods = (modes: Array<any>, command: string, resource: IResource) => {
  debug('addPods', resource)
  if (resource.yaml.spec && resource.yaml.spec.selector) {
    modes.push(podsButton(command, resource))
  }
}

/**
 * Return a sidecar mode button model that shows a pods table for the
 * given resource
 *
 */
export const podsButton = (command: string, resource: IResource, overrides?) => Object.assign({}, {
  mode: 'pods',
  direct: () => renderAndViewPods(command, resource)
}, overrides || {})

/**
 * Render the tabular pods view
 *
 */
export const renderAndViewPods = async (command: string, resource: IResource) => {
  debug('renderAndViewPods', command, resource)

  const { selector } = resource.yaml.spec

  if (!selector) {
    debug('no selector attribute for the given resource', resource)
  } else {
    const getPods = `kubectl get pods ${selectorToString(selector)} -n "${resource.yaml.metadata.namespace}"`
    debug('getPods', getPods)

    const tableModel = await $$(getPods)
    const tableView = formatTable(tableModel, { usePip: true, viewName })
    return insertView(tableView)
  }
}
