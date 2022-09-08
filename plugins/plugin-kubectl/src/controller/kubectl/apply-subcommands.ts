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

/**
 * Notes: this file covers the three (as of this writing) subcommands
 * of apply:
 *  - view-last-applied
 *  - set-last-applied
 *  - edit-last-applied
 *
 */

import { Arguments, CodedError, CommandOptions, ViewTransformer, Registrar, i18n } from '@kui-shell/core'

import { flags } from './flags'
import { doExecWithPty } from './exec'
import { isUsage, doHelp } from '../../lib/util/help'
import { getCommandFromArgs } from '../../lib/util/util'
import { doGetAsMMR as getTransformer } from './get'
import { editSpec, formatToolbarText } from './edit'
import { KubeOptions, getNamespaceForArgv } from './options'
import KubeResource, { isKubeResource } from '../../lib/model/resource'
import {
  hasLastApplied,
  mode as lastAppliedMode,
  label as lastAppliedModeLabel,
  order as lastAppliedOrder,
  renderLastApplied
} from '../../lib/view/modes/last-applied'

const strings = i18n('plugin-kubectl')

/** View Transformer for view-last-applied and edit-last-applied */
export const viewLastApplied =
  (subcommand: 'view-last-applied' | 'edit-last-applied') =>
  async (args: Arguments<KubeOptions>, response: KubeResource) => {
    if (isKubeResource(response)) {
      if (hasLastApplied(response)) {
        const baseView = await getTransformer(args, response)

        if (subcommand === 'view-last-applied') {
          return Object.assign(baseView, { defaultMode: lastAppliedMode })
        } else {
          const { content, contentType } = await renderLastApplied(args.tab, response)
          const spec = editSpec(
            getCommandFromArgs(args),
            response.metadata.namespace,
            args,
            response,
            'set-last-applied'
          )

          const editMode = {
            mode: lastAppliedMode,
            label: lastAppliedModeLabel,
            order: lastAppliedOrder - 1, // overwrite the pre-registered last-applied mode
            content,
            contentType,
            spec
          }

          return Object.assign(baseView, {
            modes: [editMode],
            defaultMode: lastAppliedMode,
            toolbarText: formatToolbarText(args, response)
          })
        }
      } else {
        const error: CodedError = new Error(strings('This resource has no last applied configuration'))
        error.code = 404
        throw error
      }
    }
  }

function get(subcommand: string, args: Arguments<KubeOptions>) {
  const command = getCommandFromArgs(args)

  if (isUsage(args)) {
    // special case: --help/-h
    return doHelp(command === 'k' ? 'kubectl' : command, args)
  }

  const idx = args.argvNoOptions.indexOf(subcommand)
  const kind = args.argvNoOptions[idx + 1] || ''
  const name = args.argvNoOptions[idx + 2] || ''
  const file = args.parsedOptions.f || args.parsedOptions.filename

  if (file) {
    return args.REPL.qexec<KubeResource>(`${command} get -f ${file} ${getNamespaceForArgv(args)} -o yaml`)
  } else {
    return args.REPL.qexec<KubeResource>(`${command} get ${kind} ${name} ${getNamespaceForArgv(args)} -o yaml`)
  }
}

function withTransformer(viewTransformer: ViewTransformer<KubeResource, KubeOptions>): CommandOptions {
  return Object.assign({}, flags, { viewTransformer })
}

export function registerApplySubcommands(registrar: Registrar, cmd: string) {
  registrar.listen(
    `/${cmd}/apply/view-last-applied`,
    get.bind(undefined, 'view-last-applied'),
    withTransformer(viewLastApplied('view-last-applied'))
  )

  registrar.listen(
    `/${cmd}/apply/edit-last-applied`,
    get.bind(undefined, 'edit-last-applied'),
    withTransformer(viewLastApplied('edit-last-applied'))
  )

  registrar.listen(`/${cmd}/apply/set-last-applied`, doExecWithPty)
}

export default function registerForKubectl(registrar: Registrar) {
  registerApplySubcommands(registrar, 'kubectl')
  registerApplySubcommands(registrar, 'k')
}
