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

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */

/**
 * API: UI
 *
 */

import * as CLI from '../webapp/cli'
import * as Inject from '../webapp/util/inject'
import * as Dom from '@kui-shell/core/webapp/util/dom'

export namespace UI {
  export import Tab = CLI.Tab

  export import injectCSS = Inject.injectCSS
  export import uninjectCSS = Inject.uninjectCSS
  export import injectScript = Inject.injectScript
  export import loadHTML = Inject.loadHTML

  export import empty = Dom.removeAllDomChildren
}
