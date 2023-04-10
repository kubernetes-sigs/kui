/*
 * Copyright 2017 The Kubernetes Authors
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

import type { Arguments, Registrar, Row } from '@kui-shell/core'

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
const again = async ({ tab, REPL }: Arguments, N: number, historyEntry) => {
  const debug = Debug('plugins/core-support/history')
  debug('again', N, historyEntry)

  const { History } = await import('@kui-shell/core/mdist/api/History')
  const history = await History(tab)
  if (!history.line(N)) {
    throw new Error('Could not find the command to re-execute')
  } else {
    // console.log('history::again', N, lines[N])
    history.update(historyEntry, entry => {
      entry.raw = history.line(N).raw
    })
    return REPL.qexec(history.line(N).raw)
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
const showHistory = async ({ tab, argv, parsedOptions: options }) => {
  const { Row, Table } = await import('@kui-shell/core/mdist/api/Table')
  const { History } = await import('@kui-shell/core/mdist/api/History')
  const history = await History(tab)

  if (options.c) {
    const debug = Debug('plugins/core-support/history')
    debug('clearing command history')
    return history.wipe()
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

  const startIdx = Math.max(0, history.cursor - N - 1)
  const endIdx = history.cursor - 1
  const recent = history.slice(startIdx, endIdx)

  const debug = Debug('plugins/core-support/history')
  debug('argv', argv)
  debug('Nargs', Nargs)
  debug('Nidx', Nidx)
  debug('N', N)
  debug('filterIdx', filterIdx)
  debug('filterStr', filterStr)
  debug('got', recent.length, startIdx, endIdx)

  const body: Row[] = recent
    .map((line, idx) => {
      if (!filter(line)) return null

      // some commands can be super long... try to trim them down for the initial display
      const shortForm = line.raw.substring(0, line.raw.indexOf(' =')) || line.raw
      const whitespace = shortForm.indexOf(' ')
      const command = document.createElement('strong')
      const rest = document.createElement('span')

      command.innerText = shortForm.substring(0, whitespace === -1 ? shortForm.length : whitespace)
      if (whitespace !== -1) {
        rest.innerText = shortForm.substring(whitespace)
      }

      return new Row({
        attributes: [
          {
            key: 'N',
            value: `${startIdx + idx}`
          }
        ],
        fullName: line.raw,
        name: line.raw,
        onclick: line.raw
      })
    })
    .filter(x => x)

  return new Table({
    noSort: true,
    body
  })
}

export default (commandTree: Registrar) => {
  commandTree.listen('/history', showHistory, {
    usage: usage.history
  })

  /** clear view or clear history */
  // commandTree.listen('/history/purge', Models.History.wipe, { docs: 'Clear your command history' })

  /** re-execute from history */
  const againCmd = () => async (args: Arguments) => {
    const { History } = await import('@kui-shell/core/mdist/api/History')
    const history = await History(args.tab)
    const N = args.argv[1] ? parseInt(args.argv[1], 10) : history.cursor - 2 // use the last command, if the user entered only "!!"
    const debug = Debug('plugins/core-support/history')
    debug('againCmd', args.execOptions)
    return again(args, N, args.execOptions && args.execOptions.history)
  }
  const cmd = commandTree.listen('/!!', againCmd(), {
    usage: usage.again('!!')
  })
  commandTree.synonym('/again', againCmd(), cmd, {
    usage: usage.again('again')
  })
}
