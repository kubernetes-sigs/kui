/*
 * Copyright 2018 IBM Corporation
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

import * as Debug from 'debug'
const debug = Debug('core/webapp/util/ascii-to-usage')

import UsageError from '../../core/usage-error'
import { split } from '../../core/repl'

const sectionHeader = /([A-Z ]+):/
const matcher = /\n([A-Z ]+:)/

interface IOptions {
  drilldownWithPip?: boolean
}
class DefaultOptions implements IOptions {
  constructor () {
    // empty
  }
}

/**
 * Turn an array of strings into a table of command options;
 * e.g.
 *   foo  foo description
 *   bar  bar description
 *
 */
interface IPair {
  command: string
  alias?: string
  docs: string
}
const asciiToOptionsTable = (rows: Array<string>): Array<IPair> => {
  const table = rows.map(line => {
    const [command, docs] = line.split(/\s\s+/)

    const aliases = command.split(/,\s*/)

    if (docs) {
      return {
        command: aliases[0],
        aliases: aliases.length > 1 && aliases.slice(1),
        docs
      }
    }
  }).filter(x => x)

  return table.length > 0 && table
}

export const formatUsage = (command: string, str: string, options: IOptions = new DefaultOptions()) => {
  const rows = `\n${str}`.split(matcher)
  debug('rows', rows)

  if (rows.length > 2) {
    const sections = rows
      .slice(1)
      .reduce((groups, row) => {
        const maybeHeader = row.match(sectionHeader)
        debug('maybeHeader', row, maybeHeader, groups.length)

        if (maybeHeader) {
          groups.push({ title: maybeHeader[1].toLowerCase(), rows: [] })
        } else if (groups.length > 0) {
          const currentGroup = groups[groups.length - 1]

          debug('row', row, currentGroup.title)
          currentGroup.rows = row
            .split(/\n/)
            .filter(x => x)
            .map(line => line.trim())
        }

        return groups
      }, [])
    debug('sections', sections)

    if (sections.length > 0) {
      const nameSectionIdx = sections.findIndex(({ title }) => title.match(/Name/i))
      const usageSectionIdx = sections.findIndex(({ title }) => title.match(/Usage/i))

      const rest = sections
        .filter((_, idx) => idx !== nameSectionIdx && idx !== usageSectionIdx)
        .map(section => Object.assign(section, {
          nRowsInViewport: section.title.match(/Commands/i) ? 12 : 4, // try to fit in standard window height; no biggie if we're off
          rows: asciiToOptionsTable(section.rows) || section.rows.join('\n')
        }))

      const header = nameSectionIdx >= 0 && sections[nameSectionIdx].rows[0]
      const example = usageSectionIdx >= 0 && sections[usageSectionIdx].rows[0]
      debug('header', header, nameSectionIdx)
      debug('example', example, usageSectionIdx)

      const commandWithoutOptions = command.replace(/\s--?\w+/g, '')
      const breadcrumbs = split(commandWithoutOptions)
      debug('command', command)
      debug('breadcrumbs', breadcrumbs)

      debug('rest', rest)

      return new UsageError(Object.assign({
        command: breadcrumbs.pop(),
        parents: breadcrumbs,
        commandPrefix: command.replace(/(?<=\s)--?\w+/, ''),
        commandSuffix: '--help',
        header,
        example,
        sections: rest,
        preserveCase: true
      }, options))
    }
  }
}
