/*
 * Copyright 2018-19 IBM Corporation
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
import { lstat, readdir, readFile, stat } from 'fs'
import { dirname, isAbsolute, join } from 'path'

import { Commands, Errors, i18n, REPL, Tables, Util } from '@kui-shell/core'

import { doExec } from './bash-like'
import { localFilepath } from '../util/usage-helpers'

const strings = i18n('plugin-bash-like')
const debug = Debug('plugins/bash-like/cmds/ls')

/**
 * From the end of the given string, scan for the idx that marks the
 * start of some filename in the given fileMap
 *
 */
const scanForFilename = (str: string, fileMap: Record<string, boolean>, endIdx = str.length - 1) => {
  let candidate: string
  let candidateIdx: number

  for (let idx = endIdx; idx >= 0; idx--) {
    const maybe = str.slice(idx, endIdx + 1)
    if (fileMap[maybe]) {
      // find the longest candidate
      if (!candidate || candidate.length < maybe.length) {
        candidate = maybe
        candidateIdx = idx - 1
      }
    }
  }

  if (candidate) {
    fileMap[candidate] = false // we already matched this!
    return candidateIdx
  }
}

/**
 * Return the contents of the given directory
 *
 */
const myreaddir = (dir: string): Promise<Record<string, boolean>> =>
  new Promise((resolve, reject) => {
    const toMap = (files: string[]) => {
      return files.reduce((M, file) => {
        M[file] = true
        M[join(dir, file)] = true
        return M
      }, {})
    }

    lstat(dir, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          const parent = dirname(dir)
          if (parent) {
            return myreaddir(dirname(dir))
              .then(resolve)
              .catch(reject)
          }
        }

        // fallthrough to reject
        reject(err)
      } else if (!stats.isDirectory()) {
        // link or file or other
        resolve(toMap([dir]))
      } else {
        readdir(dir, (err, files) => {
          if (err) {
            reject(err)
          } else {
            resolve(toMap(['.', '..'].concat(files)))
          }
        })
      }
    })
  })

/**
 * If the given filepath is a directory, then ls it, otherwise cat it
 *
 */
const lsOrOpen = async ({ argvNoOptions }: Commands.Arguments) => {
  const filepath = argvNoOptions[argvNoOptions.indexOf('lsOrOpen') + 1]

  const stats: { isDirectory: boolean; viewer: string } = await REPL.qexec(`fstat ${REPL.encodeComponent(filepath)}`)

  const filepathForRepl = REPL.encodeComponent(filepath)

  if (stats.isDirectory) {
    return REPL.pexec(`ls ${filepathForRepl}`)
  } else {
    return REPL.pexec(`${stats.viewer} ${filepathForRepl}`)
  }
}

/**
 * Kui command for fs.stat
 *
 */
const fstat = ({ argvNoOptions, parsedOptions }: Commands.Arguments) => {
  return new Promise((resolve, reject) => {
    const filepath = argvNoOptions[1]

    const { resolved: fullpath, viewer = 'open' } = Util.findFileWithViewer(Util.expandHomeDir(filepath))
    debug('fullpath', fullpath, filepath, Util.expandHomeDir(filepath))

    const prettyFullPath = fullpath.replace(new RegExp(`^${process.env.HOME}`), '~')

    // note: stat not lstat, because we want to follow the link
    stat(fullpath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          const error: Errors.CodedError = new Error(err.message)
          error.stack = err.stack
          error.code = 404
          reject(error)
        } else {
          reject(err)
        }
      } else if (stats.isDirectory() || !parsedOptions['with-data']) {
        resolve({
          viewer,
          filepath,
          fullpath: prettyFullPath,
          isDirectory: stats.isDirectory()
        })
      } else {
        readFile(fullpath, (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve({
              viewer,
              filepath,
              fullpath: prettyFullPath,
              data: data.toString(),
              isDirectory: false
            })
          }
        })
      }
    })
  })
}

/**
 * Turn ls output into a REPL table
 *
 */
