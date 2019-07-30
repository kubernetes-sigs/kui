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

import * as path from 'path'
import { spawn } from 'child_process'

import { partial, Tab } from '@kui-shell/core/webapp/cli'
import pip from '@kui-shell/core/webapp/picture-in-picture'
import { CommandRegistrar, EvaluatorArgs } from '@kui-shell/core/models/command'

import { handleNonZeroExitCode } from '../util/exec'
import { asSidecarEntity } from '../util/sidecar-support'
import { onbranch, injectCSS } from '../util/git-support'
const debug = Debug('plugins/bash-like/cmds/git-status')

/**
 * git diff --numstat row; we will consume these numbers as strings, so no need to parseInt them
 *
 */
interface Stat {
  added: string
  deleted: string
}
interface Stats {
  [key: string]: Stat
}
const numstat = (): Promise<Stats> =>
  new Promise<Stats>((resolve, reject) => {
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
        resolve(
          rawOut.split(/\n/).reduce((M, line) => {
            const [added, deleted, file] = line.split(/\s+/)
            M[file] = { added, deleted } // no need to parseInt; we will use these as strings
            return M
          }, {})
        )
      }
    })
  })

/**
 * Is no text currently selected?
 *
 */
const noCurrentTextSelection = () =>
  window
    .getSelection()
    .toString()
    .trim().length === 0

/**
 * Look for modified: and turn them into git diff links
 *
 */
export const status2Html = (tab: Tab, rawOut: string, stats: Promise<Stats> = numstat()): HTMLElement => {
  injectCSS()

  const mods = rawOut
    .replace(/^\s*\(use .*\)$/gm, '___nope___')
    .replace(
      /^(\s+)([^:\s]+)$/gm,
      `<tbody class='entity'><tr class='entity-attributes'><td class='repl-pexec-link do-not-overflow clickable clickable-blatant' data-file='$2' data-partial data-command='git add'>$2</td></tr></tbody>`
    )
    .replace(
      /^(\s+)(modified:|new file:|deleted:)(\s+)(.*)$/gm,
      `<tbody class='entity'><tr class='entity-attributes'>$2<td class='repl-pexec-link do-not-overflow clickable clickable-blatant' data-file='$4'>$4</td><td class='d2h-file-stats-wrapper'><span class='d2h-file-stats double-icon-width' data-file='$4'><span class='d2h-lines-added'></span><span class='d2h-lines-deleted'></span></td></tr></tbody>`
    )
    .replace(/(On branch\s+)(.*)\n/, '') // $1<strong>$2</strong>
    .replace(
      /(Changes to be committed:|Changes not staged for commit:)/g,
      `</div></div></div><div class='result-table-outer top-pad'><div class='result-table-title-outer'><div class='repl-pexec-link clickable result-table-title' data-file='.'>$1</div></div><table class='bx--data-table result-table'>`
    )
    .replace(
      /(Untracked files:)/g,
      `</table></div></div><div class='result-table-outer top-pad'><div class='result-table-title-outer'><div class='repl-pexec-link clickable result-table-title' data-file='.'>$1</div></div><table class='bx--data-table result-table' kui-table-style="Light">`
    )
    .replace(
      /modified:/g,
      `<td class='yellow-text larger-text icon-width'><svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M13 21h13.17l-2.58 2.59L25 25l5-5-5-5-1.41 1.41L26.17 19H13v2z"></path><path d="M22 14v-4a1 1 0 0 0-.29-.71l-7-7A1 1 0 0 0 14 2H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2h-2v2H4V4h8v6a2 2 0 0 0 2 2h6v2zm-8-4V4.41L19.59 10z"></path></svg></td>`
    )
    .replace(
      /new file:/g,
      `<td class='green-text larger-text icon-width'><svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M25.7 9.3l-7-7A.91.91 0 0 0 18 2H8a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10a.91.91 0 0 0-.3-.7zM18 4.4l5.6 5.6H18zM24 28H8V4h8v6a2 2 0 0 0 2 2h6z"></path><path d="M21 19h-4v-4h-2v4h-4v2h4v4h2v-4h4v-2z"></path></svg></td>`
    )
    .replace(
      /deleted:/g,
      `<td class='red-text larger-text icon-width'><svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M25.7 9.3l-7-7A.91.91 0 0 0 18 2H8a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10a.91.91 0 0 0-.3-.7zM18 4.4l5.6 5.6H18zM24 28H8V4h8v6a2 2 0 0 0 2 2h6z"></path><path d="M11 19h10v2H11z"></path></svg></td>`
    )
    .replace(
      /\s*(nothing added to commit but untracked files present|no changes added to commit.*)/,
      `</table></div><div class='top-pad'>$1</div>`
    )
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
            return pip(tab, `${command} ${relpath}`, undefined, wrapper.parentNode.parentNode as Element, 'git status')(
              event
            )
          }
        }, 0)
      }
    }
  }

  return wrapper
}

/**
 * git status command handler
 *
 */
const doStatus = async ({ command, execOptions, tab }: EvaluatorArgs) =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async (resolve, reject) => {
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
    proc.on('close', (exitCode: number) => {
      if (exitCode === 0) {
        // note: no sidecar header if this launched from the command line ("subwindow mode")
        resolve(asSidecarEntity('git status', status2Html(tab, rawOut, stats), {}, undefined, 'statuss', currentBranch)) // intentional additional s at the end
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
 * Register command handlers
 *
 */
export default (commandTree: CommandRegistrar) => {
  commandTree.listen('/git/status', doStatus, {
    needsUI: true,
    requiresLocal: true,
    noAuthOk: true
  })
}
