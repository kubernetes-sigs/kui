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

/* eslint-disable @typescript-eslint/explicit-member-accessibility */

import { ExecType } from './command'
import { Tab, Streamable } from '../webapp/cli'

export interface ExecOptions {
  // force execution in a given tab?
  tab?: Tab

  /** environment variable map */
  env?: Record<string, string>

  isProxied?: boolean
  forceProxy?: boolean
  noDelegation?: boolean
  delegationOk?: boolean

  leaveBottomStripeAlone?: boolean

  filter?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  contextChangeOK?: boolean
  credentials?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

  custom?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  rawResponse?: boolean
  isDrilldown?: boolean
  block?: HTMLElement
  nextBlock?: HTMLElement
  placeholder?: string
  replSilence?: boolean
  quiet?: boolean
  intentional?: boolean
  noHistory?: boolean
  pip?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  history?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  echo?: boolean
  nested?: boolean
  failWithUsage?: boolean
  rethrowErrors?: boolean
  reportErrors?: boolean
  preserveBackButton?: boolean
  type?: ExecType

  exec?: 'pexec' | 'qexec'

  container?: Element
  raw?: boolean
  createOnly?: boolean
  noHeader?: boolean
  noStatus?: boolean
  noSidecarHeader?: boolean
  noRetry?: boolean
  showHeader?: boolean
  alreadyWatching?: boolean

  createOutputStream?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  stdout?: (str: Streamable) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  stderr?: (str: string) => any // eslint-disable-line @typescript-eslint/no-explicit-any

  parameters?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  entity?: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface LanguageBearing extends ExecOptions {
  /** navigator.language */
  language: string
}

export function hasLanguage(execOptions: ExecOptions): execOptions is LanguageBearing {
  return (execOptions as LanguageBearing).language !== undefined
}

export function withLanguage(execOptions: ExecOptions): LanguageBearing {
  if (hasLanguage(execOptions)) {
    return execOptions
  } else {
    return Object.assign({}, execOptions, { language: typeof navigator !== 'undefined' && navigator.language })
  }
}

export class DefaultExecOptions implements ExecOptions {
  readonly type: ExecType

  readonly language: string

  constructor(type: ExecType = ExecType.TopLevel) {
    this.type = type
    this.language = typeof navigator !== 'undefined' && navigator.language
  }
}

export class DefaultExecOptionsForTab extends DefaultExecOptions {
  readonly tab: Tab

  constructor(tab: Tab) {
    super()
    this.tab = tab
  }
}

/** command line options */
export interface ParsedOptions {
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
