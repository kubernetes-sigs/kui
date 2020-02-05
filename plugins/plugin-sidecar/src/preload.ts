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

import {
  isPopup,
  Tab,
  isHeadless,
  PreloadRegistration,
  PreloadRegistrar,
  isMultiModalResponse,
  MultiModalResponse,
  REPL,
  KResponse
} from '@kui-shell/core'

const registration: PreloadRegistration = async (registrar: PreloadRegistrar) => {
  if (!isHeadless()) {
    registrar.registerComponent({
      when: isMultiModalResponse,
      render: (entity: MultiModalResponse, tab: Tab, repl: REPL) => {
        return import(/* webpackMode: "lazy" */ './view/mmr').then(_ => _.default(entity, tab, repl))
      }
    })

    if (isPopup()) {
      registrar.registerComponent({
        when: () => {
          // does the command handler want to be incognito in the UI?
          // const incognitoHint = evaluator && evaluator.options && evaluator.options.incognito && evaluator.options.incognito
          // const incognito = incognitoHint && isPopup() && incognitoHint.indexOf('popup') >= 0
          return true
        },
        render: (entity: KResponse, tab: Tab, repl: REPL, command?: string) => {
          return import(/* webpackMode: "lazy" */ './view/popup').then(_ => _.default(entity, tab, repl, command))
        },
        priority: 999
      })
    }
  }
}

export default registration
