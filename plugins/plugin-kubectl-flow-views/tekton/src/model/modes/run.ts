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

import { Mode, Tab } from '@kui-shell/core'
import { isKubeResource } from '@kui-shell/plugin-kubectl'
import { ResponseObject } from './flow'

/**
 * The sidecar mode for the tekton flow visualization
 *
 */
const mode: Mode = {
  mode: 'Run Config',
  content: async (tab: Tab, _: ResponseObject) => {
    if (!isKubeResource(_)) {
      const { dump } = await import('js-yaml')

      // then _ is already the response we need
      const models = _.model.filter(_ => _.kind === 'PipelineRun' || _.kind === 'TaskRun')
      const model = models.length === 1 && models[0]
      return Object.assign(
        {
          type: 'custom',
          isEntity: true,
          contentType: 'yaml',
          resource: model || models,
          content: dump(model || models)
        },
        model || {}
      )
    }
  }
}

export default mode
