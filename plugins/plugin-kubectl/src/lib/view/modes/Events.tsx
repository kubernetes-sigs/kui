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

import { i18n, BadgeRegistration, ParsedOptions, ModeRegistration } from '@kui-shell/core'

import cssForValue from '../css-for-value'
import { getCommandFromArgs } from '../../util/util'
import TrafficLight from '../../model/traffic-light'
import { withKubeconfigFrom } from '../../../controller/kubectl/options'
import { Event, isEvent, KubeResource, isCrudableKubeResource, isNamespaced } from '../../model/resource'

import '../../../../web/scss/components/Events.scss'

const strings = i18n('plugin-kubectl')

/**
 * @return whether the given resource might possibly have events;
 * since Events never have Events, we can exclude those always
 *
 */
function hasEvents(resource: KubeResource): boolean {
  return isCrudableKubeResource(resource) && !isEvent(resource) && isNamespaced(resource)
}

/**
 * Extract the events
 *
 */
function command(_, resource: KubeResource, args: { argvNoOptions: string[]; parsedOptions: ParsedOptions }) {
  // limit events to those intersecting with the giving resource
  const filter = `involvedObject.apiVersion=${resource.apiVersion},involvedObject.kind=${resource.kind},involvedObject.name=${resource.metadata.name},involvedObject.namespace=${resource.metadata.namespace},involvedObject.resourceVersion=${resource.metadata.resourceVersion}`

  // this is the command that will fetch the events table; we specify a watchable table
  const argv = [
    getCommandFromArgs(args),
    'get',
    'events',
    '--field-selector',
    filter,
    '-n',
    resource.metadata.namespace,
    '-w'
  ]

  return withKubeconfigFrom(args, argv.join(' '))
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
    label: strings('Show Events'),
    kind: 'drilldown',
    showRelatedResource: true,
    command
  }
}

export const eventsBadge: BadgeRegistration<Event> = {
  when: isEvent,
  badge: (event: Event) => {
    const cssFromReason = cssForValue[event.reason]
    return {
      title: cssFromReason ? event.reason : event.type,
      css:
        cssFromReason ||
        (event.type === 'Error' ? TrafficLight.Red : event.type === 'Warning' ? TrafficLight.Yellow : undefined)
    }
  }
}
