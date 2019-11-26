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

import * as marked from 'marked'

import { Tab } from '@kui-shell/core/api/ui-lite'
import { ModeRegistration } from '@kui-shell/core/api/registrars'
import { KubeResource } from '@kui-shell/plugin-k8s'

/**
 * e.g. ClusterServiceVersion
 *
 */
interface DescriptionBearer extends KubeResource {
  spec: {
    description: string
  }
}

function isDescriptionBearer(resource: KubeResource): resource is DescriptionBearer {
  const bearer = resource as DescriptionBearer
  return bearer !== undefined && bearer.spec !== undefined && bearer.spec.description !== undefined
}

function content(tab: Tab, resource: DescriptionBearer) {
  const container = document.createElement('div')
  container.innerHTML = marked(resource.spec.description)
  return container
}

/**
 * Show spec.customresourcedefinitions
 *
 */
export const descriptionMode: ModeRegistration<KubeResource> = {
  when: isDescriptionBearer,
  mode: {
    mode: 'Description',
    content
  }
}

export default descriptionMode
