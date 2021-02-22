/*
 * Copyright 2018-19 The Kubernetes Authors
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
import { doHelp, KubeOptions } from '@kui-shell/plugin-kubectl'

import isUsage from './usage'
import doExecWithStdout from './exec'
import commandPrefix from '../command-prefix'

const strings = i18n('plugin-kubectl')
const strings2 = i18n('plugin-kubectl', 'helm')
const debug = Debug('plugin-kubectl/helm/controller/helm/status')

/**
 * Format the output of a helm status command
 *
 */
export const format = async (
  name: string,
  args: Arguments<KubeOptions>,
  response: string,
  execOptions: ExecOptions
) => {
  const command = 'kubectl'
  const verb = 'get'

  debug('nested?', execOptions.nested)
  debug('command', command)
  debug('verb', verb)

  const [headerString] = response.split(/RESOURCES:|(?=NOTES:)/)

  const namespaceMatch = response.match(/^NAMESPACE:\s+(.*)$/m) || []
  const namespaceFromHelmStatusOutput = namespaceMatch[1]
  debug('namespace', namespaceFromHelmStatusOutput)

  const revisionMatch = response.match(/^REVISION:\s+(.*)$/m) || []
  const revisionFromHelmStatusOutput = revisionMatch[1]
  debug('revision', revisionFromHelmStatusOutput)

  // const namespaceFor = (entityType: string) => {
  /* const namespaceFor = () => {
    return namespaceFromHelmStatusOutput
  } */

  const resources = [] /* resourcesString
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
          Object.assign({}, args, {
            parsedOptions: Object.assign({}, args.parsedOptions, { namespace: namespaceFor() })
          }),
          preprocessTable([A.slice(1).join('\n')])[0]
        )
      }
    }) */

  debug('resources', resources)

  if (execOptions.nested) {
    debug('returning tables for nested call')
    return Promise.all(
      resources.map(async ({ kind, table }) => {
        const T = await table
        T.title = kind
        return T
      })
    )
  } else {
    const notesMatch = response.match(/NOTES:\n([\s\S]+)?/)

    const statusMatch = headerString.match(/LAST DEPLOYED: (.*)\nNAMESPACE: (.*)\nSTATUS: (.*)/)
    const status = !statusMatch
      ? headerString
      : `### ${strings2('Last Deployed')}
${statusMatch[1]}

### ${strings2('Namespace')}
${statusMatch[2]}

### ${strings2('Revision')}
${revisionFromHelmStatusOutput}

### ${strings('status')}
\`${statusMatch[3]}\`
`

    const summary = ''
    const notes = notesMatch && notesMatch[1]

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
                  content: `\`\`\`${notes}\`\`\``,
                  contentType: 'text/markdown'
                }
              ]
        )
    }

    const resourcesMenu = {
      label: 'Resources',
      items: await Promise.all(
        resources.map(async _ => ({
          mode: _.kind,
          content: await _.table
        }))
      )
    }

    const commandResponse: NavResponse = {
      apiVersion: 'kui-shell/v1',
      kind: 'NavResponse',
      breadcrumbs: [{ label: 'helm' }, { label: 'release', command: `helm ls` }, { label: name }],
      menus: [overviewMenu, resourcesMenu]
    }

    return commandResponse
  }
}

async function doStatus(args: Arguments<KubeOptions>) {
  if (isUsage(args, 'status')) {
    return doHelp('helm', args)
  }

  const name = args.argvNoOptions[args.argvNoOptions.indexOf('status') + 1]
  const response = await doExecWithStdout(args)

  try {
    return format(name, args, response, args.execOptions)
  } catch (err) {
    console.error('error formatting status', err)
    return response
  }
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/helm/status`, doStatus)
}
