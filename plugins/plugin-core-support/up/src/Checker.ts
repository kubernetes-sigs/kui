/*
 * Copyright 2021 The Kubernetes Authors
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

import { Observer } from 'rxjs'
import { Arguments, ParsedOptions } from '@kui-shell/core'

import Group from './Group'
import Service from './Service'

export type CheckerArgs<O extends ParsedOptions = ParsedOptions> = Pick<
  Arguments<O>,
  'REPL' | 'createErrorStream' | 'createOutputStream' | 'parsedOptions'
>

export type CheckResultSuccess = true | string
export type CheckResult = CheckResultSuccess | { ok: boolean; message: string } | false

export type Stdout = NodeJS.WriteStream & NodeJS.WritableStream

type Checker<T extends CheckResult = CheckResult> = {
  group: Group
  service: Service

  check: (args: CheckerArgs, obs: Observer<string>) => T | Promise<T>
  label: string | ((checkResult: T) => string)
  description: string // FIXME not optional
  fix?: string | ((args: CheckerArgs, onInit: Arguments['execOptions']['onInit']) => T | Promise<T>)
  needsCloudLogin?: boolean
  optional?: boolean
}

export default Checker
