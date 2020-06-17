/*
 * Copyright 2019-2020 IBM Corporation
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
import { Arguments, Breadcrumb, Registrar, i18n } from '@kui-shell/core'

import flags from './flags'
import { KubeOptions } from './options'
import { doExecWithStdout } from './exec'
import commandPrefix from '../command-prefix'
import { isUsage, doHelp } from '../../lib/util/help'

const strings = i18n('plugin-kubectl')
const debug = Debug('plugin-kubectl/controller/kubectl/explain')

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
    .replace(
      /(More info:\s+)?(https:\/\/.*)/,
      (_, _2, href) => `\n\n[Consult official Kubernetes documentation](${formatHref(href)})`
    )
}

function formatField(cmdline: string, _: string[]) {
  return {
    mode: _[1],
    contentType: 'text/markdown',
    content: `### Type
${_[2]}
### Documentation
${formatDocumentation(_[4])}

[Explain this field](#kuiexec?command=${encodeURIComponent(cmdline + '.' + _[1])})
`
  }
}

/** alternate patterns to match against */
const kvd = /^KIND:\s+(\S+)\nVERSION:\s+(\S+)(\n\nRESOURCE:\s+(\S+).*)?\n\nDESCRIPTION:\n(\s*DEPRECATED - )?([\s\S]+)/
const kvdf = /^KIND:\s+(\S+)\nVERSION:\s+(\S+)(\n\nRESOURCE:\s+(\S+).*)?\n\nDESCRIPTION:\n(\s*DEPRECATED - )?([\s\S]+)\n\nFIELDS:\n([\s\S]+)/
const kvfd = /^KIND:\s+(\S+)\nVERSION:\s+(\S+)\n\nFIELD:\s+(\S+)\s+(.*)\n\nDESCRIPTION:\n(\s*DEPRECATED - )?([\s\S]+)/

export const doExplain = (command = 'kubectl') =>
  async function(args: Arguments<KubeOptions>) {
    if (isUsage(args)) {
      // special case: get --help/-h
      return doHelp(command, args)
    }

    // first, we do the raw exec of the given command
    const response = await doExecWithStdout(args, undefined, command)

    try {
      // look first for a full Kind Version Description Fields;
      // otherwise, look for just Kind Version Description
      const match = response.match(kvdf) || response.match(kvd)
      const match2 = !match && response.match(kvfd)

      if (match || match2) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const kind = match ? match[1] : match2[1]
        const version = match ? match[2] : match2[2]
        const resource = match && match[4]
        const field = match2 && match2[3]
        const fieldType = match2 && match2[4]
        const isDeprecated = match ? match[5] : match2[5]
        const description = match ? match[6] : match2[6]
        const fields = match && match[7]
        // const [_, kind, version, _2, resource, isDeprecated, description, fields] = match

        const fieldSections = !fields
          ? []
          : fields
              .split(/\n\n/)
              .filter(_ => _)
              .map(_ => _.match(/\s*(\S+)\s+<(\S+)>( -required-)?\n\s*([\s\S]*)/))
              .filter(_ => _)

        const requiredFields = fieldSections.filter(_ => _[3])
        const notRequiredFields = fieldSections.filter(_ => !_[3])

        const topBreadcrumb: Breadcrumb = { label: 'API Resources', command: 'kubectl api-resources' }

        const apiGroup = version ? version.match(/^([^/]+)\//) : undefined
        const apiGroupBreadcrumb: Breadcrumb[] = !apiGroup
          ? []
          : [{ label: apiGroup[1], command: `kubectl api-resources --api-group ${apiGroup[1]}` }]

        const resourceBreadcrumb: Breadcrumb[] = !resource ? [] : [{ label: resource }]

        const fieldBreadcrumb: Breadcrumb[] = !match2 ? [] : [{ label: field }]

        const format = formatField.bind(undefined, args.command)

        return {
          apiVersion: 'kui-shell/v1',
          kind: 'NavResponse',
          breadcrumbs: [topBreadcrumb]
            .concat(apiGroupBreadcrumb)
            .concat([{ label: kind, command: resource || field ? `kubectl explain ${kind}` : '' }])
            .concat(resourceBreadcrumb)
            .concat(fieldBreadcrumb),
          menus: [
            {
              label: resource || kind,
              items: [
                {
                  mode: 'Overview',
                  contentType: 'text/markdown',
                  content: `### Description
#### ${description.replace(/\n/g, ' ')}
${
  match2
    ? `### Type\n${fieldType
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\[/g, '&#91;')
        .replace(/\]/g, '&#93;')}`
    : ''
}
### Version
${version}
${isDeprecated ? `### Warnings\n${strings('This API Resource is deprecated')}` : ''}
    `
                }
              ]
            }
          ]
            .concat(
              requiredFields.length === 0 ? [] : [{ label: 'Required Fields', items: requiredFields.map(format) }]
            )
            .concat(notRequiredFields.length === 0 ? [] : [{ label: 'Fields', items: notRequiredFields.map(format) }])
        }
      }
    } catch (err) {
      console.error('error parsing explaing', err)
    }

    return response
  }

/**
 * Cache of the getKind() lookup
 *
 */
const cache: Record<string, Promise<string>> = {}

/**
 * @param kindAsProvidedByUser e.g. pod or po
 * @return e.g. Pod
 *
 */
export async function getKind(command: string, args: Arguments, kindAsProvidedByUser: string): Promise<string> {
  if (!cache[kindAsProvidedByUser]) {
    // otherwise, we need to do a more expensive call to `kubectl`
    // eslint-disable-next-line no-async-promise-executor
    cache[kindAsProvidedByUser] = new Promise<string>(async (resolve, reject) => {
      try {
        const ourArgs = Object.assign({}, args, { command: `${command} explain ${kindAsProvidedByUser}` })
        const explained = await doExecWithStdout(ourArgs, undefined, command).catch(err => {
          // e.g. trying to explain CustomResourceDefinition.v1beta1.apiextensions.k8s.io
          // or a resource kind that does not exist
          debug(err)
          return `KIND: ${kindAsProvidedByUser}`
        })

        const kindFromServer = explained.match(/^KIND:\s+(.*)/)[1]
        resolve(kindFromServer)
      } catch (err) {
        if (!/does not exist/i.test(err.message)) {
          console.error(`error explaining kind ${kindAsProvidedByUser}`, err)
          reject(err)
        }
      }
    })
  }

  return cache[kindAsProvidedByUser]
}

export default (registrar: Registrar) => {
  const handler = doExplain()
  registrar.listen(`/${commandPrefix}/kubectl/explain`, handler, flags)
  registrar.listen(`/${commandPrefix}/k/explain`, handler, flags)
}
