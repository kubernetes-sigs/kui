/*
 * Copyright 2019 The Kubernetes Authors
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

import { resolve, basename } from 'path'
import { Arguments, Menu, Registrar, i18n, Util } from '@kui-shell/core'
import { KubeOptions, KubeResource } from '@kui-shell/plugin-kubectl-core'

import flags from './flags'
import { kindPartOf } from './fqn'
import { doExecWithStdout } from './exec'

import { isUsage, doHelp } from '../../lib/util/help'

const strings = i18n('plugin-kubectl', 'kustomize')

/**
 * Tilde expansion of the positional filepath parameter.
 *
 */
function prepare(args: Arguments<KubeOptions>): string {
  const idx = args.argvNoOptions.indexOf('kustomize')
  const filepath = args.argvNoOptions[idx + 1]
  if (!filepath) {
    return args.command
  } else {
    return args.command.replace(new RegExp(filepath, 'g'), Util.expandHomeDir(filepath))
  }
}

function groupByKind(resources: KubeResource[], rawFull: string): Menu[] {
  const rawSplit = rawFull.split(/---/)

  const groups = resources.reduce((groups, resource, idx) => {
    const key = kindPartOf(resource)
    const group = groups[key]
    if (!group) {
      groups[key] = {
        label: key,
        items: []
      }
    }

    groups[key].items.push({
      mode: resource.metadata.name,
      content: rawSplit[idx].replace(/^\n/, ''),
      contentType: 'yaml'
    })
    return groups
  }, {} as Record<string, Menu>)

  const rawMenu: Menu = {
    label: strings('Raw Data'),
    items: [
      {
        mode: 'YAML',
        content: rawFull,
        contentType: 'yaml'
      }
    ]
  }

  return Object.values(groups).concat([rawMenu])
}

export const doKustomize =
  (command = 'kubectl') =>
  async (args: Arguments<KubeOptions>) => {
    if (isUsage(args)) {
      return doHelp(command, args)
    } else {
      const [yaml, { loadAll }] = await Promise.all([doExecWithStdout(args, prepare, command), import('js-yaml')])
      try {
        const resources = loadAll(yaml) as KubeResource[]
        const inputFile = resolve(args.argvNoOptions[args.argvNoOptions.indexOf('kustomize') + 1])

        return {
          apiVersion: 'kui-shell/v1',
          kind: 'NavResponse',
          breadcrumbs: [{ label: 'kustomize' }, { label: basename(inputFile), command: `open ${inputFile}` }],
          menus: groupByKind(resources, yaml)
        }
      } catch (err) {
        console.error('error preparing kustomize response', err)
        return yaml
      }
    }
  }

export default (registrar: Registrar) => {
  registrar.listen('/kubectl/kustomize', doKustomize(), flags)
  registrar.listen('/k/kustomize', doKustomize(), flags)
}
