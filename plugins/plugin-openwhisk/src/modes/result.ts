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

import { Dict } from 'openwhisk'
import { i18n } from '@kui-shell/core'
import { WithResponse, hasResponse } from '../models/resource'

const strings = i18n('plugin-openwhisk')

/**
 * The Response mode for activations
 *
 */
export default {
  when: hasResponse,
  mode: {
    mode: 'result',
    label: strings('Result'),

    content: async <T extends Dict>(_, resource: WithResponse<T>) => {
      const { safeDump } = await import('js-yaml')
      return {
        content: safeDump(resource.response.result),
        contentType: 'yaml'
      }
    }
  }
}
