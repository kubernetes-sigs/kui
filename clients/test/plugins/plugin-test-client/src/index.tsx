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

import Client from './Client'
import { render as ReactDomRender } from 'react-dom'

/**
 * Use react-dom to render the client into the given container
 *
 */
function renderMain(container: Element) {
  ReactDomRender(Client(), container)
}

/** boot Kui! */
import('@kui-shell/core').then(_ => _.boot(renderMain))
