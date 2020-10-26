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

import { ActivationDesc, Dict } from 'openwhisk'
import { Tab, Arguments, Registrar } from '@kui-shell/core'

import ok from '../ok'
import { fqn } from '../fqn'
import toDict from '../dict'
import standardOptions from '../aliases'
import { kvOptions } from '../key-value'
import { clientOptions, getClient } from '../../client/get'
import { synonyms } from '../../models/synonyms'
import { currentSelection } from '../../models/selection'
import { current as currentNamespace } from '../../models/namespace'

async function asyncOk(tab: Tab, name: string, response: ActivationDesc) {
  const nameParts = name.split(/\//)
  const isAbsolute = name.charAt(0) === '/'
  const ns = isAbsolute && nameParts[1]
  const restIndex = isAbsolute ? 2 : 0 // '/a/b/c' => ['', 'a', 'b', 'c'], rest starts at 2
  const nsForDisplay = !ns || ns === (await currentNamespace(tab)) ? '' : `/${ns}/`
  const prettyName = `${nsForDisplay}${nameParts.slice(restIndex).join('/')}`

  const suffix = document.createElement('span')
  suffix.appendChild(document.createTextNode(`invoked ${prettyName} with id `))

  const clickable = document.createElement('span') as HTMLElement
  clickable.className = 'clickable clickable-blatant activationId'
  clickable.innerText = response.activationId
  clickable.onclick = () => {
    const fetch = async (iter: number) => {
      return tab.REPL.pexec(`await ${response.activationId}`).catch(err => {
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

  return ok(suffix)
}

/**
 * Invoke an action
 *
 */
async function asyncAction<T extends Dict>({ argv, execOptions, tab }: Arguments): Promise<HTMLElement> {
  const { kv, argvNoOptions, nameIdx } = kvOptions(argv, 'async')
  const name = argvNoOptions[nameIdx] || fqn(currentSelection(tab))

  return asyncOk(
    tab,
    name,
    await getClient(execOptions).actions.invoke<Dict, T>(
      Object.assign(
        {
          name,
          blocking: false,
          params: toDict(kv.parameters)
        },
        clientOptions
      )
    )
  )
}

export default (registrar: Registrar) => {
  synonyms('actions').forEach(syn => {
    registrar.listen(`/wsk/${syn}/async`, asyncAction, standardOptions)
  })
}
