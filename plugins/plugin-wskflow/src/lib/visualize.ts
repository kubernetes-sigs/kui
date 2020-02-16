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

import Debug from 'debug'

import { isHeadless, Tab } from '@kui-shell/core'

import Response from './response'
import fsm2graph from './fsm2graph'
import { ASTNode, ComponentBearing } from './ast'

const debug = Debug('plugins/wskflow/visualize')

type GraphRenderer = (ir, containerElement, acts, options, rule) => Promise<void>

/**
 * Create the wskflow visualization for the given fsm
 *
 */
export default async (
  tab: Tab,
  passedFsm: ASTNode | ComponentBearing,
  container?: HTMLElement,
  w?: number,
  h?: number,
  activations?,
  options?,
  rule?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Response> => {
  if (isHeadless()) {
    return
  }

  debug('visualize', passedFsm, options, rule)

  // create a copy - all annotations make by wskflow will not affect the original object.
  const ir = JSON.parse(JSON.stringify(passedFsm))
  debug('passfsm', JSON.stringify(passedFsm))
  debug('ir', ir)

  // temporary hack until we port this to compnentry
  import('./inject').then(_ => _.default())

  return fsm2graph(tab, ir, container, activations, options, rule)
}
