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
 * Name: kui-ui
 * Ready: 1/1
 * Up-to-date: '1'
 * Available: '1'
 * Age: 401d
 * Containers: 'proxy,client'
 * Images: 'kuishell/proxy,kuishell/webpack'
 * Selector: app=kui-ui
 *
 */

import { age } from './Generic'
import { Deployment } from '../../../../model/resource'
import toDescriptionList, { selectorToString } from './convert'

function ready(deployment: Deployment) {
  const { readyReplicas, replicas } = deployment.status

  const numerator = readyReplicas || 0
  const denominator = replicas
  return `${numerator}/${denominator}`
}

export default function DeploymentSummary(deployment: Deployment) {
  const { spec, status } = deployment
  const {
    template: {
      spec: { containers }
    }
  } = spec

  return toDescriptionList({
    // Name: metadata.name,
    Ready: ready(deployment),
    'Up-to-date': status.readyReplicas || 0,
    Available: status.availableReplicas || 0,
    Age: age(deployment),
    Containers: containers.map(_ => _.name).join(', '),
    Images: containers.map(_ => _.image).join(', '),
    Selector: selectorToString(spec.selector)
  })
}
