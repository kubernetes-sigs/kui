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
const debug = Debug('plugins/bash-like/cmds/git-status')

import * as path from 'path'
import { spawn } from 'child_process'

import { partial } from '@kui-shell/core/webapp/cli'
import { pexec } from '@kui-shell/core/core/repl'
import pip from '@kui-shell/core/webapp/picture-in-picture'
import { CommandRegistrar } from '@kui-shell/core/models/command'

import { handleNonZeroExitCode } from '../util/exec'
import { asSidecarEntity } from '../util/sidecar-support'
import { onbranch, injectCSS } from '../util/git-support'

const modified = `<svg aria-hidden="true" class="d2h-icon d2h-changed" height="16" title="modified" version="1.1" viewBox="0 0 14 16" width="14"><path d="M13 1H1C0.45 1 0 1.45 0 2v12c0 0.55 0.45 1 1 1h12c0.55 0 1-0.45 1-1V2c0-0.55-0.45-1-1-1z m0 13H1V2h12v12zM4 8c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z"></path></svg>`

/**
 * Look for modified: and turn them into git diff links
 *
 */
export const status2Html = (rawOut: string, stats: Promise<Stats> = numstat()): HTMLElement => {
  injectCSS()

  const mods = rawOut
    .replace(/^\s*\(use .*\)$/mg, '___nope___')
    .replace(/^(\s+)([^:\s]+)$/mg, `<div class='entity'><div class='entity-attributes'><span class='repl-pexec-link do-not-overflow clickable clickable-blatant small-bottom-pad' data-file='$2' data-partial data-command='git add'>$2</span></div></div>`)
    .replace(/^(\s+)(modified:|new file:|deleted:)(\s+)(.*)$/mg,
             `<div class='entity'><div class='entity-attributes'>$2<span class='repl-pexec-link do-not-overflow clickable clickable-blatant small-bottom-pad' data-file='$4'>$4</span><span class='d2h-file-stats-wrapper'><span class='d2h-file-stats double-icon-width' data-file='$4'><span class='d2h-lines-added'></span><span class='d2h-lines-deleted'></span></span></span></div></div>`)
    .replace(/(On branch\s+)(.*)\n/, '') // $1<strong>$2</strong>
    .replace(/(Changes to be committed:|Changes not staged for commit:)/g, `</div></div></div><div class='result-table-outer top-pad'><div class='result-table-title-outer'><div class='repl-pexec-link clickable result-table-title' data-file='.'>$1</div></div><div class='result-table'>`)
    .replace(/(Untracked files:)/g, `</div></div></div><div class='result-table-outer top-pad'><div class='result-table-title-outer'><div class='repl-pexec-link clickable result-table-title' data-file='.'>$1</div></div><div class='result-table'>`)
    .replace(/modified:/g, `<span class='yellow-text larger-text icon-width'><i class="fas fa-file"></i></span>`)
    .replace(/new file:/g, `<span class='green-text larger-text icon-width'><i class='fas fa-file-medical'></i></i></span>`)
    .replace(/deleted:/g, `<span class='red-text larger-text icon-width'><i class='far fa-file'></i></i></span>`)
    .replace(/\s*(nothing added to commit but untracked files present|no changes added to commit.*)/, `</div></div><div class='top-pad'>$1</div>`)
    .replace(/___nope___(\r\n|\r|\n)/g, '')

  const wrapper = document.createElement('div') as HTMLElement
  wrapper.classList.add('result-as-table')
  wrapper.classList.add('result-as-fixed-tables')
  wrapper.innerHTML = mods

  stats.then(stats => {
    const statElements = wrapper.querySelectorAll('.d2h-file-stats')
    debug('statElements', statElements, stats)

    for (let idx = 0; idx < statElements.length; idx++) {
      const elt = statElements[idx]
      const file = elt.getAttribute('data-file')
      const stat = stats[file]

      debug('file', file, stat)
      if (stat) {
        const added = elt.querySelector('.d2h-lines-added') as HTMLElement
        const deleted = elt.querySelector('.d2h-lines-deleted') as HTMLElement

        added.innerText = stat.added === '0' ? stat.added : `+${stat.added}`
        deleted.innerText = stat.deleted === '0' ? stat.deleted : `-${stat.deleted}`
      } else {
        elt.parentNode.removeChild(elt)
      }
    }
  })

  const pexecs = wrapper.querySelectorAll('.repl-pexec-link')
  for (let idx = 0; idx < pexecs.length; idx++) {
    const exec = pexecs[idx] as HTMLElement
    const file = path.resolve(exec.getAttribute('data-file'))
    const command = exec.getAttribute('data-command') || 'git diff'
    const isPartial = exec.hasAttribute('data-partial')

    // the `file` is an absolut epath (see above); but, when rendering
    // in the CLI, try to make the displayed path relative to the
    // current working directory
    const relpath = path.relative(process.cwd(), file)

    if (isPartial) {
      exec.onclick = () => partial(`${command} ${relpath}`)
    } else {
      exec.onclick = (event: MouseEvent) => {
        // Notes: to distinguish between a click and a text
        // selection... well... clicks *will* clear the text
        // selection, but only after this event, for some reason;
        // hence the setTimeout followed by a check for
        // no-text-selected.
        setTimeout(() => {
          if (noCurrentTextSelection()) {
            return pip(`${command} ${relpath}`, undefined, wrapper.parentNode.parentNode as Element, 'git status')(event)
          }
        }, 0)
      }
    }
  }

  return wrapper
}

