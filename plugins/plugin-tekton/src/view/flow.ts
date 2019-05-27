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
const debug = Debug('plugins/tekton/view/flow')

import { safeDump } from 'js-yaml'
import { basename, dirname } from 'path'

import { ITab } from '@kui-shell/core/webapp/cli'
import { ISidecarMode } from '@kui-shell/core/webapp/bottom-stripe'
import { Badge } from '@kui-shell/core/webapp/views/sidecar'
import Presentation from '@kui-shell/core/webapp/views/presentation'

import injectCSS from '@kui-shell/plugin-wskflow/lib/inject'
import { zoomToFitButtons } from '@kui-shell/plugin-wskflow/lib/util'

import flowMode from '../model/flowMode'
import tekton2graph from '../lib/tekton2graph'

/**
 * Format a repl response
 *
 */
export default async (tab: ITab, jsons: Record<string, any>[], raw: string = safeDump(jsons), filepath?: string) => {
  const [graph, graph2doms] = await Promise.all([
    tekton2graph(jsons, filepath), // generate the graph model
    import('@kui-shell/plugin-wskflow/lib/graph2doms'), // overlap that work with importing the graph renderer
    injectCSS() // and also with injecting the graph css
  ])
  debug('graph', graph)

  const content = document.createElement('div')
  content.classList.add('padding-content')
  content.style.flex = '1'
  content.style.display = 'flex'

  const { controller } = await graph2doms.default(tab, graph, content, undefined, {
    layoutOptions: {
      'elk.separateConnectedComponents': false,
      'elk.spacing.nodeNode': 10,
      'elk.padding': '[top=7.5,left=7.5,bottom=7.5,right=7.5]',
      hierarchyHandling: 'INCLUDE_CHILDREN' // since we have hierarhical edges, i.e. that cross-cut subgraphs
    }
  })
  debug('content', content)

  const tektonModes: ISidecarMode[] = [
    flowMode,
    {
      mode: 'Raw',
      leaveBottomStripeAlone: true,
      direct: {
        type: 'custom',
        isEntity: true,
        contentType: 'yaml',
        content: raw
      }
    }
  ]

  const badges: Badge[] = [ 'Tekton' ]
  if (jsons.find(_ => _.kind === 'PipelineRun' || _.kind === 'TaskRun')) {
    badges.push({
      title: 'Runnable',
      css: 'green-background'
    })
  } else {
    badges.push({
      title: 'Not Runnable',
      css: 'yellow-background'
    })
  }

  return {
    type: 'custom',
    isEntity: true,
    isFromFlowCommand: true,
    name: filepath ? basename(filepath) : jsons[0].metadata.name,
    packageName: filepath && dirname(filepath),
    prettyType: 'Pipeline',
    badges,
    presentation: Presentation.FixedSize,
    content,
    model: jsons,
    modes: tektonModes.concat(zoomToFitButtons(controller, { visibleWhenShowing: flowMode.mode }))
  }
}
