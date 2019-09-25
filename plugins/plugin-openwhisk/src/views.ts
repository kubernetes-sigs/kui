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

import { Capabilities, UI } from '@kui-shell/core'
import { ViewHandler, registerEntityView as registerCLIEntityView } from '@kui-shell/core/webapp/cli'
import { registerEntityView as registerSidecarEntityView } from '@kui-shell/core/webapp/views/sidecar'
import { ShowOptions } from '@kui-shell/core/webapp/views/show-options'
import { Entity } from '@kui-shell/core/models/entity'

export default () => {
  if (!Capabilities.isHeadless()) {
    registerCLIEntityView('activations', async (
      tab: UI.Tab,
      response: Entity,
      resultDom: Element,
      parsedOptions: Object, // eslint-disable-line @typescript-eslint/ban-types
      execOptions: Object // eslint-disable-line @typescript-eslint/ban-types
    ) => {
      const showActivation = (await import('./lib/views/cli/activations/entity')).default as ViewHandler
      return showActivation(tab, response, resultDom, parsedOptions, execOptions)
    })

    const doShow = async (
      tab: UI.Tab,
      entity: Object, // eslint-disable-line @typescript-eslint/ban-types
      sidecar: Element,
      options: ShowOptions
    ) => {
      const { showEntity } = await import('./lib/views/sidecar/entity')
      return showEntity(tab, entity, sidecar, options)
    }
    registerSidecarEntityView('actions', doShow)
    registerSidecarEntityView('activations', doShow)
    registerSidecarEntityView('packages', doShow)
    registerSidecarEntityView('rules', doShow)
    registerSidecarEntityView('triggers', doShow)
  }
}