/**
 * Is no text currently selected?
 *
 */
const noCurrentTextSelection = () => window.getSelection().toString().trim().length === 0

/**
 * git status command handler
 *
 */
const doStatus = async ({ command, execOptions }) => new Promise(async (resolve, reject) => {
  const stats = numstat()
  const currentBranch = onbranch()

  // purposefully imported lazily, so that we don't spoil browser mode (where shell is not available)
  const shell = await import('shelljs')

  // spawn the git status
  const proc = shell.exec(command, {
    async: true,
    silent: true
  })

  let rawOut = ''
  let rawErr = ''
  proc.stdout.on('data', (data: Buffer) => {
    rawOut += data.toString()
  })
  proc.stderr.on('data', (data: Buffer) => {
    rawErr += data.toString()
  })
  proc.on('close', exitCode => {
    if (exitCode === 0) {
      // note: no sidecar header if this launched from the command line ("subwindow mode")
      resolve(asSidecarEntity('git status', status2Html(rawOut, stats), {
      }, undefined, 'statuss', currentBranch)) // intentional additional s at the end
    } else {
      try {
        return handleNonZeroExitCode(command, exitCode, rawOut, rawErr, execOptions)
      } catch (err) {
        reject(err)
      }
    }
  })
})

/**
 * git diff --numstat row; we will consume these numbers as strings, so no need to parseInt them
 *
 */
interface IStat {
  added: string
  deleted: string
}
type Stats = { [key: string]: IStat }
const numstat = (): Promise<Stats> => new Promise<Stats>((resolve, reject) => {
  const child = spawn('git', ['diff', '--numstat']) // `--relative=${path.basename(process.cwd())}`])

  let rawOut = ''
  child.stdout.on('data', data => {
    rawOut += data.toString()
  })

  let rawErr = ''
  child.stderr.on('data', data => {
    rawErr += data.toString()
  })

  child.on('close', exitCode => {
    if (exitCode !== 0) {
      reject(rawErr)
    } else {
      /* e.g., where the columns are Added and Deleted
        18      7       app/content/css/ui.css
        16      16      app/plugins/modules/bash-like/src/lib/cmds/git-diff.ts
        14      6       app/plugins/modules/bash-like/src/lib/cmds/git-status.ts
        30      2       app/src/core/usage-error.ts
        7       5       app/src/webapp/util/ascii-to-usage.ts
      */
      resolve(rawOut
              .split(/\n/)
              .reduce((M, line) => {
                const [ added, deleted, file ] = line.split(/\s+/)
                M[file] = { added, deleted } // no need to parseInt; we will use these as strings
                return M
              }, {}))
    }
  })
})

/**
 * Register command handlers
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/git/status', doStatus, { needsUI: true, requiresLocal: true, noAuthOk: true })
}
