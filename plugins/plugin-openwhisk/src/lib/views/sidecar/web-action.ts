/*
 * Copyright 2017-18 IBM Corporation
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

import { UI } from '@kui-shell/core'
import { addBadge } from '@kui-shell/core/webapp/views/sidecar'

/**
 * Given a web action, return the url that points to the deployed action
 *
 */
export const formatWebActionURL = action => {
  // note that we use json as the default content type
  const contentType = (action.annotations && action.annotations.find(kv => kv.key === 'content-type-extension')) || {
    value: 'json'
  }
  const https =
    action.apiHost.startsWith('https://') || action.apiHost.startsWith('http://')
      ? ''
      : action.apiHost === 'localhost'
      ? 'http://'
      : 'https://'
  const urlText = `${https}${action.apiHost}/api/v1/web/${action.namespace}/${!action.packageName ? 'default/' : ''}${
    action.name
  }.${contentType.value}`

  return urlText
}

/**
 * Add a badge indicating that this is a web action. Format the badge
 * with an onclick handler that invokes the web action endpoint.
 *
 */
export const addWebBadge = (tab: UI.Tab, action) => {
  const isWebExported = action.annotations && action.annotations.find(kv => kv.key === 'web-export' && kv.value)
  if (isWebExported) {
    const anchor = document.createElement('a')
    const urlText = formatWebActionURL(action)

    const badge = addBadge(tab, anchor)
    badge.classList.add('clickable')
    anchor.classList.add('entity-web-export-url')
    anchor.classList.add('has-url')
    anchor.innerText = 'web accessible'
    anchor.classList.add('plain-anchor')
    anchor.setAttribute('href', urlText)
    anchor.setAttribute('target', '_blank')

    return { anchor, urlText }
  }
}
