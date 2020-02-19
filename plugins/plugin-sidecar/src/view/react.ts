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

import { ReactElement } from 'react'
import { render as ReactDomRender } from 'react-dom'
import { Tab, REPL, MultiModalResponse, NavResponse } from '@kui-shell/core'

import hackForTests from './hacks'

/** `renderer`: turns a MultiModalResponse into a ReactElement */
export type Renderer = (tab: Tab, repl: REPL, response: NavResponse | MultiModalResponse) => ReactElement

/**
 * Format a sidecar view for the given `response`, using the given
 * `renderer`. This mostly invokes the renderer, then uses `react-dom`
 * to smash the ReactElement into an DOM DocumentFragment.
 *
 */
export function doReact(
  tab: Tab,
  repl: REPL,
  response: NavResponse | MultiModalResponse,
  renderer: Renderer
): DocumentFragment {
  // render the view
  const view = renderer(tab, repl, response)

  // Note: the wrapper is needed to get React events to work; it seems
  // not to work with a DocumentFragment
  const wrapper = document.createElement('div') // <-- temporarily wrap for React
  ReactDomRender(view, wrapper)

  // hack for tests, until we figure out the title part
  hackForTests(wrapper)

  const content = document.createDocumentFragment()
  content.appendChild(wrapper.firstElementChild) // <-- then unwrap
  return content
}
