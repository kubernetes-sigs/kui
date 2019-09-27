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
import * as Dom from '../webapp/util/dom'
import * as Sidecar from '../webapp/views/sidecar'
import * as ModeManager from '../webapp/bottom-stripe'
import * as ModeRegistrar from '../webapp/views/registrar/modes'
import * as BadgeRegistrar from '../webapp/views/registrar/badges'
import _Presentation from '../webapp/views/presentation'
import * as keys from '../webapp/keys'
import * as Time from '../webapp/util/time'
import formatAsPty from '@kui-shell/core/webapp/util/pretty-print'
import * as _Editor from '../webapp/views/registrar/editors'
import * as _TopTabs from '../webapp/views/top-tabs'

export namespace UI {
  /** interface defining the top-level UI tabs */
  export import Tab = CLI.Tab

  export import injectCSS = Inject.injectCSS
  export import uninjectCSS = Inject.uninjectCSS
  export import injectScript = Inject.injectScript
  export import loadHTML = Inject.loadHTML

  /** Remove all DOM children from a given DOM Node */
  export import empty = Dom.removeAllDomChildren

  export import Mode = ModeManager.SidecarMode
  export import ModeRegistration = ModeRegistrar.ModeRegistration
  export import ModeFilter = ModeRegistrar.SidecarModeFilter
  export import registerMode = ModeRegistrar.registerSidecarMode

  export import Badge = Sidecar.Badge
  export import BadgeSpec = Sidecar.BadgeSpec
  export import BadgeRegistration = BadgeRegistrar.BadgeRegistration
  export import registerBadge = BadgeRegistrar.registerSidecarBadge

  export import ToolbarText = Sidecar.ToolbarText

  export import TopTabs = _TopTabs

  export namespace Editor {
    export import Provider = _Editor.EditorProvider
    export import registerProvider = _Editor.registerEditor
  }

  export import Presentation = _Presentation
  export import isPopup = CLI.isPopup

  export import getCurrentPrompt = CLI.getCurrentPrompt
  export import getCurrentBlock = CLI.getCurrentBlock

  export namespace PrettyPrinters {
    export import time = Time.prettyPrintTime
    export const ansi = formatAsPty
  }

  export namespace Keys {
    export import Codes = keys.keys
    export import isCursorMovement = keys.isCursorMovement
  }

  export namespace LowLevel {
    export import prompt = CLI.prompt
    export import partialInput = CLI.partial
    export import scrollIntoView = CLI.scrollIntoView
    export import doCancel = CLI.doCancel
    export import isUsingCustomPrompt = CLI.isUsingCustomPrompt
  }
}
