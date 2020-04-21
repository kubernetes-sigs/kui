/*
 * Copyright 2020 IBM Corporation
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

import { inBrowser, hasProxy, Arguments, Registrar, i18n } from '@kui-shell/core'
import {
  doExecWithPty,
  doExecWithMarkdown,
  commandPrefix,
  isUsage,
  doHelp,
  KubeOptions
} from '@kui-shell/plugin-kubectl'

const strings = i18n('plugin-kubectl')

/** is the given string `str` the `oc` or `odo` command? */
const isOc = (str: string) => /^(oc|odo)$/.test(str)

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
      return isOc(argv[0]) || (argv[0] === commandPrefix && isOc(argv[1]))
    },
    async (args: Arguments<KubeOptions>) => {
      const cmd = args.argv[0] === commandPrefix ? args.argv[1] : args.argv[0]

      if (args.argv.length === 1 || (args.argv.length === 2 && args.argv[1] === cmd)) {
        // `oc` or `odo` on their own
        const response = await doExecWithMarkdown(args, cmd)
        response.links.push({
          label: strings('More Information'),
          command: `${cmd} -h`
        })
        return response
      }

      return isUsage(args)
        ? doHelp(cmd, args).catch(err => {
            // failsafe: something went wrong with doHelp
            console.error(err)
            return doExecWithPty(args)
          })
        : doExecWithPty(args)
    },
    1 // priority
  )
}
