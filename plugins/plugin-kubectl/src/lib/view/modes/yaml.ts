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

import { ModeRegistration } from '@kui-shell/core'

import { WithRawData, hasRawData } from '../../model/resource'

/** Mode identifier */
export const mode = 'raw'

/** Mode label; intentionally no i18n */
export const label = 'YAML'

/** We want this to be placed as the last tab */
export const order = 999

async function content(_, resource: WithRawData) {
  // this module is expensive to load, so we defer that expense
  const { load, dump } = await import('js-yaml')

  // why not also not-show labels? k8s4/edit.ts has some tests; we
  // will need to update those tests if we want to remove labels from
  // the yaml tab
  return {
    contentType: 'yaml',
    content: dump(
      JSON.parse(
        JSON.stringify(load(resource.kuiRawData), (key, value) =>
          key === 'managedFields' ||
          key === 'annotations' ||
          key === 'containers' ||
          key === 'containerStatuses' /* || key === 'labels' */
            ? undefined
            : value
        )
      )
    )
  }
}

/**
 * The YAML mode applies to all KubeResources, and simply extracts the
 * raw `data` field from the resource; note how we indicate that this
 * raw data has a yaml content type.
 *
 */
const yamlMode: ModeRegistration<WithRawData> = {
  when: hasRawData,
  mode: {
    mode,
    label,
    content,

    // traits:
    order
  }
}

export default yamlMode
