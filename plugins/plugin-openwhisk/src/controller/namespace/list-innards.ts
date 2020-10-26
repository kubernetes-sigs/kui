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

import { Desc } from 'openwhisk'
import { Arguments, Registrar } from '@kui-shell/core'

import asTable from '../as-table'
import { asMetadata } from '../fqn'
import asNamespace from './as-namespace'
import standardOptions from '../aliases'
import { synonyms } from '../../models/synonyms'
import { apiVersion, Namespace } from '../../models/resource'
import { clientOptions, getClient } from '../../client/get'

/** List actions or feeds in a namespace */
const doList = (
  kind: 'Action' | 'Package' | 'Rule' | 'Trigger',
  cmd: string,
  project: (ns: Namespace) => Desc[]
) => async ({ tab, argvNoOptions, execOptions }: Arguments) => {
  const name = argvNoOptions[argvNoOptions.indexOf(cmd) + 1]

  const ns = asNamespace(
    name,
    await getClient(execOptions).namespaces.get(Object.assign({ namespace: name }, clientOptions))
  )

  return asTable(
    tab,
    project(ns).map(_ => ({
      apiVersion,
      kind,
      metadata: asMetadata(_.name, ns.metadata.namespace, ns.metadata.name)
    }))
  )
}

/** List actions in a namespace */
export function namespaceListActions(registrar: Registrar) {
  synonyms('namespaces').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/list-actions`,
      doList('Action', 'list-actions', (ns: Namespace) => ns.actions),
      standardOptions
    )
  })
}

/** List packages in a namespace */
export function namespaceListPackages(registrar: Registrar) {
  synonyms('namespaces').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/list-packages`,
      doList('Package', 'list-packages', (ns: Namespace) => ns.packages),
      standardOptions
    )
  })
}

/** List rules in a namespace */
export function namespaceListRules(registrar: Registrar) {
  synonyms('namespaces').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/list-rules`,
      doList('Rule', 'list-rules', (ns: Namespace) => ns.rules),
      standardOptions
    )
  })
}

/** List triggers in a namespace */
export function namespaceListTriggers(registrar: Registrar) {
  synonyms('namespaces').forEach(syn => {
    registrar.listen(
      `/wsk/${syn}/list-triggers`,
      doList('Trigger', 'list-triggers', (ns: Namespace) => ns.triggers),
      standardOptions
    )
  })
}
