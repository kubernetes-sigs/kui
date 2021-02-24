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

import Debug from 'debug'
const debug = Debug('plugin-kubectl/controller/cli')

/**
 * The kubectl cli we want to use for all kubectl commands. For example,
 * `kubectl = oc `;`${kubectl} get pods`
 *
 */
function _kubectl(): string {
  const _default = process.env.KUI_DEFAULT_KUBECTL || 'kubectl'

  try {
    const { defaultKubectl } = require('@kui-shell/client/config.d/exec.json')
    return defaultKubectl || _default
  } catch (err) {
    debug('Client did not define a default kubectl CLI, assuming default kubectl')
    return _default
  }
}

export default _kubectl()
