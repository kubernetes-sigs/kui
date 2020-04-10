/*
 * Copyright 2018-19 IBM Corporation
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

import Debug from 'debug'
import { Arguments, ExecOptions, Registrar, NavResponse, i18n } from '@kui-shell/core'
import { isUsage, doHelp, preprocessTable, formatTable, KubeOptions } from '@kui-shell/plugin-kubectl'

import doExecWithStdout from './exec'
import commandPrefix from '../command-prefix'

const strings = i18n('plugin-kubectl')
const strings2 = i18n('plugin-kubectl', 'helm')
const debug = Debug('plugin-kubectl/helm/controller/helm/status')

/**
 * Format the output of a helm status command
 *
 */
export const format = async (name: string, options: KubeOptions, response: string, execOptions: ExecOptions) => {
  const command = 'kubectl'
  const verb = 'get'

  debug('nested?', execOptions.nested)
  debug('command', command)
  debug('verb', verb)

  const [headerString, resourcesString, notesString] = response.split(/RESOURCES:|(?=NOTES:)/)

  const namespaceMatch = response.match(/^NAMESPACE:\s+(.*)$/m) || []
  const namespaceFromHelmStatusOutput = namespaceMatch[1]
  debug('namespace', namespaceFromHelmStatusOutput)

  // const namespaceFor = (entityType: string) => {
  const namespaceFor = () => {
    return namespaceFromHelmStatusOutput
  }

  const resources = resourcesString
    .split(/==>/)
    .map(_ => _.split(/[\n\r]/))
    .filter(A => A.length > 0 && A[0])
    .map(A => {
      const kind = A[0].trim()

      // "v1/pod(related)" => "pod"
      const entityType = kind.replace(/(v\w+\/)?([^()]*)(\s*\(.*\))?/, '$2')

      if (!/\s*NAME(\s+|$)/.test(A[1])) {
        // no header row? this seems to be a bug in helm
        const match = A[1].match(/(.+\s+)(.+)/)
        if (match && match[1]) {
          const secondColIdx = match[1].length
          const firstCol = 'NAME'
          const secondCol = 'AGE'
          const spaces = (nSpaces: number) => new Array(nSpaces).join(' ')
          const header = `${firstCol}${spaces(secondColIdx - firstCol.length)}${secondCol}`
          A.splice(1, 0, header)
        }
      }

      return {
        kind,
        table: formatTable(
          command,
          verb,
          entityType,
          Object.assign({}, options, { namespace: namespaceFor() }),
          preprocessTable([A.slice(1).join('\n')])[0]
        )
      }
    })

  debug('resources', resources)

  if (execOptions.nested) {
    debug('returning tables for nested call')
    return resources.map(({ kind, table }) => {
      table.title = kind
      return table
    })
  } else {
    const notesMatch =
      notesString &&
      notesString.match(
        /^NOTES:\n(\S+) can be accessed via port (\d+) on the following DNS name from within your cluster:\n(\S+)([s\S]+)?/
      )

    const statusMatch = headerString.match(/LAST DEPLOYED: (.*)\nNAMESPACE: (.*)\nSTATUS: (.*)/)
    const status = !statusMatch
      ? headerString
      : `### ${strings2('Last Deployed')}
${statusMatch[1]}

### ${strings2('Namespace')}
${statusMatch[2]}

### ${strings('status')}
\`${statusMatch[3]}\`
`

    const summary = !notesMatch
      ? notesString
      : `### Chart Name
${notesMatch[1]}

### Port
\`${notesMatch[2]}\`

### DNS Name
${notesMatch[3]}`

    const notes = notesMatch && notesMatch[4]

    const overviewMenu = {
      label: 'Overview',
      items: [
        {
          mode: 'status',
          label: strings('status'),
          content: status,
          contentType: 'text/markdown'
        }
      ]
        .concat(
          !summary
            ? []
            : [
                {
                  mode: 'summary',
                  label: strings('summary'),
                  content: summary,
                  contentType: 'text/markdown'
                }
              ]
        )
        .concat(
          !notes
            ? []
            : [
                {
                  mode: 'notes',
                  label: strings2('Notes'),
                  content: notes,
                  contentType: 'text/markdown'
                }
              ]
        )
    }

    const resourcesMenu = {
      label: 'Resources',
      items: resources.map(_ => ({
        mode: _.kind,
        content: _.table
      }))
    }

    const response: NavResponse = {
      apiVersion: 'kui-shell/v1',
      kind: 'NavResponse',
      breadcrumbs: [{ label: 'helm' }, { label: 'release', command: `helm ls` }, { label: name }],
      menus: [overviewMenu, resourcesMenu]
    }

    return response
  }
}

async function doStatus(args: Arguments<KubeOptions>) {
  if (isUsage(args)) {
    return doHelp('helm', args)
  }

  const name = args.argvNoOptions[args.argvNoOptions.indexOf('status') + 1]
  const response = await doExecWithStdout(args)

  try {
    return format(name, args.parsedOptions, response, args.execOptions)
  } catch (err) {
    console.error('error formatting status', err)
    return response
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/helm/status`, doStatus, {
    inBrowserOk: true
  })
}
