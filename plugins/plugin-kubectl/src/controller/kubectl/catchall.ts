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

import { inBrowser, hasProxy, Registrar, Arguments } from '@kui-shell/core'

import { doExecWithPty } from './exec'
import commandPrefix from '../command-prefix'
import { KubeOptions } from './options'
import { isUsage, doHelp } from '../../lib/util/help'

/** is the given string `str` the `kubectl` command? */
const isKubectl = (str: string) => /^k(ubectl)?$/.test(str)

export default (registrar: Registrar) => {
  if (inBrowser() && !hasProxy()) {
    // skipping catchall registration: in browser and no remote proxy to support it
    return
  }

  //
  // if we aren't running in a browser, then pass any command not
  // found exceptions to the outer shell
  //
  registrar.catchall(
    (argv: string[]) => {
      return isKubectl(argv[0]) || (argv[0] === commandPrefix && isKubectl(argv[1]))
    },
    (args: Arguments<KubeOptions>) => (isUsage(args) ? doHelp('kubectl', args) : doExecWithPty(args)),
    1, // priority
    { inBrowserOk: true }
  )
}
