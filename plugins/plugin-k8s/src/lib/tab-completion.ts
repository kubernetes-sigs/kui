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

import { rexec as $$ } from '@kui-shell/core/core/repl'
import { ParsedOptions } from '@kui-shell/core/models/execOptions'

import { registerEnumerator } from '@kui-shell/plugin-core-support/lib/tab-completion'

/**
 * Tab completion of kube resource names
 *
 */
async function completeResourceNames (command: string, args: string[], options: ParsedOptions, toBeCompletedIdx: number, toBeCompleted: string): Promise<string[]> {
  if ((args[0] === 'kubectl' || args[0] === 'k') &&
      (args[1] === 'get' ||
       args[1] === 'describe' ||
       args[1] === 'annotate' ||
       args[1] === 'label' ||
       (args[1] === 'delete' && !options.f && !options.file))) {
    const entityType = args[2]
    const optionals = Object.keys(options)
      .filter(_ => !/^(-o|--output)/.test(_)) // remove any existing -o, because we want to use -o name
      .map(key => `${key.length === 1 ? `-${key}` : `--${key}`} ${options[key]}`)

    const list: string[] = (await $$(`kubectl get ${entityType} ${optionals.join(' ')} -o name`))
      .split(/[\n\r]/)
      .map(_ => _.replace(/^\w+\//, ''))

    return list.filter(name => name.startsWith(toBeCompleted))
  }
}

/**
 * Entry point to register kubernetes tab completion
 *
 */
export default () => {
  registerEnumerator(completeResourceNames)
}
