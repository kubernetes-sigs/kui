/*
 * Copyright 2020 IBM Corporation
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

import { CommandHandler, KResponse, Registrar } from '@kui-shell/core'
import { KubeOptions } from '@kui-shell/plugin-kubectl'

import doListWith from './controller/generic/list'
import doGetWith, { registration as getReg } from './controller/generic/get'
import defaultOption from './controller/generic/option'

type Handler = CommandHandler<KResponse, KubeOptions>
type FlexHandler = string | Handler

const ces = ['code-engine', 'ce']

export default function bind(
  this: Registrar,
  provider: { Get?: FlexHandler; List?: FlexHandler; Run?: Handler },
  ...cmds: string[]
) {
  ces.forEach(ce => {
    if (provider.Get) {
      cmds.forEach(cmd =>
        this.listen(
          `/ibmcloud/${ce}/${cmd}/get`,
          typeof provider.Get === 'string' ? doGetWith.bind(provider.Get) : provider.Get,
          Object.assign({}, getReg, defaultOption)
        )
      )
    }

    if (provider.List) {
      cmds.forEach(cmd => this.listen(`/ibmcloud/${ce}/${cmd}/list`, doListWith.bind(provider.List), defaultOption))
    }

    if (provider.Run) {
      cmds.forEach(cmd => this.listen(`/ibmcloud/${ce}/${cmd}/run`, provider.Run, defaultOption))
    }
  })
}

export function bindGet(this: Registrar, handler: Handler, ...cmds: string[]) {
  cmds.forEach(cmd => {
    this.listen(`/k/get/${cmd}`, handler, getReg)
    this.listen(`/kubectl/get/${cmd}`, handler, getReg)
  })
}
