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

export namespace Commands {
  export import DefaultExecOptions = _ExecOptions.DefaultExecOptions
  export import ExecOptions = _ExecOptions.ExecOptions
  export import withLanguage = _ExecOptions.withLanguage

  export import ExecType = _Commands.ExecType
  export import Registrar = _Commands.CommandRegistrar
  export import EvaluatorArgs = _Commands.EvaluatorArgs
  export import ParsedOptions = _Commands.ParsedOptions
  export import ParsedOptionsFull = _Commands.ParsedOptionsFull
  export import CommandHandler = _Commands.CommandHandler
  export import Evaluator = _Commands.Evaluator
  export import isCommandHandlerWithEvents = _Commands.isCommandHandlerWithEvents
  export import Event = _Commands.Event
  export import CommandLine = _Commands.CommandLine
}
