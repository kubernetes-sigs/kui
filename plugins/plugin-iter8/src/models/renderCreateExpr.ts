/*
 * Copyright 2020 The Kubernetes Authors
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
import { KubeResource } from '@kui-shell/plugin-kubectl'

import { renderForm, renderDecisionTab } from '../modes/render'

// Checks the correct command response
function verifyResponse(resource: KubeResource): boolean {
  return resource.kind === 'Command' && resource.metadata.name === 'Experiment Creation'
}

// Model for Experiment Creation Form
const exprcreateMode: ModeRegistration<KubeResource> = {
  when: verifyResponse,
  mode: {
    mode: 'Experiment Setup',
    content: renderForm
  }
}
// Model for Decision Tab View
const decisionMode: ModeRegistration<KubeResource> = {
  when: verifyResponse,
  mode: {
    mode: 'Decision',
    content: renderDecisionTab
  }
}

export { exprcreateMode, decisionMode }
