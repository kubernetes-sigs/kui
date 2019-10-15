/*
 * Copyright 2017 IBM Corporation
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
 * This plugin introduces a command history feature, and a few
 * commands to help with managing command history
 *
 */

import Debug from 'debug' // the default number of history elements to show with /history

import Commands from '@kui-shell/core/api/commands'
import Models from '@kui-shell/core/api/models'
import Tables from '@kui-shell/core/api/tables'

const debug = Debug('plugins/core-support/history')

const DEFAULT_HISTORY_N = 20

const parseN = str => {
  try {
    return parseInt(str, 10)
  } catch (e) {
    // ok
  }
}

const usage = {
  history: {
    command: 'history',
    strict: 'history',
    docs: 'List current command history, optionally filtering by a given string',
    example: 'history 100 filterString',
    optional: [
      { name: 'N', positional: true, docs: 'list the most recent N commands' },
      {
        name: 'filterString',
        positional: true,
        docs: 'filter command history'
      },
      { name: '--clear', alias: '-c', docs: 'clear your command history' }
    ]
  },

  again: (command: string) => ({
    command,
    strict: command,
    docs: 'Re-execute a given command index',
    example: `${command} 50`,
    optional: [
      {
        name: 'N',
        positional: true,
        docs: 're-execute the given history index N'
      }
    ]
  })
}

/**
 * Execute the command N again
 *
 */
const again = ({ REPL }: Commands.Arguments, N: number, historyEntry) => {
  debug('again', N, historyEntry)

  if (!Models.History.line(N)) {
    throw new Error('Could not find the command to re-execute')
  } else {
    // console.log('history::again', N, lines[N])
    Models.History.update(historyEntry, entry => {
      entry.raw = Models.History.line(N).raw
    })
    return REPL.qexec(Models.History.line(N).raw)
  }
}

/**
 * List current history
 *
 * Examples:
 *    history <N>                list the most recent N commands
 *    history <N> <filterStr>    look back at most N commands for those that contain filterStr
 *    history <filterStr>        look back at most 20 commands for those that contain filterStr
 *
 */
const showHistory = ({ argv, parsedOptions: options }) => {
  if (options.c) {
    debug('clearing command history')
    return Models.History.wipe()
  }

  const historyIdx = argv.indexOf('history')
  const Nargs = argv.length - historyIdx - 1
  const firstArgLooksLikeN = parseN(argv[historyIdx + 1])
  const Nidx = Nargs === 2 || firstArgLooksLikeN ? historyIdx + 1 : -1
  const N = Nidx > 0 ? firstArgLooksLikeN : DEFAULT_HISTORY_N

  // construct the filter
  const filterIdx = Nargs === 2 ? historyIdx + 2 : !firstArgLooksLikeN ? historyIdx + 1 : -1
  const filterStr = filterIdx > 0 && argv[filterIdx]
  const filter = filterStr ? line => line.raw.indexOf(filterStr) >= 0 : () => true

  const startIdx = Math.max(0, Models.History.cursor - N - 1)
  const endIdx = Models.History.cursor - 1
  const recent = Models.History.slice(startIdx, endIdx)

  debug('argv', argv)
  debug('Nargs', Nargs)
  debug('Nidx', Nidx)
  debug('N', N)
  debug('filterIdx', filterIdx)
  debug('filterStr', filterStr)
  debug('got', recent.length, startIdx, endIdx)

  const body: Tables.Row[] = recent
    .map((line, idx) => {
      if (!filter(line)) return

      // some commands can be super long... try to trim them down for the initial display
      const shortForm = line.raw.substring(0, line.raw.indexOf(' =')) || line.raw
      const whitespace = shortForm.indexOf(' ')
      const command = document.createElement('strong')
      const rest = document.createElement('span')

      command.innerText = shortForm.substring(0, whitespace === -1 ? shortForm.length : whitespace)
      if (whitespace !== -1) {
        rest.innerText = shortForm.substring(whitespace)
      }

      return new Tables.Row({
        beforeAttributes: [
          {
            key: 'N',
            value: `${startIdx + idx}`,
            css: 'deemphasize'
          }
        ],
        fullName: line.raw,
        name: line.raw,
        type: 'history',
        onclick: line.raw
      })
    })
    .filter(x => x)

  return new Tables.Table({
    type: 'history',
    noSort: true,
    body
  })
}

export default (commandTree: Commands.Registrar) => {
  debug('init')

  commandTree.listen('/history', showHistory, {
    usage: usage.history,
    inBrowserOk: true,
    noAuthOk: true
  })

  /** clear view or clear history */
  // commandTree.listen('/history/purge', Models.History.wipe, { docs: 'Clear your command history' })

  /** re-execute from history */
  const againCmd = () => (args: Commands.Arguments) => {
    const N = args.argv[1] ? parseInt(args.argv[1], 10) : Models.History.cursor - 2 // use the last command, if the user entered only "!!"
    console.error(args.execOptions)
    return again(args, N, args.execOptions && args.execOptions.history)
  }
  const cmd = commandTree.listen('/!!', againCmd(), {
    usage: usage.again('!!'),
    inBrowserOk: true,
    noAuthOk: true
  })
  commandTree.synonym('/again', againCmd(), cmd, {
    usage: usage.again('again'),
    inBrowserOk: true,
    noAuthOk: true
  })
}
