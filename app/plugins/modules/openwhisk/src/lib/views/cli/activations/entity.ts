/*
 * Copyright 2017 IBM Corporation
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
const debug = Debug('plugins/openwhisk/views/cli/activations/entity')

import { ok } from '../../../../../../../../build/webapp/cli'
import { showEntity } from '../../../../../../../../build/webapp/views/sidecar'
import { pexec } from '../../../../../../../../build/core/repl'

import { current as currentNamespace } from '../../../models/namespace'

interface IActivationResponse {
  success: boolean
  result: Object
}

interface IEntity {
  name: string
}

interface IActivation {
  entity: IEntity
  activationId: string
  response: IActivationResponse
}

/**
 * Render an activation response in the CLI portion of the UI
 *
 */
export default (response: IActivation, resultDom: Element, parsedOptions: Object, execOptions: Object): void => {
  if (!response.response && response.activationId) {
    // probably non-blocking invoke
    // say "ok: invoked foo with id xxx"
    debug('rendering in cli as "ok:"', response)

    const suffix = document.createElement('span')
    const nameParts = response.entity.name.split(/\//)
    const isAbsolute = response.entity.name.charAt(0) === '/'
    const ns = isAbsolute && nameParts[1]
    const restIndex = isAbsolute ? 2 : 0 // '/a/b/c' => ['', 'a', 'b', 'c'], rest starts at 2
    const nsForDisplay = !ns || ns === currentNamespace() ? '' : `/${ns}/`
    const prettyName = `${nsForDisplay}${nameParts.slice(restIndex).join('/')}`

    suffix.appendChild(document.createTextNode(`: invoked ${prettyName} with id `))

    const clickable = document.createElement('span') as HTMLElement
    clickable.className = 'clickable activationId'
    clickable.innerText = response.activationId
    clickable.onclick = () => {
      const fetch = async (iter: number) => {
        return pexec(`await ${response.activationId}`)
          .catch(err => {
            if (iter < 10) {
              setTimeout(() => fetch(iter + 1), 500)
            } else {
              console.error(err)
            }
          })
      }

      fetch(0)
    }
    suffix.appendChild(clickable)

    ok(resultDom, suffix)
  } else {
    // blocking invoke, we have a response
    debug('rendering in sidecar')

    showEntity(response, execOptions)
    ok(resultDom)
  }
}
