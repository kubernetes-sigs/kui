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
 * API: arguments to command handlers
 *
 */

import * as _ExecOptions from '../models/execOptions'
import * as _Commands from '../models/command'
import * as Plugins from '../models/plugin'
import * as Entity from '../models/entity'
import * as Sidecar from '../webapp/views/sidecar'
import { optionsToString } from '../core/utility'
import * as Context from '../commands/context'

export namespace Commands {
  export import Arguments = _Commands.EvaluatorArgs
  export import KResponse = _Commands.KResponse

  export import SimpleEntity = Entity.SimpleEntity
  export import CustomResponse = Sidecar.CustomSpec
  export import MixedResponse = Entity.MixedResponse
  export import ResourceModification = Entity.ResourceModification

  export import DefaultExecOptions = _ExecOptions.DefaultExecOptions
  export import ExecOptions = _ExecOptions.ExecOptions
  export import withLanguage = _ExecOptions.withLanguage

  export import getCurrentContext = Context.getCurrentContext

  export import ExecType = _Commands.ExecType
  export import Registrar = _Commands.CommandRegistrar
  export import ParsedOptions = _Commands.ParsedOptions
  export import CommandHandler = _Commands.CommandHandler
  export import Evaluator = _Commands.Evaluator
  export import isCommandHandlerWithEvents = _Commands.isCommandHandlerWithEvents
  export import Event = _Commands.Event
  export import CommandLine = _Commands.CommandLine

  export import PluginRegistration = Plugins.PluginRegistration
  export import PreloadRegistration = Plugins.PreloadRegistration

  /**
   * Turns a ParsedOptions into a dash-options string.
   *
   * @param options a ParsedOptions instance
   * @returns the corresponding "--optKey optValue ..." string
   */
  export const unparse = optionsToString
}

// export some of the common types, to allow for imports that avoid dynamic requires
// see https://github.com/IBM/kui/issues/3222
export { PluginRegistration, PreloadRegistration } from '../models/plugin'
export {
  CommandOptions,
  CommandLine,
  Evaluator,
  ExecType,
  KResponse,
  ParsedOptions,
  EvaluatorArgs as Arguments,
  CommandRegistrar as Registrar
} from '../models/command'

export { MixedResponse, RawResponse, ResourceModification } from '../models/entity'

export { isCommandHandlerWithEvents } from '../models/command'

export { withLanguage } from '../models/execOptions'

export { _ExecOptions as ExecOptions }
export default Commands
