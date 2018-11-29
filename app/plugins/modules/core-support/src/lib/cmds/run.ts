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

import * as Debug from 'debug'
const debug = Debug('plugins/core-support/run')

import { readFile } from 'fs'
import { dirname } from 'path'

import * as expandHomeDir from 'expand-home-dir'

import * as repl from '../../../../../../build/core/repl'
import { findFile } from '../../../../../../build/core/find-file'
import { formatMultiListResult } from '../../../../../../build/webapp/views/table'

const promiseEach = async function (arr, status, idx: number) {
  const item = arr[idx]

  try {
    const thisResult = await repl.qexec(item)
    status[idx].value = 'Done'
    status[idx].css = status[idx].css.replace(/yellow-background/, 'green-background')
    status[idx].done = true
    status[idx].onclick = event => {
      event.stopPropagation()
      repl.pexec('show', {
        parameters: {
          command: item,
          success: true,
          content: thisResult
        }
      })
    }
  } catch (err) {
    const content = await Promise.resolve(err.message)
    const isWarning = (typeof content === 'string' ? content : err.raw.message).match(/already exists|already has/i)

    status[idx].value = isWarning ? 'Warning' : 'Error'
    if (!isWarning) {
      status[idx].css = status[idx].css.replace(/yellow-background/, 'red-background')
    }
    status[idx].done = true
    status[idx].onclick = async event => {
      event.stopPropagation()
      repl.pexec('show', {
        parameters: {
          command: item,
          success: false,
          content
        }
      })
    }
  }

  if (idx < arr.length - 1) {
    return promiseEach(arr, status, idx + 1)
  }
}

const doRun = ({ argv }) => new Promise((resolve, reject) => {
  const filepath = argv[argv.indexOf('run') + 1]
  const fullpath = findFile(expandHomeDir(filepath))
  const parent = dirname(fullpath)

  const injectVariables = (str: string): string => {
    return str.replace(/\$\{cwd\}/g, parent)
  }

  //
  // first read the command file
  //
  readFile(fullpath, async (err, data) => {
    if (err) {
      reject(err)
    } else {
      //
      // evaluate each line, careful that each repl.pexec is an async
      //
      try {
        const lines = data
          .toString()
          .replace(/\s*#.*/mg, '')
          .split(/\n+/)
          .filter(x => x)
        debug('lines', lines)

        // done status for each row
        let status = lines.map(_ => ({
          value: 'Pending',
          css: 'yellow-background even-smaller-text'
        }))

        const table = lines
          .map((line, idx) => ({
            name: line,
            type: 'run',
            outerCSS: 'entity-name-group',
            css: 'entity-name',
            onclick: false,
            noSort: true,
            attributes: [{
              tag: 'badge',
              key: 'status',
              value: 'Pending',
              css: 'yellow-background even-smaller-text',
              outerCSS: '',
              watch: () => status[idx]
            }]
          }))

        promiseEach(lines.map(injectVariables), status, 0)

        const headerRow = [{
          name: 'COMMAND',
          type: 'run',
          noSort: true,
          outerCSS: 'header-cell',
          attributes: [
            { key: 'status', value: 'STATUS', outerCSS: 'header-cell very-narrow not-too-wide min-width-6em text-center' }
          ]
        }]

        resolve(headerRow.concat(table))
      } catch (err) {
        reject(err)
      }
    }
  })
})

/**
 * Usage model
 *
 */
const usage = {
  command: 'run',
  strict: 'run',
  example: 'run commandFile',
  docs: 'Evaluate shell commands in a given file',
  required: [
    { name: 'commandFile', docs: 'A file of commands to execute', file: true }
  ]
}

export default (commandTree, prequire) => {
  commandTree.listen('/run', doRun, { usage })
  commandTree.listen('/show',
                     ({ execOptions }) => {
                       debug('show', execOptions)
                       if (!execOptions || !execOptions.parameters) {
                         throw new Error('Nothing to show')
                       }

                       const { command, content: commandOutput } = execOptions.parameters

                       const commandName = command.substring(0, command.indexOf(' ')).trim()
                       const commandRest = command.substring(command.indexOf(' ')).trim()

                       const content = document.createElement('div')
                       content.classList.add('code-highlighting')
                       content.classList.add('scrollable')
                       content.classList.add('scrollable-auto')

                       const scrollInner = document.createElement('pre')
                       scrollInner.classList.add('padding-content')
                       content.appendChild(scrollInner)

                       if (Array.isArray(commandOutput)) {
                         const container = document.createElement('div')
                         container.classList.add('result-as-table')
                         scrollInner.appendChild(container)

                         formatMultiListResult(!Array.isArray(commandOutput[0]) ? [commandOutput] : commandOutput,
                                               container)

                         return {
                           type: 'custom',
                           prettyType: commandName,
                           isEntity: true,
                           name: commandRest,
                           content
                         }
                       } else {
                         if (typeof commandOutput === 'string') {
                           scrollInner.innerText = commandOutput
                         } else {
                           scrollInner.appendChild(commandOutput)
                         }

                         return {
                           type: 'custom',
                           prettyType: commandName,
                           isEntity: true,
                           name: commandRest,
                           content
                         }
                       }
                     },
                     { hidden: true })
}
