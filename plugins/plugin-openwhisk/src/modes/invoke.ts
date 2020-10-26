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

import { encodeComponent, i18n } from '@kui-shell/core'

import { fqn } from '../controller/fqn'
import { Invokeable, isInvokeable, isActivation } from '../models/resource'

const strings = i18n('plugin-openwhisk')

/**
 * Invoke an invokeable resource
 *
 */
export default {
  when: isInvokeable,
  mode: {
    mode: 'invoke',
    label: strings('Invoke'),
    kind: 'drilldown' as const,

    command: (_, resource: Invokeable) => {
      if (isActivation(resource)) {
        const path = `/${resource.annotations.find(_ => _.key === 'path').value}`
        return `wsk action invoke ${encodeComponent(path)}`
      } else {
        return `wsk ${resource.kind.toLowerCase()} invoke ${encodeComponent(fqn(resource))}`
      }
    }
  }
}
