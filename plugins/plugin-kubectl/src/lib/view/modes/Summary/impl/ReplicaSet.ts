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
 * Name: kui-ui-7b946968df
 * Desired: '1'
 * Current: '1'
 * Ready: '1'
 * Age: 401d
 * Containers: 'proxy,client'
 * Images: 'kuishell/proxy,kuishell/webpack'
 * Selector: 'app=kui-ui,pod-template-hash=7b946968df'
 *
 */

import { age } from './Generic'
import { ReplicaSet } from '../../../../model/resource'
import toDescriptionList, { selectorToString } from './convert'

export default function ReplicaSetSummary(rs: ReplicaSet) {
  const { spec, status } = rs
  const {
    template: {
      spec: { containers }
    }
  } = spec

  return toDescriptionList({
    // Name: metadata.name,
    Desired: status.replicas,
    Current: status.availableReplicas,
    Ready: status.readyReplicas,
    Age: age(rs),
    Containers: containers.map(_ => _.name).join(', '),
    Images: containers.map(_ => _.image).join(', '),
    Selector: selectorToString(spec.selector)
  })
}
