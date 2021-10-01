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
import { i18n, Arguments, ModeDeclaration, ModeRegistration, Tab, ToolbarProps } from '@kui-shell/core'

import mode from './logs-mode-id'
import { KubeOptions } from '../../../controller/kubectl/options'
import { Pod, isPod, Deployment, isDeployment, ReplicaSet, isReplicaSet } from '../../model/resource'

const Logs = React.lazy(() => import('./Logs'))

const strings = i18n('plugin-kubectl', 'logs')

/**
 * The content renderer for the summary tab
 *
 */
export async function content(tab: Tab, resource: Pod | Deployment | ReplicaSet, args: Arguments<KubeOptions>) {
  return {
    react: function LogsProvider(toolbarController: ToolbarProps) {
      return <Logs tab={tab} mode={mode} resource={resource} args={args} toolbarController={toolbarController} />
    }
  }
}

export const modeDecl: ModeDeclaration<Pod> = {
  mode,
  label: strings('Logs'),

  // hack workaround to defer loading of plugin-client-common; needs update to babel-plugin-ignore-html-and-css-imports
  // content: (tab: Tab, pod: Pod, args: Arguments<KubeOptions>) => import('./logs').then(_ => _.content(tab, pod, args))
  content
}

/**
 * The Summary mode applies to all KubeResources, and uses
 * `renderContent` to render the view.
 *
 */
const logsReg: ModeRegistration<Pod> = {
  when: _ => isPod(_) || isDeployment(_) || isReplicaSet(_),
  mode: modeDecl
}

export default logsReg
