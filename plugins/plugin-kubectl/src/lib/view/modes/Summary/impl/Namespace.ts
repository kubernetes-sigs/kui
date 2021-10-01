/*
 * Copyright 2020 The Kubernetes Authors
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
 * Name: default
 * Status: Active
 * Age: 562d
 *
 */
import Debug from 'debug'

import { REPL, Table, isTable } from '@kui-shell/core'

import { age } from './Generic'
import { Namespace } from '../../../../model/resource'
import { withKubeconfigFrom } from '../../../../../controller/kubectl/options'
import toMap from '../../table-to-map'
import toDescriptionList from './convert'

const debug = Debug('plugin-kubectl/view/modes/Summary')

export default async function NamespaceSummary(ns: Namespace, repl: REPL) {
  const { metadata, status } = ns
  const summary = {
    Name: metadata.name,
    Status: status.phase,
    Age: age(ns)
  }

  try {
    const quota = await repl.qexec<Table>(
      withKubeconfigFrom(ns.originatingCommand, `kubectl get quota -n ${ns.metadata.name}`)
    )

    if (isTable(quota) && quota.body.length >= 1) {
      const map = quota.body.map(row => toMap({ body: [row] }))
      Object.assign(summary, { quota: map })
    }
  } catch (err) {
    debug('no quota found')
  }

  return toDescriptionList(summary)
}
