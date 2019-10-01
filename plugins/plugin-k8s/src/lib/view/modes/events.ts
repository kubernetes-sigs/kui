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

import Debug from 'debug'

import { i18n, REPL, Tables, UI } from '@kui-shell/core'

import { Resource, KubeResource, isKubeResource } from '../../model/resource'

const strings = i18n('plugin-k8s')

const debug = Debug('k8s/view/modes/events')

/**
 * Extract the events
 *
 */
async function getEvents(resource: KubeResource): Promise<string | Tables.Table> {
  try {
    const cmdGetPodEvents = `kubectl get events --field-selector involvedObject.name=${resource.metadata.name},involvedObject.namespace=${resource.metadata.namespace} -n ${resource.metadata.namespace}`

    // mimic the events table shown in the 'kubectl describe' output
    const customColumns =
      'custom-columns=TYPE:type,REASON:reason,LAST SEEN:lastTimestamp,COUNT:count,FIRST SEEN:firstTimestamp,FROM:source.component,MESSAGE:message'

    const cmd = `${cmdGetPodEvents} -o "${customColumns}"`

    debug('getEvents', cmd)

    return REPL.qexec<Tables.Table>(cmd).then(result => {
      // When using custom-columns, if a pod doesn't have any events,
      // we can't get the 'No resources found.' error from kubectl,
      // so we handle this error by checking whether the table has content
      if (Tables.isTable(result) && !result.body[0]) {
        return strings('No resources found.')
      }

      return result
    })
  } catch (err) {
    return err.message
  }
}

/**
 * @return whether the given resource has events (and: Events don't
 * have Events!)
 *
 */
function hasEvents(resource: KubeResource): boolean {
  return isKubeResource(resource) && !(resource.apiVersion === 'v1' && resource.kind === 'Event')
}

/**
 * Add a Events mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const eventsMode: UI.ModeRegistration<KubeResource> = {
  when: hasEvents,
  mode: (command: string, resource: Resource): UI.Mode => {
    debug('events', resource)
    try {
      return {
        mode: 'events',
        label: strings('events'),
        leaveBottomStripeAlone: true,
        direct: {
          plugin: 'k8s/dist/index',
          operation: 'renderAndViewEvents',
          parameters: { command, resource }
        }
      }
    } catch (err) {
      debug('error rendering events mode', err)
    }
  }
}

interface Parameters {
  command: string
  resource: Resource
}

export const renderAndViewEvents = async (tab: UI.Tab, parameters: Parameters) => {
  const { command, resource } = parameters
  debug('renderAndViewEvents', command, resource)

  const events = await getEvents(resource.resource)

  if (typeof events === 'string') {
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    pre.appendChild(code)
    code.innerText = events
    return pre
  } else {
    return events
  }
}
