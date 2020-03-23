/*
 * Copyright 2020 IBM Corporation
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

import { i18n, Tab, ModeRegistration } from '@kui-shell/core'

import { Namespace, isNamespace } from '../../model/resource'
import { doSummarizeNamedNamespace } from '../../../controller/kubectl/get-namespaces'

const mode = 'resources'
const label = i18n('plugin-kubectl')(mode)

/**
 * The content renderer for the summary tab
 *
 */
function content(tab: Tab, resource: Namespace) {
  return doSummarizeNamedNamespace(tab, resource.metadata.name)
}

/**
 * This Summary mode applies to Namespace resources
 *
 */
const summaryMode: ModeRegistration<Namespace> = {
  when: isNamespace,
  mode: {
    mode,
    label,
    content
  }
}

export default summaryMode