const tabularize = (cmd: string, parsedOptions: Commands.ParsedOptions, parent = '', parentAsGiven = '') => async (
  output: string
): Promise<true | Tables.Table> => {
  if (output.length === 0) {
    debug('tabularize empty')
    return true
  }

  const fileMap = await myreaddir((parent || process.cwd()).replace(/['"]/g, ''))

  // ls -l on directories has a line at the top "total nnnn"
  // we will strip this off
  const startIdx = output.match(/^total [\d]+/) ? 1 : 0

  const columnGap = process.platform === 'darwin' ? 15 : 1

  const rows = output
    .split(/[\n\r]/)
    .slice(startIdx) // maybe strip off "total nnn"
    .map(line =>
      line
        .split(new RegExp(`[\\s]{${columnGap}}`))
        .map(col => col.trim())
        .filter(x => x)
        .map((col, idx, A) => {
          if (idx === 1) {
            // the "num links" and "user" columns are adjoined
            // e.g. "1 nickm"
            const spaceIdx = col.indexOf(' ')
            return [col.substring(0, spaceIdx), col.substring(spaceIdx + 1)].filter(x => x) // the first entry might be blank, e.g. on linux
          } else if (process.platform !== 'darwin' && idx >= 5 && idx <= 7) {
            // the date column is split across three cols in our split
            if (idx === 5) {
              return `${A[idx]} ${A[idx + 1]} ${A[idx + 2]}`
            }
          } else if (process.platform === 'darwin' && idx === 3) {
            // the size, date, and filename columns are adjoined
            // e.g. "12K Jul 26 12:58 CHANGELOG.md"

            const spaceIdx1 = col.indexOf(' ') // space after 12k

            const stats = A[0]
            const isLink = stats.charAt(0) === 'l'

            if (isLink) {
              // links are a bit funky, e.g.
              // "115B Sep  4 21:04 yo.js -> /path/to/yo.js"
              const arrow = '->'
              const arrowIdx = col.lastIndexOf(arrow)
              const endOfLinkIdx = arrowIdx - arrow.length + 1
              const startOfFilename = scanForFilename(col, fileMap, endOfLinkIdx - 1)

              return [
                col.substring(0, spaceIdx1), // size
                col.substring(spaceIdx1 + 1, startOfFilename), // date
                col.substring(startOfFilename + 1, endOfLinkIdx) // link name
              ]
            } else {
              const startOfFilename = scanForFilename(col, fileMap) // e.g. space after :58 in the comment under idx === 3

              return [
                col.substring(0, spaceIdx1), // size
                col.substring(spaceIdx1 + 1, startOfFilename), // date
                col.substring(startOfFilename + 1) // filename
              ]
            }
          } else if (process.platform !== 'darwin' && idx >= 8) {
            // here is where we handle the name column(s) on
            // non-darwin platforms; these usually span 3-N columns,
            // depending on how many spaces the base filename and
            // linked filename contain
            if (idx === 8) {
              // idx 8 marks the start of the name -> link columns
              const stats = A[0]
              const isLink = stats.charAt(0) === 'l'
              const rest = A.slice(idx).join(' ')

              if (isLink) {
                // if this row represents a link, the format will be name -> linkedFile
                // we want the "name" part
                const arrow = '->'
                const arrowIdx = rest.lastIndexOf(arrow)
                return rest.slice(0, arrowIdx).trim()
              } else {
                // otherwise, this isn't a link, so peel off the remaining columns
                return rest
              }
            }
          } else {
            return col
          }
        })
    )
    .map(Util.flatten)
    .map(row => row.filter(x => x))
    .filter(x => x.length > 0)
    .filter(row => !row[row.length - 1].match(/~$/)) // hack for now: remove emacs ~ temporary files

  const outerCSS = 'header-cell'
  const outerCSSSecondary = `${outerCSS} hide-with-sidecar`

  const ownerAttrs = !parsedOptions.l
    ? []
    : [
        { key: 'owner', value: 'OWNER', outerCSS: outerCSSSecondary },
        { key: 'group', value: 'GROUP', outerCSS: outerCSSSecondary }
      ]

  const permissionAttrs = !parsedOptions.l
    ? []
    : [
        {
          key: 'permissions',
          value: 'PERMISSIONS',
          outerCSS: outerCSSSecondary
        }
      ]

  const normalAttrs = [
    { key: 'size', value: 'SIZE', outerCSS: outerCSSSecondary },
    {
      key: 'lastmod',
      value: 'LAST MODIFIED',
      outerCSS: `${outerCSS} badge-width`
    }
  ]

  const headerAttributes = permissionAttrs.concat(ownerAttrs).concat(normalAttrs)

  const headerRow: Tables.Row = {
    name: 'NAME',
    type: 'file',
    onclick: false,
    outerCSS,
    attributes: headerAttributes
  }

  const body: Tables.Row[] = rows.map(
    (columns): Tables.Row => {
      const stats = columns[0]
      const isDirectory = stats.charAt(0) === 'd'
      const isLink = stats.charAt(0) === 'l'
      const isExecutable = stats.indexOf('x') > 0
      const isSpecial = stats.charAt(0) !== '-'

      const name = columns[columns.length - 1]
      const nameForDisplay = `${name}${isDirectory ? '/' : isLink ? '@' : isExecutable ? '*' : ''}`

      const css = isDirectory
        ? 'dir-listing-is-directory'
        : isLink
        ? 'dir-listing-is-link' // note that links are also x; we choose l first
        : isExecutable
        ? 'dir-listing-is-executable'
        : isSpecial
        ? 'dir-listing-is-other-special'
        : ''

      const startTrim = 2
      const endTrim = 0
      const allTrim = startTrim + endTrim + 1

      // idx into the attributes; minus 1 because we slice off the name
      const ownerIdx = 1 - 1
      const groupIdx = 2 - 1
      const sizeIdx = 3 - 1
      const dateIdx = columns.length - allTrim - 1

      // user asked to sort by time?
      const sortByTime = parsedOptions.t

      const permissionAttrs = !parsedOptions.l
        ? []
        : [
            {
              value: columns[0],
              css: 'slightly-deemphasize'
            }
          ]

      const normalAttributes = columns
        .slice(startTrim, columns.length - endTrim - 1)
        .map((col, idx) => {
          if (parsedOptions.l || (idx !== ownerIdx && idx !== groupIdx)) {
            return {
              value: col,
              outerCSS: idx !== dateIdx ? 'hide-with-sidecar' : 'badge-width',
              css:
                idx === ownerIdx ||
                idx === groupIdx ||
                (idx === dateIdx && !sortByTime) ||
                (idx === sizeIdx && sortByTime)
                  ? 'slightly-deemphasize'
                  : ''
            }
          }
        })
        .filter(x => x)

      return new Tables.Row({
        type: cmd,
        name: nameForDisplay,
        onclickExec: 'qexec',
        onclick: `lsOrOpen ${REPL.encodeComponent(isAbsolute(name) ? name : join(parentAsGiven, name))}`, // note: ls -l file results in an absolute path
        css,
        attributes: permissionAttrs.concat(normalAttributes)
      })
    }
  )

  return new Tables.Table({
    type: cmd,
    style: Tables.TableStyle.Light,
    noEntityColors: true,
    noSort: true,
    header: headerRow,
    body
  })
}

/**
 * ls command handler
 *
 */
const doLs = (cmd: string) => async (opts: Commands.Arguments) => {
  const semi = await REPL.semicolonInvoke(opts)
  if (semi) {
    debug('ls with semi', semi)
    return semi
  }

  const { command, execOptions, argvNoOptions: argv, parsedOptions: options } = opts

  const filepathAsGiven = argv[argv.indexOf(cmd) + 1]
  const filepath = Util.findFile(Util.expandHomeDir(filepathAsGiven), {
    safe: true,
    keepRelative: true
  })

  if (filepath.match(/app.asar/) && Util.isSpecialDirectory(filepathAsGiven)) {
    // for now, we don't support ls of @ directories
    throw new Error('File not found')
  }

  const rest = command.replace(/^\s*(l)?ls/, '').replace(filepathAsGiven, filepath)
  return doExec(
    `ls -lh ${rest}`,
    Object.assign({}, execOptions, {
      nested: true,
      raw: true,
      env: {
        LS_COLWIDTHS: '100:100:100:100:100:100:100:100'
      }
    })
  ).then(tabularize(command, options, filepath, filepathAsGiven))
}

const usage = (command: string) => ({
  command,
  title: strings('lsUsageTitle'),
  header: strings('lsUsageHeader'),
  noHelpAlias: true,
  optional: localFilepath.concat([
    { name: '-A', boolean: true, docs: strings('lsDashAUsageDocs') },
    {
      name: '-a',
      boolean: true,
      docs: strings('lsDashaUsageDocs')
    },
    {
      name: '-c',
      boolean: true,
      docs: strings('lsDashcUsageDocs')
    },
    { name: '-l', boolean: true, hidden: true },
    { name: '-h', boolean: true, hidden: true },
    {
      name: '-t',
      boolean: true,
      docs: strings('lsDashtUsageDocs')
    },
    { name: '-r', boolean: true, docs: strings('lsDashrUsageDocs') },
    { name: '-s', boolean: true, hidden: true }, // "show size", which we always do; so hidden: true
    { name: '-S', boolean: true, docs: strings('lsDashSUsageDocs') }
  ])
})

/**
 * Register command handlers
 *
 */
export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/fstat', fstat, {
    hidden: true,
    noAuthOk: true,
    requiresLocal: true
  })
  commandTree.listen('/lsOrOpen', lsOrOpen, {
    hidden: true,
    noAuthOk: true,
    inBrowserOk: true
  })
  const ls = commandTree.listen('/ls', doLs('ls'), {
    usage: usage('ls'),
    noAuthOk: true,
    requiresLocal: true
  })
  commandTree.synonym('/lls', doLs('lls'), ls, {
    usage: usage('lls'),
    noAuthOk: true,
    requiresLocal: true
  })
}
