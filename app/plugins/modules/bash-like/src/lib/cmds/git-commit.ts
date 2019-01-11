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
const debug = Debug('plugins/bash-like/cmds/git-commit')

import { join } from 'path'
import { writeFile } from 'fs'
import { spawn } from 'child_process'
import * as expandHomeDir from 'expand-home-dir'

import eventBus from '@kui/core/events'
import { inBrowser } from '@kui/core/capabilities'
import { qexec } from '@kui/core/repl'
import { clearSelection as clearSidecar, showEntity as showInSidecar } from '@kui/webapp/views/sidecar'

import { handleNonZeroExitCode } from '../util/exec'
import { asSidecarEntity } from '../util/sidecar-support'
import { status2Html } from './git-status'
import { status, toplevel } from '../util/git-support'

/**
 * TODO refactor
 *
 */
const doExec = ({ command, argvNoOptions, execOptions }) => new Promise(async (resolve, reject) => {
  // purposefully imported lazily, so that we don't spoil browser mode (where shell is not available)
  const shell = await import('shelljs')

  // spawn the git status
  const proc = shell.exec(command, {
    async: true,
    silent: true
  })

  let rawOut = ''
  let rawErr = ''
  proc.stdout.on('data', data => {
    rawOut += data.toString()
  })
  proc.stderr.on('data', data => {
    rawErr += data.toString()
  })
  proc.on('close', exitCode => {
    if (exitCode === 0) {
      // note: no sidecar header if this launched from the command line ("subwindow mode")
      debug('done with 0 exit code', rawOut)
      resolve(asSidecarEntity(command, rawOut, {
        sidecarHeader: !document.body.classList.contains('subwindow')
      }))
    } else {
      try {
        debug('done with non-zero exit code', exitCode, rawErr)
        if (rawOut.match(/On branch/)) {
          resolve(asSidecarEntity(argvNoOptions.join(' '), status2Html(rawOut), {
            sidecarHeader: !document.body.classList.contains('subwindow')
          }))
        } else {
          resolve(handleNonZeroExitCode(command, exitCode, rawOut, rawErr, execOptions))
        }
      } catch (err) {
        reject(err)
      }
    }
  })
})

/**
 * git commit command handler
 *
 */
const doCommit = async opts => {
  const { command, argvNoOptions, parsedOptions, execOptions } = opts

  if (argvNoOptions.length === 3 &&
      !(parsedOptions.F || parsedOptions.file ||
        parsedOptions.message || parsedOptions.m ||
        parsedOptions.help)) {
    const file = argvNoOptions[argvNoOptions.length - 1]
    return new Promise(async (resolve, reject) => {
      try {
        const [ commentedStatus, toplevelDir ] = await Promise.all([ status(), toplevel() ])

        const msg = `
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
${commentedStatus}`

        const filepath = join(toplevelDir, '.git', 'COMMIT_EDITMSG')
        debug('filepath', filepath)
        writeFile(filepath, msg, async err => {
          if (err) {
            console.error(err)
            reject(err)
          } else {
            const execOptions = {}
            execOptions['cursorPosition'] = 'start'
            execOptions['language'] = 'shell' // use bash coloring scheme

            eventBus.once('/editor/save', (model, { event }) => {
              if (event === 'save') {
                debug('got save event', model)
                clearSidecar()

                if (model.exec.code === msg) {
                  debug('empty commit message')
                  reject('Aborting commit due to empty commit message.')
                } else {
                  // continue with the actual commit
                  resolve(qexec(`${command} --file "${filepath}"`))
                }
              }
            })

            const editor = await qexec(`edit ${filepath}`, undefined, undefined, execOptions)
            debug('editor', editor)
            showInSidecar(editor)
          }
        })
      } catch (err) {
        console.error(err)
        reject(err)
      }
    })
  } else {
    debug('delegating to outer git commit')
    return doExec(opts)
  }
}

/**
 * Register command handlers
 *
 */
export default (commandTree, prequire) => {
  if (!inBrowser()) {
    commandTree.listen('/git/commit', doCommit, { needsUI: true })
  }
}
