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

import { Arguments, Registrar } from '@kui-shell/core'

import asTable from '../as-table'
import { asMetadata } from '../fqn'
import asPackage from './as-package'
import standardOptions from '../aliases'
import { synonyms } from '../../models/synonyms'
import { apiVersion, Package, FQN } from '../../models/resource'
import { clientOptions, getClient } from '../../client/get'

/** List actions or feeds in a package */
const doList = (cmd: string, project: (pack: Package) => FQN[]) => async ({
  tab,
  argvNoOptions,
  execOptions
}: Arguments) => {
  const name = argvNoOptions[argvNoOptions.indexOf(cmd) + 1]

  const pack = asPackage(
    await getClient(execOptions).packages.get(
      Object.assign(
        {
          name
        },
        clientOptions
      )
    )
  )

  return asTable(
    tab,
    project(pack).map(_ => ({
      apiVersion,
      kind: 'Action',
      metadata: asMetadata(_.name, pack.metadata.namespace, pack.metadata.name)
    }))
  )
}

/** List actions in a package */
export function packageListActions(registrar: Registrar) {
  synonyms('packages').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/list-actions`,
      doList('list-actions', (pack: Package) => pack.actions),
      standardOptions
    )
  })
}

/** List feeds in a package */
export function packageListFeeds(registrar: Registrar) {
  synonyms('packages').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/list-feeds`,
      doList('list-feeds', (pack: Package) => pack.feeds),
      standardOptions
    )
  })
}
