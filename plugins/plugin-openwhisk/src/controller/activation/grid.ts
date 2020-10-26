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

import { Activation } from 'openwhisk'
import { Arguments, Registrar, Table, isTable } from '@kui-shell/core'

import { ListOptions } from '../options'
import { withStandardOptions } from '../usage'
import { synonyms } from '../../models/synonyms'

import { list as listUsage } from './usage'
import { doList, viewTransformer as listTransformer } from './list'

async function viewTransformer(
  args: Arguments<ListOptions>,
  activations: Error | Activation<Record<string, any>>[]
): Promise<Table> {
  const table = await listTransformer(args, activations, 'trace')

  if (isTable(table)) {
    return Object.assign({}, table, { defaultPresentation: 'grid', allowedPresentations: ['grid'] })
  } else {
    return table
  }
}

export default (registrar: Registrar) => {
  synonyms('activations').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/grid`,
      doList.bind(undefined, 'grid'),
      Object.assign(withStandardOptions(listUsage), { viewTransformer })
    )
  })
}
