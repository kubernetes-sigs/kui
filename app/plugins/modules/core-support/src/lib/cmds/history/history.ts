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

import * as Debug from 'debug'
const debug = Debug('plugins/core-support/history')
debug('loading')

const DEFAULT_HISTORY_N = 20 // the default number of history elements to show with /history

import * as historyModel from '../../../../../../../build/models/history'
import UsageError from '../../../../../../../build/core/usage-error'
import * as repl from '../../../../../../../build/core/repl'

const parseN = str => {
  try {
    return parseInt(str, 10)
  } catch (e) {
    // ok
  }
}

const usage = {
  history: `List current history, optionally filtering by a given string.

Examples:
   history              list the most recent ${DEFAULT_HISTORY_N} commands
   history <N>          list the most recent N commands
   history <N> <str>    filter the most recent N commands, showing only those that contain the given string
   history <str>        ibid, but using the default of N=${DEFAULT_HISTORY_N}`,

  again: op => `Re-execute a given command index.

Examples:
   ${op}                  re-execute the previous comman
   ${op} <N>              ibid, but at the given history index; hint: use history to list recently executed commands`
}

/**
 * Execute the command N again
 *
 */
const again = (N: number, historyEntry) => {
  debug('again', N, historyEntry)

  if (!historyModel.lines[N]) {
    throw new Error('Could not find the command to re-execute')
  } else {
    // console.log('history::again', N, lines[N])
    historyModel.update(historyEntry, entry => {
      entry.raw = historyModel.lines[N].raw
    })
    return repl.qfexec(historyModel.lines[N].raw)
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
  if (options.help) {
    throw new UsageError(usage.history)
  }

  const historyIdx = argv.indexOf('history')
  const Nargs = argv.length - historyIdx - 1
  const firstArgLooksLikeN = parseN(argv[historyIdx + 1])
  const Nidx = Nargs === 2 || firstArgLooksLikeN ? historyIdx + 1 : -1
  const N = Nidx > 0 ? firstArgLooksLikeN : DEFAULT_HISTORY_N
  const filterIdx = Nargs === 2 ? historyIdx + 2 : !firstArgLooksLikeN ? historyIdx + 1 : -1
  const filterStr = filterIdx > 0 && argv[filterIdx]
  const filter = filterStr ? line => !line.raw.startsWith('history') && line.raw.indexOf(filterStr) >= 0 : () => true // ignore history commands if a filterStr is specified

  const startIdx = Math.max(0, historyModel.getCursor() - N - 1)
  const endIdx = historyModel.getCursor() + 1
  const recent = historyModel.lines.slice(startIdx, endIdx)

  debug('argv', argv)
  debug('Nargs', Nargs)
  debug('Nidx', Nidx)
  debug('N', N)
  debug('filterIdx', filterIdx)
  debug('filterStr', filterStr)

  return recent.map((line, idx) => {
    if (!filter(line)) return

    // some commands can be super long... try to trim them down for the initial display
    const shortForm = line.raw.substring(0, line.raw.indexOf(' =')) || line.raw
    const whitespace = shortForm.indexOf(' ')
    const shortFormPretty = document.createElement('span')
    const command = document.createElement('strong')
    const rest = document.createElement('span')

    shortFormPretty.appendChild(command)
    shortFormPretty.appendChild(rest)
    command.innerText = shortForm.substring(0, whitespace === -1 ? shortForm.length : whitespace)
    if (whitespace !== -1) {
      rest.innerText = shortForm.substring(whitespace)
    }

    return Object.assign({}, line, {
      beforeAttributes: [ {
        key: 'N',
        value: `${startIdx + idx}`,
        css: 'deemphasize'
      } ],
      fullName: line.raw,
      name: shortFormPretty,
      noSort: true,
      onclick: () => repl.pexec(line.raw)
    })
  }).filter(x => x)
}

export default (commandTree, prequire) => {
  debug('init')

  commandTree.listen('/history', showHistory, { docs: 'Show recently executed commands' })

  /** clear view or clear history */
  commandTree.listen('/history/purge', historyModel.wipe, { docs: 'Clear your command history' })

  /** re-execute from history */
  const againCmd = op => ({ argv, execOptions, parsedOptions: options }) => {
    const N = argv[1] || historyModel.getCursor() - 2 // use the last command, if the user entered only "!!"
    console.error(execOptions)
    return again(N, execOptions && execOptions.history)
  }
  const cmd = commandTree.listen('/!!',
    againCmd('!!'),
    { docs: 'Re-execute the last command, or, with !! N, the command at history position N ' })
  commandTree.synonym('/again', againCmd('again'), cmd)
}
