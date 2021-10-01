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

import React from 'react'

import { Arguments, ModeRegistration, Tab, ToolbarProps } from '@kui-shell/core'

import { KubeOptions } from '../../../controller/kubectl/options'
import { KubeResource, Pod, isPod, Deployment, ReplicaSet } from '../../model/resource'

const Terminal = React.lazy(() => import('./Terminal'))

import '../../../../web/scss/components/Terminal/Terminal.scss'

/** id for the tab */
const mode = 'terminal'

/**
 * The content renderer for the summary tab
 *
 */
async function content(tab: Tab, resource: Pod | Deployment | ReplicaSet, args: Arguments<KubeOptions>) {
  return {
    react: function TerminalProvider(toolbarController: ToolbarProps) {
      return <Terminal tab={tab} mode={mode} resource={resource} args={args} toolbarController={toolbarController} />
    }
  }
}

/**
 * Add a Pods mode button to the given modes model, if called for by
 * the given resource.
 *
 */
export const terminalMode: ModeRegistration<KubeResource> = {
  when: (resource: KubeResource) => isPod(resource) && !resource.isSimulacrum,
  mode: {
    mode,
    label: 'Terminal',
    content
  }
}

export default terminalMode
