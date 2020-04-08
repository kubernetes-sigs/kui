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

import { Arguments, Registrar, i18n } from '@kui-shell/core'

import flags from './flags'
import { KubeOptions } from './options'
import { doExecWithStdout } from './exec'
import commandPrefix from '../command-prefix'

const strings = i18n('plugin-kubectl')

function formatHref(href: string) {
  if (/api-conventions/.test(href) && !/sig-architecture/.test(href)) {
    return href.replace(/api-conventions/, 'sig-architecture/api-conventions')
  } else {
    return href
  }
}

function formatDocumentation(description: string) {
  return description
    .replace(/\n/g, ' ')
    .replace(/(More info:\s+)?(https:\/\/.*)/, (_, _2, href) => `\n\n[More info](${formatHref(href)})`)
}

function formatField(_: string[]) {
  return {
    mode: _[1],
    contentType: 'text/markdown',
    content: `### Type
${_[2]}
### Documentation
${formatDocumentation(_[4])}
`
  }
}

// alternate patterns to match against
const kvd = /^KIND:\s+(\S+)\nVERSION:\s+(\S+)\n\nDESCRIPTION:\n(\s*DEPRECATED - )?([\s\S]+)/
const kvdf = /^KIND:\s+(\S+)\nVERSION:\s+(\S+)\n\nDESCRIPTION:\n(\s*DEPRECATED - )?([\s\S]+)\n\nFIELDS:\n([\s\S]+)/

export const doExplain = (command = 'kubectl') =>
  async function(args: Arguments<KubeOptions>) {
    // first, we do the raw exec of the given command
    const response = await doExecWithStdout(args, undefined, command)

    try {
      // look first for a full Kind Version Description Fields;
      // otherwise, look for just Kind Version Description
      const match = response.match(kvdf) || response.match(kvd)

      if (match) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, kind, version, isDeprecated, description, fields] = match

        const fieldSections = !fields
          ? []
          : fields
              .split(/\n\n/)
              .filter(_ => _)
              .map(_ => _.match(/\s*(\S+)\s+<(\S+)>( -required-)?\n\s*([\s\S]*)/))
              .filter(_ => _)

        const requiredFields = fieldSections.filter(_ => _[3])
        const notRequiredFields = fieldSections.filter(_ => !_[3])

        const apiGroup = version ? version.match(/^([^/]+)\//) : undefined
        const apiGroupBreadcrumb = !apiGroup
          ? []
          : [{ label: apiGroup[1], command: `kubectl api-resources --api-group ${apiGroup[1]}` }]

        return {
          apiVersion: 'kui-shell/v1',
          kind: 'NavResponse',
          breadcrumbs: [{ label: 'API Resources', command: 'kubectl api-resources' }]
            .concat(apiGroupBreadcrumb)
            .concat([{ label: kind, command: undefined }]),
          menus: [
            {
              label: kind,
              items: [
                {
                  mode: 'Overview',
                  contentType: 'text/markdown',
                  content: `### Description
    #### ${description.replace(/\n/g, ' ')}
    ### Version
    ${version}
    ${isDeprecated ? `### Warnings\n${strings('This API Resource is deprecated')}` : ''}
    `
                }
              ]
            }
          ]
            .concat(
              requiredFields.length === 0 ? [] : [{ label: 'Required Fields', items: requiredFields.map(formatField) }]
            )
            .concat(
              notRequiredFields.length === 0 ? [] : [{ label: 'Fields', items: notRequiredFields.map(formatField) }]
            )
        }
      }
    } catch (err) {
      console.error('error parsing explaing', err)
    }

    return response
  }

/**
 * @param kindAsProvidedByUser e.g. pod or po
 * @return e.g. Pod
 *
 */
export async function getKind(command: string, args: Arguments, kindAsProvidedByUser: string): Promise<string> {
  try {
    const ourArgs = Object.assign({}, args, { command: `kubectl explain ${kindAsProvidedByUser}` })
    const explained = await doExecWithStdout(ourArgs, undefined, command)

    return explained.match(/^KIND:\s+(.*)/)[1]
  } catch (err) {
    if (!/does not exist/i.test(err.message)) {
      console.error(`error explaining kind ${kindAsProvidedByUser}`, err)
    }
  }
}

export default (registrar: Registrar) => {
  const handler = doExplain()
  registrar.listen(`/${commandPrefix}/kubectl/explain`, handler, flags)
  registrar.listen(`/${commandPrefix}/k/explain`, handler, flags)
}
