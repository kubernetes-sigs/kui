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

import { Arguments } from '@kui-shell/core'
import { doExecWithStdout as doExec, KubeOptions } from '@kui-shell/plugin-kubectl'

export function doExecWithStdout<O extends KubeOptions>(args: Arguments<O>) {
  return doExec(args, undefined, 'ibmcloud')
}

export function doJSONWithStdout<O extends KubeOptions>(args: Arguments<O>) {
  args.command += ` --json`
  args.argv.push('--json')
  args.argvNoOptions.push('--json')

  return doExecWithStdout(args)
}

export default doJSONWithStdout
