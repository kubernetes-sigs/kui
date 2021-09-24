/*
 * Copyright 2021 The Kubernetes Authors
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

import { i18n, ModeRegistration } from '@kui-shell/core'
import { KubeResource, hasAnnotations } from '../../model/resource'

const strings = i18n('plugin-kubectl')

/**
 * Note: Presenting as a DescriptionList may work, if one of the
 * annotation values is not a scalar
 *
 */
function content(_, resource: KubeResource) {
  return {
    apiVersion: 'kui-shell/v1' as const,
    kind: 'DescriptionList' as const,
    spec: {
      groups: Object.keys(resource.metadata.annotations)
        .filter(
          term =>
            term !== 'kubectl.kubernetes.io/last-applied-configuration' &&
            resource.metadata.annotations[term].length > 0
        )
        .sort((a, b) => a.length - b.length)
        .map(term => ({
          term,
          description: resource.metadata.annotations[term]
        }))
    }
  }
}

/**
 * Add a Managed Fields sidecar tab
 *
 */
const mode: ModeRegistration<KubeResource> = {
  when: hasAnnotations,
  mode: {
    mode: 'annotations',
    label: strings('Annotations'),
    content
  }
}

export default mode
