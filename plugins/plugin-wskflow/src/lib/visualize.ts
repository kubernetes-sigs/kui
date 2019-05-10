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
const debug = Debug('plugins/wskflow/visualize')
debug('loading')

import { isHeadless } from '@kui-shell/core/core/capabilities'

import injectCSS from './inject'

type GraphRenderer = (ir, containerElement, acts, options, rule) => Promise<void>

import fsm2graph from './fsm2graph'

/**
 * Create the wskflow visualization for the given fsm
 *
 */
export default async (passedFsm, container, w, h, activations, options, rule) => {
  if (isHeadless()) {
    return
  }

  debug('visualize', passedFsm, options, rule)

  injectCSS()

  // create a copy - all annotations make by wskflow will not affect the original object.
  const ir = JSON.parse(JSON.stringify(passedFsm))
  debug('passfsm', JSON.stringify(passedFsm))
  debug('ir', ir)

  const fsm2graph: GraphRenderer = (await import('./fsm2graph')).default
  return fsm2graph(ir, container, activations, options, rule)
}
