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

import { ExecType } from '../core/command-tree'

export interface IExecOptions {
  isDrilldown?: boolean
  block?: HTMLElement
  nextBlock?: HTMLElement
  placeholder?: string
  replSilence?: boolean
  quiet?: boolean
  intentional?: boolean
  noHistory?: boolean
  pip?: any
  history?: any
  echo?: boolean
  nested?: boolean
  failWithUsage?: boolean
  rethrowErrors?: boolean
  reportErrors?: boolean
  preserveBackButton?: boolean
  type?: ExecType
  container?: Element
  raw?: boolean
  createOnly?: boolean
  noHeader?: boolean
  noStatus?: boolean
  noRetry?: boolean
  showHeader?: boolean
  alreadyWatching?: boolean

  stdout?: (str: string) => any
  stderr?: (str: string) => any

  parameters?: any
  entity?: any
}

export class DefaultExecOptions implements IExecOptions {
  type: ExecType = ExecType.TopLevel

  constructor () {
    // nothing to do
  }
}
