/*
 * Copyright 2018-20 IBM Corporation
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
import {
  Arguments,
  NavResponse,
  Table,
  TableStyle,
  KResponse,
  MultiModalMode,
  Menu,
  Link,
  i18n,
  Breadcrumb
} from '@kui-shell/core'

import { KubeOptions, isHelpRequest } from '../../controller/kubectl/options'
import commandPrefix from '../../controller/command-prefix'
import { doExecWithoutPty, Prepare, NoPrepare } from '../../controller/kubectl/exec'

const debug = Debug('kubectl/help')
const strings = i18n('plugin-kubectl')

/**
 * Some of the kubectl doc strings try to be polite have form
 * sentences with a trailing period. In a visual form, as long as it
 * is a single sentence, this is less necessary.
 *
 */
const removeSolitaryAndTrailingPeriod = (str: string) => str.replace(/^\s*([^.]+)[.]\s*$/, '$1').trim()

/** format a DetailedExample as markdown */
function formatAsMarkdown({ command, docs }: { command: string; docs: string }): string {
  return `
### Example
\`\`\`
${command}
\`\`\`

${docs}
`
}

const commandDocTable = (
  rows: { command: string; docs: string }[],
  kubeCommand: string,
  verb: string,
  headerKey: 'OPTIONS' | 'COMMAND',
  style = TableStyle.Light
): Table => ({
  noSort: true,
  noEntityColors: true,
  style,
  header: {
    name: headerKey,
    attributes: [{ value: 'DOCS' }]
  },
  body: rows.map(({ command, docs }) => ({
    name: command,
    css: headerKey === 'COMMAND' ? 'clickable semi-bold map-key' : 'sub-text',
    onclick: headerKey === 'COMMAND' ? `${kubeCommand}${verb ? ` ${verb}` : ''} ${command} -h` : undefined,
    attributes: [{ key: 'DOCS', value: docs, css: 'map-value' }]
  }))
})

interface Section {
  title: string
  content: string
}

/** Produce a Breadcrumb */
function breadcrumb(label: string, hasCommand = true, ...commandContext: string[]): Breadcrumb[] {
  return !label ? [] : [{ label, command: hasCommand ? `${commandContext.join(' ')} ${label} -h` : undefined }]
}

/**
 * Pretty-print the kubectl help output
 *
 * @param command e.g. helm versus kubectl
 * @param verb e.g. list versus get
 * @param entityType e.g. pod versus deployment
 *
 */
