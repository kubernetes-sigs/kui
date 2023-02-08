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

/**
 * Last seen: 30s
 * Type: Warning
 * Reason: BackOff
 * Object: pod/kui-crashy
 * Subobject: 'spec.containers{crashy}'
 * Source: 'kubelet, 10.73.230.194'
 * Message: Back-off restarting failed container
 * First seen: 14d
 * Count: '91353'
 * Name: kui-crashy.165a76930800415d
 *
 */

import { i18n } from '@kui-shell/core'
import prettyPrintMillis from 'pretty-ms'
import { Event } from '@kui-shell/plugin-kubectl-core'

import toDescriptionList from './convert'

const strings = i18n('plugin-kubectl', 'events')

export default function EventSummary(event: Event) {
  const {
    involvedObject,
    source,
    reason: Reason,
    type: Type,
    message: Message,
    firstTimestamp,
    lastTimestamp,
    count: Count
  } = event

  return toDescriptionList({
    'Last seen': strings('ago', prettyPrintMillis(Date.now() - new Date(lastTimestamp).getTime())),
    Object: `${involvedObject.kind}/${involvedObject.name}`,
    Message,
    Type,
    Reason,
    Subobject: involvedObject.fieldPath,
    Source: `${source.component || ''}${source.host ? (source.component ? ', ' : '') + source.host : ''}`,
    'First seen': strings('ago', prettyPrintMillis(Date.now() - new Date(firstTimestamp).getTime())),
    Count
  })
}
