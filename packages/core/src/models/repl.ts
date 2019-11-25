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

import { Tab } from '../webapp/cli'
import { MixedResponse, RawContent, RawResponse } from './entity'
import { EvaluatorArgs, KResponse } from './command'
import { ExecOptions } from './execOptions'

export default interface REPL {
  /**
   * Quiet eval. Useful to execute one command from another, without
   * emitting output to the console.
   *
   */
  qexec<T extends KResponse>(
    command: string,
    block?: HTMLElement | boolean,
    contextChangeOK?: boolean,
    execOptions?: ExecOptions,
    nextBlock?: HTMLElement
  ): Promise<T>

  /**
   * Raw eval. Useful to execute one command from another, where you
   * want the original model back, not the view-oriented model.
   *
   */
  rexec<Raw extends RawContent>(command: string, execOptions?: ExecOptions): Promise<RawResponse<Raw>>

  /**
   * Programmatic eval. Useful to execute one command from another,
   * e.g. as the result of a click handler --- where you would like
   * the REPL interaction to appear on the console.
   *
   */
  pexec<T extends KResponse>(command: string, execOptions?: ExecOptions): Promise<T>

  /**
   * Execute a command in response to an in-view click in a sidecar
   * view. This is helpful if you wish to participate in the view
   * nesting logic, e.g. where clicking on a link in a sidecar allows
   * the user to return to the previous view. In contrast, `pexec`
   * calls will *not* participate in view stacking.
   *
   */
  click(command: string | (() => Promise<string>), evt: MouseEvent): Promise<void>

  /**
   * Evaluate a command and place the result in the current active view for the given tab
   *
   */
  update(tab: Tab, command: string, execOptions?: ExecOptions): Promise<void>

  /**
   * If the command is semicolon-separated, invoke each element of the
   * split separately
   *
   */
  semicolonInvoke(opts: EvaluatorArgs): Promise<MixedResponse>

  /**
   * Prepare a string to be part of a `command` argument to the *exec
   * functions, quoting and escaping as necessary.
   *
   */
  encodeComponent(component: string | number | boolean, quote?: string): string

  /**
   * Split the given string into an argv
   *
   * @param [true] removeOuterQuotes
   * @param [false] removeInlineOuterQuotes
   *
   */
  split(str: string, removeOuterQuotes?: boolean, removeInlineOuterQuotes?: boolean): string[]
}