export const renderHelp = (out: string, command: string, verb: string, entityType?: string): NavResponse | Table => {
  // kube and helm help often have a `Use "this command" to do that operation`
  // let's pick those off and place them into the detailedExample model
  const splitOutUse = out.match(/^(Use\s+.+)$/gm)
  const nonUseOut = !splitOutUse ? out : out.substring(0, splitOutUse.index) // having stripped off the Use parts

  // the Use parts, if any, formatted into a markdown list
  const usePart =
    splitOutUse &&
    splitOutUse
      .filter(_ => !_.includes('Use "kubectl options"')) // `kubectl options` is incorporated as one of the base modes of `kubectl` usage
      .map(_ =>
        _.replace(
          /"([^"]+)"/g,
          (_, command) => `[${command}](kui://exec?command=${encodeURIComponent(command)} "Execute ${command}")`
        )
      )
      // .map(_ => ` - ${_}`)
      .join('\n')

  const rawSections = nonUseOut.split(/\n\n([^'\s].*:)\n(?!\n)/) // the non-use sections of the docs

  // the first section is the top-level doc string
  const headerEnd =
    !splitOutUse || splitOutUse.length === 0 ? rawSections[0].length : rawSections[0].indexOf(splitOutUse[0])
  const header = rawSections[0].slice(0, headerEnd)

  const processSections = (section: Section) => ({
    title: section.title,
    nRowsInViewport: section.title.match(/Available Commands/i) ? 8 : undefined,
    rows: section.content
      .split(/[\n\r]/)
      .filter(x => x)
      .map(line => {
        const [_, thisCommand, docs] = line.match(/\s*(\S+)\s+(.*)/) // eslint-disable-line @typescript-eslint/no-unused-vars
        if (thisCommand) {
          return {
            command: thisCommand.replace(/^\s*-\s+/, '').replace(/:\s*$/, ''),
            docs: docs && docs.replace(/^\s*:\s*/, ''),
            commandPrefix: /Commands/i.test(section.title) && `${command} ${verb || ''}`,
            noclick: !section.title.match(/Common actions/i) && !section.title.match(/Commands/i)
          }
        }
      })
      .filter(x => x)
  })

  // return a table for `kubectl options`
  if (verb === 'options') {
    const optionDocs = header.split('\n\n')
    const sections = processSections({ title: optionDocs[0], content: optionDocs[1].replace(/^\n/, '') })
    return commandDocTable(sections.rows, command, verb, 'OPTIONS', TableStyle.Medium)
  }

  // for the remaining sections, form a [{ title, content }] model
  const allSections: Section[] = rawSections.slice(1).reduce((S, _, idx, sections) => {
    if (idx % 2 === 0) {
      S.push({
        title: sections[idx],
        content: sections[idx + 1].replace(/^\n/, '')
      })
    }

    return S
  }, [])

  // aliases section
  const aliasesSection = allSections.find(({ title }) => title === 'Aliases:')

  // pull off the Usage section and place it into our usage model
  const usageSection = allSections.filter(({ title }) => title === 'Usage:')

  // pull off the Examples section
  const examplesSection = allSections.find(({ title }) => title === 'Examples:')

  const remainingSections = allSections
    // .slice(firstSectionIsCommandLike ? 0 : 1)
    .filter(({ title }) => title !== 'Usage:' && title !== 'Examples:')

  const sections = remainingSections.map(processSections)

  const detailedExample = (examplesSection ? examplesSection.content : '')
    .split(/^\s*(?:#\s+)/gm)
    .map(x => x.trim())
    .filter(x => x)
    .map(group => {
      //
      // Explanation: compare `kubectl completion -h` to `kubectl get -h`
      // The former Examples section has a structure of (Summary, MultiLineDetail)
      // while the latter is shaped like (DescriptionLine, CommandLine).
      //
      // The lack of symmetry is a bit odd (detail/description
      // is second versus first), but understandable, given
      // that the former's Detail takes up multiple lines
      // whereas the latter has a pair of lines. Let's
      // introduce some symmetry here.
      //
      const match = group.match(/(.*)[\n\r]([\s\S]+)/)
      if (match && match.length === 3) {
        const [, firstPartFull, secondPartFull] = match

        const firstPart = removeSolitaryAndTrailingPeriod(firstPartFull)
        const secondPart = removeSolitaryAndTrailingPeriod(secondPartFull)

        const secondPartIsMultiLine = secondPart.split(/[\n\r]/).length > 1

        const command = secondPartIsMultiLine ? firstPart : secondPart
        const docs = secondPartIsMultiLine ? secondPart : firstPart

        return {
          command,
          docs
        }
      } else {
        // see kubectl label -h for an example of a multi-line "firstPart"
        return {
          copyToNextLine: group
        }
      }
    })
    .reduce((lines, lineRecord, idx, A) => {
      for (let jdx = idx - 1; jdx >= 0; jdx--) {
        if (A[jdx].copyToNextLine) {
          lineRecord.docs = `${A[jdx].copyToNextLine}\n${lineRecord.docs}`
        } else {
          break
        }
      }

      if (!lineRecord.copyToNextLine) {
        lines.push(lineRecord)
      }
      return lines
    }, [])
    .filter(x => x)

  /* Here comes Usage NavResponse */
  const kind = 'MultiModalResponse'
  const metadata = { name: 'usage' }

  const baseModes = (): MultiModalMode[] => [
    {
      mode: strings('Introduction'),
      content: header
        .replace(/\n\s*(IMPORTANT:)([^\n]+)/, `\n> **$1**$2`)
        .replace(/(\s)(NOT)(\s)/g, '$1**$2**$3')
        .replace(
          /(:\n\n\s*)((([^,\n])+,)+[^,\n]+)/g,
          (_, m1, m2) =>
            `${m1}${m2
              .split(/,/)
              .map(_ => ` - ${_}`)
              .join('\n')}\n`
        )
        .concat('\n\n')
        .replace(/(--\S+)/g, '`$1`')
        .replace(/^\n*([^\n.]+)(\.?)/, '### About\n#### $1')
        .replace(/\n\s*(Find more information at:)\s+([^\n]+)/, '') // [Find more information] will be in links below the menus
        .concat(!aliasesSection ? '' : `### Aliases\n${aliasesSection.content}`)
        .concat(
          `
### Usage
\`\`\`
${usageSection[0].content.slice(0, usageSection[0].content.indexOf('\n')).trim()}
\`\`\`
`
        )
        .concat(usePart && usePart.length > 0 ? `### Guide\n${usePart}` : ''),
      contentType: 'text/markdown'
    }
  ]

  const optionsMenuItems = (): MultiModalMode[] => {
    if (verb === '') {
      // kubectl
      return [
        {
          mode: strings('Options'),
          contentFrom: 'kubectl options'
        }
      ]
    } else if (sections.some(section => /Flags|Options/i.test(section.title))) {
      return sections
        .filter(section => /Flags|Options/i.test(section.title))
        .map(section => {
          return {
            mode: section.title.replace(':', ''),
            content: commandDocTable(section.rows, command, verb, 'OPTIONS', TableStyle.Medium)
          }
        })
    } else {
      return []
    }
  }

  /** headerNav contains sections: About and Usage */
  const headerMenu = (title: string): Menu => ({
    [title]: {
      kind,
      metadata,
      modes: baseModes().concat(optionsMenuItems())
    }
  })

  /** commandNav contains sections: Commands */
  const commandMenu = (): Menu => {
    if (sections.some(section => /command/i.test(section.title))) {
      return {
        [strings('Commands')]: {
          kind,
          metadata,
          modes: sections
            .filter(section => /command/i.test(section.title))
            .map(section => {
              return {
                mode: section.title.replace(/Command(s)/, '').replace(':', ''),
                content: commandDocTable(section.rows, command, verb, 'COMMAND')
              }
            })
        }
      }
    }
  }

  /** header nav contains sections: Examples */
  const exampleMenu = () => {
    if (detailedExample && detailedExample.length > 0) {
      return {
        [strings('Examples')]: {
          kind,
          metadata,
          modes: detailedExample.map(_ => ({
            // e.g.
            //  - kubectl get ... -> get ...
            //  - kubectl create clusterrole ... -> clusterrole ...
            mode: _.command.replace(new RegExp(`^${command}\\s+${entityType ? verb : ''}`), ''),
            contentType: 'text/markdown',
            content: formatAsMarkdown(_)
          }))
        }
      }
    }
  }

  const menus = [headerMenu(strings('Usage')), commandMenu(), exampleMenu()].filter(x => x)

  debug('menus', menus)

  // parse links from help
  const getLinksFromHelp = (): Link[] => {
    // parse `Find more information at:` link from header
    const getMoreInfoLinkFromHeader = (header: string) => {
      const moreInfoTerm = 'Find more information at: '
      const splitOutNonLink = () => {
        return header.split(moreInfoTerm)[1].split('\n')[0]
      }

      if (header.includes(moreInfoTerm)) {
        return {
          label: strings('More Information'),
          href: splitOutNonLink()
        }
      }
    }
    return [getMoreInfoLinkFromHeader(header)].filter(x => x)
  }

  // notes: the second breadcrumb hasCommand only if we have an
  // entityType; e.g. `kubectl create` -> the second breadcrumb should
  // not be a clickable; whereas with `kubectl create clusterrole` ->
  // the second breadcrumb should be clickable
  const breadcrumbs = breadcrumb(command)
    .concat(breadcrumb(verb, !!entityType, command))
    .concat(breadcrumb(entityType, false, command, verb))

  return {
    apiVersion: 'kui-shell/v1',
    kind: 'NavResponse',
    menus,
    breadcrumbs,
    links: getLinksFromHelp()
  }
}

/** is the given string `str` the `kubectl` command? */
const isKubectl = (args: Arguments<KubeOptions>) =>
  (args.argvNoOptions.length === 1 && /^k(ubectl)?$/.test(args.argvNoOptions[0])) ||
  (args.argvNoOptions.length === 2 &&
    args.argvNoOptions[0] === commandPrefix &&
    /^k(ubectl)?$/.test(args.argvNoOptions[1]))

export const isUsage = (args: Arguments<KubeOptions>) => isHelpRequest(args) || isKubectl(args)

export async function doHelp<O extends KubeOptions>(
  command: string,
  args: Arguments<O>,
  prepare: Prepare<O> = NoPrepare
): Promise<KResponse> {
  const response = await doExecWithoutPty(args, prepare, command)
  const verb = args.argvNoOptions.length >= 2 ? args.argvNoOptions[1] : ''
  const entityType = args.argvNoOptions.length >= 3 ? args.argvNoOptions[2] : ''
  return renderHelp(response.content.stdout, command, verb, entityType)
}
