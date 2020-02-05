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

import Sidecar from '../model/sidecar'

export default function loadSidecar(): { sidecar: Sidecar; content: DocumentFragment } {
  const content = document.createDocumentFragment()

  // pull in the html string, attach it to a temporary div, then
  // extract our sidecar DOM
  const { default: html } = require('@kui-shell/plugin-sidecar/web/html/sidecar.html')
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  const sidecar = tmp.querySelector('framecontent') as Sidecar // <-- here it is!

  // add the sidecar DOM to the content fragment that is our response
  content.appendChild(sidecar)

  return { sidecar, content }
}
