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

import { KubeOptions } from '@kui-shell/plugin-kubectl'
import { opts, commandPrefix } from '@kui-shell/plugin-ibmcloud/ks'
import { CodedError, Arguments, Registrar, Table, i18n } from '@kui-shell/core'

import getInstalledPlugins from '../installed'
import trimSolitaryTrailingDots from '../trim'

const strings = i18n('plugin-ibmcloud/plugin')

/**
 * `ibmcloud plugin command list`
 *
 */
async function doList(args: Arguments<KubeOptions>): Promise<Table> {
  const which = args.argvNoOptions[args.argvNoOptions.indexOf('list') + 1]
  const { Plugins: installed } = await getInstalledPlugins(args)

  const installedEntry = installed[which]
  if (!installedEntry) {
    const err: CodedError = new Error(strings('Plugin not installed'))
    err.code = 404
    throw err
  }

  const body = installedEntry.Commands.map(_ => {
    const name = `ibmcloud${_.Namespace ? ' ' + _.Namespace : ''} ${_.Name}`
    return {
      name,
      onclick: `ibmcloud plugin command get ${which} ${_.Name}${
        _.Namespace ? ' --namespace ' + args.REPL.encodeComponent(_.Namespace) : ''
      }`,
      onclickSilence: true,
      attributes: [
        // { key: 'ALIASES', value: _.Aliases ? _.Aliases.join(',') : '', outerCSS: 'hide-with-sidecar', css: 'sub-text pre-wrap' },
        {
          key: 'DESCRIPTION',
          value: trimSolitaryTrailingDots(_.Description),
          outerCSS: 'hide-with-sidecar',
          css: 'pre-wrap'
        }
      ]
    }
  })

  const header = {
    name: 'NAME',
    attributes: body[0].attributes.map(_ => ({ value: _.key, outerCSS: _.outerCSS }))
  }

  return {
    header,
    body
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/ibmcloud/plugin/command/list`, doList, opts)
}
