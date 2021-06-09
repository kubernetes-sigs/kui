/*
 * Copyright 2019 The Kubernetes Authors
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

import { i18n, Tab, ModeRegistration } from '@kui-shell/core'

import {
  KubeResource,
  isSummarizableKubeResource,
  isKubeResourceWithItsOwnSummary,
  isDeployment,
  isEvent,
  isJob,
  isNamespace,
  isNode,
  isPod,
  isReplicaSet,
  isSecret
} from '../../../model/resource'

import DeploymentSummary from './impl/Deployment'
import EventSummary from './impl/Event'
import GenericSummary from './impl/Generic'
import JobSummary from './impl/Job'
import NamespaceSummary from './impl/Namespace'
import NodeSummary from './impl/Node'
import PodSummary from './impl/Pod'
import ReplicaSetSummary from './impl/ReplicaSet'
import SecretSummary from './impl/Secret'

const strings = i18n('plugin-kubectl')

/**
 * The content renderer for the summary tab
 *
 */
async function renderSummary({ REPL }: Tab, resource: KubeResource) {
  if (isKubeResourceWithItsOwnSummary(resource)) {
    return resource.summary
  }

  try {
    const jsyaml = import('js-yaml')
    const map = isPod(resource)
      ? PodSummary(resource)
      : isDeployment(resource)
      ? DeploymentSummary(resource)
      : isEvent(resource)
      ? EventSummary(resource)
      : isReplicaSet(resource)
      ? ReplicaSetSummary(resource)
      : isNamespace(resource)
      ? NamespaceSummary(resource, REPL)
      : isNode(resource)
      ? NodeSummary(resource)
      : isJob(resource)
      ? JobSummary(resource)
      : isSecret(resource)
      ? SecretSummary(resource)
      : GenericSummary(resource, REPL)

    // our content is that map, rendered as yaml
    return {
      content: (await jsyaml).dump(await map),
      contentType: 'yaml'
    }
  } catch (err) {
    if (err.code === 404) {
      return strings('This resource has been deleted')
    } else {
      console.error(err)
      return {
        content: resource.kuiRawData,
        contentType: 'yaml'
      }
    }
  }
}

/**
 * The Summary mode applies to all KubeResources, and uses
 * `renderContent` to render the view.
 *
 */
const summaryMode: ModeRegistration<KubeResource> = {
  when: isSummarizableKubeResource,
  mode: {
    mode: 'summary',
    label: strings('summary'),

    content: renderSummary,

    // traits:
    defaultMode: true, // we'd like this to be the default selected tab
    order: -999 // we want this to be placed as the first tab
  }
}

export default summaryMode
