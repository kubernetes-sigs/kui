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
import { KubeResource, hasAnnotations, lastAppliedAnnotationKey } from '@kui-shell/plugin-kubectl-core'

const strings = i18n('plugin-kubectl')

export function tryParse(value: any) {
  if (typeof value === 'object' || typeof value === 'number' || typeof value === 'boolean') {
    return value
  } else {
    try {
      return JSON.parse(value)
    } catch (err) {
      return value
    }
  }
}

async function content(_, resource: KubeResource) {
  // this module is expensive to load, so we defer that expense
  const { dump } = await import('js-yaml')

  return {
    contentType: 'yaml',
    content: dump(
      JSON.parse(
        JSON.stringify(resource.metadata.annotations, (key, value) =>
          key === lastAppliedAnnotationKey ? undefined : tryParse(value)
        )
      )
    )
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
