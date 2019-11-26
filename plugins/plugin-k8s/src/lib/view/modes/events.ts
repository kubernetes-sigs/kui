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

import { Tab } from '@kui-shell/core/api/ui-lite'
import { ModeRegistration } from '@kui-shell/core/api/registrars'
import { i18n } from '@kui-shell/core/api/i18n'
import { Table, isTable } from '@kui-shell/core/api/table-models'

import { Resource, KubeResource, isKubeResource } from '../../model/resource'

const strings = i18n('plugin-k8s')

const debug = Debug('k8s/view/modes/events')

/**
 * Extract the events
 *
 */
async function getEvents(tab: Tab, resource: KubeResource): Promise<string | Table> {
  try {
    const cmdGetPodEvents = `kubectl get events --field-selector involvedObject.name=${resource.metadata.name},involvedObject.namespace=${resource.metadata.namespace} -n ${resource.metadata.namespace}`

    // mimic the events table shown in the 'kubectl describe' output
    const customColumns =
      'custom-columns=TYPE:type,REASON:reason,LAST SEEN:lastTimestamp,COUNT:count,FIRST SEEN:firstTimestamp,FROM:source.component,MESSAGE:message'

    const cmd = `${cmdGetPodEvents} -o "${customColumns}"`

    debug('getEvents', cmd)

    return tab.REPL.qexec<Table>(cmd).then(result => {
      // When using custom-columns, if a pod doesn't have any events,
      // we can't get the 'No resources found.' error from kubectl,
      // so we handle this error by checking whether the table has content
      if (isTable(result) && !result.body[0]) {
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

export const renderAndViewEvents = async (tab: Tab, resource: Resource) => {
  const events = await getEvents(tab, resource.resource)

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

/**
 * Add a Events mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const eventsMode: ModeRegistration<KubeResource> = {
  when: hasEvents,
  mode: {
    mode: 'events',
    label: strings('events'),
    content: renderAndViewEvents
  }
}
