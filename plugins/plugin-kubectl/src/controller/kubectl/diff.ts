/*
 * Copyright 2020 The Kubernetes Authors
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

import { basename, dirname } from 'path'

import {
  Arguments,
  findFile,
  expandHomeDir,
  i18n,
  Mode,
  MultiModalResponse,
  KResponse,
  Registrar
} from '@kui-shell/core'
import { File } from '@kui-shell/plugin-bash-like/fs'

import { getFileFromArgv, getFileForArgv, KubeOptions, withKubeconfigFrom } from './options'
import { isUsage, doHelp } from '../../lib/util/help'
import { removeLastAppliedConfig } from '../../lib/util/util'
import { isKubeResource } from '../../lib/model/resource'
import { exec } from './exec'

const strings = i18n('plugin-kubectl')

const doDiff = (command: string) =>
  async function(args: Arguments<KubeOptions>): Promise<KResponse> {
    if (isUsage(args)) {
      return doHelp(command, args)
    } else {
      try {
        const { REPL } = args
        const filepath = getFileFromArgv(args)
        if (typeof filepath !== 'string') {
          throw new Error('multi-file diff currently unsupported')
        }
        const fullpath = findFile(expandHomeDir(filepath))
        const name = basename(filepath)
        const enclosingDirectory = dirname(filepath)
        const packageName = enclosingDirectory === '.' ? undefined : enclosingDirectory

        const [previous, current] = await Promise.all([
          REPL.qexec(withKubeconfigFrom(args, `${command} get ${getFileForArgv(args)} -o yaml`)),
          REPL.qexec(withKubeconfigFrom(args, `${command} apply ${getFileForArgv(args)} --dry-run=server -o yaml`))
        ])

        console.error('previous', previous)
        console.error('current', current)

        if (isKubeResource(previous) && isKubeResource(current)) {
          const mode: Mode = {
            mode: 'diff',
            label: strings('Pending Changes'),
            content: {
              a: removeLastAppliedConfig(previous.kuiRawData),
              b: removeLastAppliedConfig(current.kuiRawData)
            },
            contentType: 'yaml'
          }

          const response: MultiModalResponse<File> = {
            apiVersion: 'kui-shell/v1',
            kind: 'File',
            metadata: {
              name,
              namespace: packageName
            },
            toolbarText: {
              type: 'info',
              text: strings('Showing changes between the working tree and previous commit.')
            },
            modes: [mode],
            spec: {
              filepath,
              fullpath,
              size: 0
            }
          }

          return response
        } else {
          throw new Error('failed to get resources')
        }
      } catch (err) {
        console.error('error at kubectl diff', err)
        return exec(args, undefined, command)
      }
    }
  }

/** Register a command listener */
export function describer(registrar: Registrar, command: string, cli = command) {
  registrar.listen(`/${command}/diff`, doDiff(cli))
}

export default (registrar: Registrar) => {
  describer(registrar, 'kubectl')
  describer(registrar, 'k', 'kubectl')
}
