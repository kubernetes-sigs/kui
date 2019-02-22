/*
 * Copyright 2018 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('k8s/view/insert-view')

import { removeAllDomChildren } from '@kui-shell/core/webapp/util/dom'
import { getSidecar } from '@kui-shell/core/webapp/views/sidecar'

/**
 * Insert the given view into the sidecar
 *
 */
export default view => {
  debug('insertView', view)

  const sidecar = getSidecar()
  const activeView = sidecar.getAttribute('data-active-view')
  const container = sidecar.querySelector(`${activeView} .activation-content .activation-result`)
  debug('insertView.container', activeView, container)

  removeAllDomChildren(container)
  debug('insertView.container', container)
  container.appendChild(view)
}
