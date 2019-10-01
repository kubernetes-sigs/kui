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
const debug = Debug('plugins/bash-like/util/sidecar-support')

/**
 * Render the given pre-rendered content as a sidecar-compatible dom
 *
 */
export const asSidecarContent = (renderedContent: Element | string, tag = 'pre') => {
  const content = document.createElement('div')
  content.classList.add('code-highlighting')
  content.classList.add('scrollable')
  content.classList.add('scrollable-auto')
  const scrollInner = document.createElement(tag)
  scrollInner.classList.add('padding-content')
  content.appendChild(scrollInner)

  // debug('renderedContent', renderedContent)
  if (typeof renderedContent === 'string') {
    scrollInner.innerHTML = renderedContent
  } else {
    scrollInner.appendChild(renderedContent)
  }

  return content
}

/**
 * Render the given pre-rendered content as a sidecar entity
 *
 * @param renderedContent either a DOM Element or a rendered HTML string
 */
export const asSidecarEntity = (
  cmdLine: string,
  renderedContent: Element | string,
  options = {},
  tag = 'pre',
  prettyType = 'shell',
  subtext?: string | Element | Promise<string | Element>
) => {
  debug('asSidecarEntity', options)

  return Object.assign(
    {
      type: 'custom',
      prettyType,
      isEntity: true,
      subtext,
      name: cmdLine,
      content: asSidecarContent(renderedContent, tag)
    },
    options
  )
}
