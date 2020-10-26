/*
 * Copyright 2017-19 IBM Corporation
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
 * This plugin introduces /wsk/list, which lists entities across all entity types.
 *
 */

import { Table, Arguments, Registrar } from '@kui-shell/core'

import { withStandardOptions } from '../usage'

/**
 * Usage model
 *
 */
const usage = withStandardOptions({
  command: 'list',
  strict: 'list',
  title: 'List all',
  header: 'List all deployed entities',
  example: `wsk list`
})

/**
 * List the entities of a given type
 *
 */
const list = ({ REPL }: Arguments) => (type: string) =>
  REPL.qexec<Table>(`wsk ${type} list`, undefined, undefined, { showHeader: true })

/**
 * @return a list of lists, one for each OpenWhisk data type
 */
const doList = (command: Arguments): Promise<Table[]> => {
  const types = ['actions', 'packages', 'triggers', 'rules']

  return Promise.all(types.map(list(command))).then(result => {
    return result.filter(_ => _.body.length > 0)
  })
}

/**
 * Here is the module, where we register command handlers
 *
 */
export default (registrar: Registrar) => {
  ;['list', 'ls'].forEach(list => {
    registrar.listen(`/wsk/${list}`, doList, usage)
  })
}
