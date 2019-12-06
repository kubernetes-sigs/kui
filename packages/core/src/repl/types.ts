/*
 * Copyright 2017-19 IBM Corporation
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

import { CodedError } from '../models/errors'
import { ExecOptions } from '../models/execOptions'
import { Evaluator, EvaluatorArgs, KResponse, ParsedOptions } from '../models/command'

/**
 * repl.exec, and the family repl.qexec, repl.pexec, etc. are all
 * backed by an implementation of this interface
 *
 */
export interface Executor {
  name: string
  exec<T extends KResponse, O extends ParsedOptions>(
    commandUntrimmed: string,
    execOptions: ExecOptions
  ): Promise<T | CodedError<number> | HTMLElement>
}

/**
 * Apply the given evaluator to the given arguments
 *
 */
export interface ReplEval {
  name: string
  apply<T extends KResponse, O extends ParsedOptions>(
    commandUntrimmed: string,
    execOptions: ExecOptions,
    evaluator: Evaluator<T, O>,
    args: EvaluatorArgs<O>
  ): T | Promise<T>
}

/**
 * Directly apply the given evaluator to the given arguments. This is
 * the default evaluator implementation.
 *
 */
export class DirectReplEval implements ReplEval {
  public name = 'DirectReplEval'

  public apply<T extends KResponse, O extends ParsedOptions>(
    commandUntrimmed: string,
    execOptions: ExecOptions,
    evaluator: Evaluator<T, O>,
    args: EvaluatorArgs<O>
  ) {
    return evaluator.eval(args)
  }
}
