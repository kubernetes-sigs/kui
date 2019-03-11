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
const debug = Debug('k8s/util/created-on')
debug('loading')

import { IKubeResource } from '../model/resource'

import { prettyPrintTime } from '@kui-shell/core/webapp/util/time'

/**
 * Format the creationTimestamp of the given resource
 * TODO refactor this somewhere else
 *
 * @param resource a kubernetes resource
 */
export default (resource: IKubeResource): Element => {
  if (resource && resource.metadata && resource.metadata.creationTimestamp) {
    const message = document.createElement('div')
    const datePart = document.createElement('strong')

    message.appendChild(document.createTextNode('Created on '))
    message.appendChild(datePart)
    try {
      datePart.appendChild(prettyPrintTime(Date.parse(resource.metadata.creationTimestamp)))
    } catch (err) {
      debug('error trying to parse this creationTimestamp', resource.metadata.creationTimestamp)
      console.error('error parsing creationTimestamp', err)
      datePart.innerText = resource.metadata.creationTimestamp
    }

    return message
  }
}
