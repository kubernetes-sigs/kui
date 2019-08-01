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

import { KubeResource } from '../model/resource'

import { Formatter } from '@kui-shell/core/webapp/views/sidecar'
import { prettyPrintTime } from '@kui-shell/core/webapp/util/time'

const debug = Debug('k8s/util/created-on')

/**
 * Format the creationTimestamp of the given resource
 * TODO refactor this somewhere else
 *
 * @param resource a kubernetes resource
 */
export default (resource: KubeResource): Formatter => {
  const startTime =
    resource &&
    ((resource.metadata && resource.metadata.creationTimestamp) || (resource.status && resource.status.startTime))
  if (startTime) {
    return {
      plugin: 'k8s',
      module: 'lib/util/created-on',
      operation: 'format',
      parameters: {
        resource
      }
    }
  }
}

interface Parameters {
  resource: KubeResource
}

/** format the creation time of a resource */
export const format = (parameters: Parameters): Element => {
  const { resource } = parameters

  const startTime = (resource.status && resource.status.startTime) || resource.metadata.creationTimestamp
  const prefixText = resource.status && resource.status.startTime ? 'Started on ' : 'Created on '

  const message = document.createElement('div')
  const datePart = document.createElement('span')

  message.appendChild(document.createTextNode(prefixText))
  message.appendChild(datePart)
  try {
    datePart.appendChild(prettyPrintTime(Date.parse(startTime)))
  } catch (err) {
    debug('error trying to parse this creationTimestamp', resource.metadata.creationTimestamp)
    console.error('error parsing creationTimestamp', err)
    datePart.innerText = resource.metadata.creationTimestamp
  }

  return message
}
