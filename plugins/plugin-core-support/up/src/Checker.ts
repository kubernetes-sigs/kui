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

import Group from './Group'
import { Observer } from 'rxjs'
import { Arguments } from '@kui-shell/core'

export type CheckerArgs = Pick<Arguments, 'REPL' | 'createErrorStream'>

export type CheckResultSuccess = true | string
export type CheckResult = CheckResultSuccess | false

type Checker<T extends CheckResult = CheckResult> = {
  group: Group
  check: (args: CheckerArgs, obs: Observer<string>) => T | Promise<T>
  label: string | ((checkResult: T) => string)
  fix?: string | ((args: Arguments) => T | Promise<T>)
  needsCloudLogin?: boolean
  optional?: boolean
}

export default Checker
