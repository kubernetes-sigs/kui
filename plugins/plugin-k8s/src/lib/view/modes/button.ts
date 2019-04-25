/*
 * Copyright 2018 IBM Corporation
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

import * as repl from '@kui-shell/core/core/repl'

const makeButton = (overrides, fn?) => Object.assign({}, {
  direct: async (args) => {
    const { prettyType: kind = '-f', name, resourceName = name, packageName, namespace = packageName } = args
    const response = await repl.pexec(`kubectl ${overrides.mode} ${kind} ${resourceName} ${namespace ? '-n ' + namespace : ''}`,
                                          { noStatus: !!fn })
    return fn ? fn(response) : response
  },
  echo: true,
  noHistory: false,
  replSilence: false,
  balloonLength: 'medium',
  actAsButton: true,
  flush: 'right'
}, overrides)

export default makeButton
