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

import { tryParse } from './Annotations'
import { KubeResource, hasLabels } from '../../model/resource'

const strings = i18n('plugin-kubectl')

async function content(_, resource: KubeResource) {
  // this module is expensive to load, so we defer that expense
  const { dump } = await import('js-yaml')

  return {
    contentType: 'yaml',
    content: dump(JSON.parse(JSON.stringify(resource.metadata.labels, (key, value) => tryParse(value))))
  }
}

/**
 * Add a Managed Fields sidecar tab
 *
 */
const mode: ModeRegistration<KubeResource> = {
  when: hasLabels,
  mode: {
    mode: 'labels',
    label: strings('Labels'),
    content
  }
}

export default mode
