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

import { Tab, isHeadless, PreloadRegistration, PreloadRegistrar, isTable, Table, REPL } from '@kui-shell/core'

const registration: PreloadRegistration = async (registrar: PreloadRegistrar) => {
  if (!isHeadless()) {
    registrar.registerComponent<Table>({
      when: isTable,
      render: (entity: Table, tab: Tab, repl: REPL) => {
        return import(/* webpackMode: "lazy" */ './view/render').then(_ => _.default(entity, tab, repl))
      },
      priority: 10
    })
  }
}

export default registration
