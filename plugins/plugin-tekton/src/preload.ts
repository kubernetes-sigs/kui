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

import * as Debug from 'debug'
const debug = Debug('plugins/tekton/preload')
debug('loading')

import { dirname, join } from 'path'

import { isHeadless } from '@kui-shell/core/core/capabilities'
import { addPath } from '@kui-shell/core/core/find-file'
import { ModeRegistration, registerSidecarMode, SidecarModeFilter } from '@kui-shell/core/webapp/views/registrar/modes'

import { KubeResource } from '@kui-shell/plugin-k8s'

import { isPipeline, isPipelineRun, isTask } from './model/resource'

/** this is the SidecarMode model for the tekton run view */
// import runMode from './model/modes/run'

/**
 * A sidecar mode relevancy filter
 *
 */
function either(...filters: SidecarModeFilter<KubeResource>[]): SidecarModeFilter<KubeResource> {
  return (resource: KubeResource) => filters.some(filter => filter(resource))
}

async function registerModes() {
  const [flowMode, traceMode, logsMode] = await Promise.all([
    import('./model/modes/flow'), // SidecarMode for the tekton flow view
    import('./model/modes/trace'), // SidecarMode for the tekton trace view
    import('./model/modes/logs') // SidecarMode for the tekton pipelinerun logs view
  ])

  /** sidecar mode for tekton Flow view */
  const flowSpec: ModeRegistration<KubeResource> = {
    mode: flowMode.default,
    when: either(isPipeline, isPipelineRun, isTask)
  }

  /** sidecar mode for tekton Flow view */
  /* const runSpec = {
     mode: runMode.default,
     when: either(isPipelineRun, isTaskRun)
     } */

  /** sidecar mode for tekton Flow view */
  const traceSpec = {
    mode: traceMode.default,
    when: isPipelineRun
  }

  /** sidecar mode for tekton Flow view */
  const logsSpec = {
    mode: logsMode.default,
    when: isPipelineRun
  }

  // registerSidecarMode(runSpec)
  return Promise.all([registerSidecarMode(flowSpec), registerSidecarMode(traceSpec), registerSidecarMode(logsSpec)])
}

/** on preload, register our sidecar modes */
export default () => {
  // register a "special path" that resolves
  const specialPath = join(dirname(require.resolve('@kui-shell/plugin-tekton/package.json')), 'samples/@demos')
  addPath(specialPath, { prefix: '@demos/tekton', command: 'tekton flow' })

  if (!isHeadless()) {
    return registerModes()
  }
}

debug('finished loading')
