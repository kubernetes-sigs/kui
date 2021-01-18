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

import { UTC as speedDate } from 'speed-date'
import {
  i18n,
  encodeComponent,
  Arguments,
  CodedError,
  ParsedOptions,
  MixedResponse,
  Registrar,
  Table,
  TableStyle
} from '@kui-shell/core'

import { GlobStats } from '..'
import { localFilepath } from './usage-helpers'

const dateFormatter = speedDate('MMM DD HH:mm')
const strings = i18n('plugin-bash-like')

/**
 * Mimic ls -lh
 *
 */
function prettyBytes(size: number): string {
  if (size < 1024) {
    return `${size}B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}K`
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)}M`
  } else if (size < 1024 * 1024 * 1024 * 1024) {
    return `${(size / 1024 / 1024 / 1024).toFixed(1)}G`
  } else {
    return `${(size / 1024 / 1024 / 1024 / 1024).toFixed(1)}T`
  }
}

/**
 * Mimic ls -l for date
 *
 */
function prettyTime(ms: number): string {
  // if we ever want to re-introduce i18n of ls dates; this will be
  // about 100x slower; see https://github.com/IBM/kui/issues/3461
  /* return new Date(ms).toLocaleString(navigator.language, {
    month: 'short', day: '2-digit', hour: '2-digit', 'minute': '2-digit', hour12: false
    }).replace(/(\s)0/g, '$1 ').replace(/,/g, '') */

  // warning: this will generate (very quickly) not-internationalized
  // ls dates
  return dateFormatter(new Date(ms)).replace(/(\s)0/g, '$1 ')
}

interface LsOptions extends ParsedOptions {
  l: boolean // wide output
  a: boolean // list with dots except for . and ..
  A: boolean // list with dots
  C: boolean // print out file type e.g. * suffix for executables
  S: boolean // sort by size
  r: boolean // reverse sort order
  t: boolean // sort by last modified time
  d: boolean // don't traverse directories
}

/** sort by size */
const bySize = (rev: -1 | 1) => (a: GlobStats, b: GlobStats): number => {
  return rev * (b.stats.size - a.stats.size)
}

/** sort by last modification time */
const byTime = (rev: -1 | 1) => (a: GlobStats, b: GlobStats): number => {
  return rev * (b.stats.mtimeMs - a.stats.mtimeMs)
}

/** sort lexicographically by name */
const byLex = (rev: -1 | 1) => (a: GlobStats, b: GlobStats): number => {
  return rev * a.nameForDisplay.localeCompare(b.nameForDisplay)
}

/**
 * Decorate an entry according to its nature
 *
 */
function cssOf(glob: GlobStats): string {
  const { isDirectory, isSymbolicLink, isExecutable, isSpecial } = glob.dirent

  return isDirectory
    ? 'dir-listing-is-directory'
    : isSymbolicLink
    ? 'dir-listing-is-link'
    : isExecutable
    ? 'dir-listing-is-executable'
    : isSpecial
    ? 'dir-listing-is-other-special'
    : ''
}

/**
 * Decorate the name according to its nature
 *
 */
function nameOf(glob: GlobStats, wide: boolean): string {
  return `${wide ? glob.nameForDisplay : glob.name}${
    glob.dirent.isDirectory
      ? !glob.nameForDisplay.endsWith('/')
        ? '/'
        : ''
      : glob.dirent.isSymbolicLink
      ? '@'
      : glob.dirent.isExecutable
      ? '*'
      : ''
  }`
}

const outerCSSSecondary = 'hide-with-sidecar'
const cssSecondary = 'slightly-deemphasize'

const outerCSSLesser = 'hide-with-narrow-window'
const cssLesser = 'elide-with-narrow-window'

function formatPermissions({ dirent }: GlobStats) {
  return dirent.permissions
}

function formatUid(entry: GlobStats) {
  return entry.dirent.username || entry.stats.uid.toString()
}
function formatGid(entry: GlobStats) {
  return entry.stats.gid.toString()
}

function attrs(
  entry: GlobStats,
  args: Arguments<LsOptions>,
  hasPermissions: boolean,
  hasSize: boolean,
  hasUid: boolean,
  hasGid: boolean,
  hasMtime: boolean
) {
  // const language = withLanguage(args.execOptions).language

  const wide = args.parsedOptions.l
  const perms = wide && hasPermissions ? [{ value: formatPermissions(entry), outerCSS: outerCSSSecondary }] : []
  const uid = wide && hasUid ? [{ value: formatUid(entry), outerCSS: outerCSSSecondary, css: cssSecondary }] : []
  const gid = wide && hasGid ? [{ value: formatGid(entry), outerCSS: outerCSSSecondary, css: cssSecondary }] : []
  const size =
    wide && hasSize
      ? [{ value: prettyBytes(entry.stats.size).replace(/\s/g, ''), outerCSS: '', css: 'yellow-text' }]
      : []
  const lastMod =
    wide && hasMtime
      ? [
          {
            value: prettyTime(entry.stats.mtimeMs),
            outerCSS: outerCSSLesser,
            css: `${cssLesser} ${cssSecondary} pre-wrap sub-text`
          }
        ]
      : []

  return perms
    .concat(uid)
    .concat(gid)
    .concat(size)
    .concat(lastMod)
}

/**
 * Turn an array of glob results into a Kui Table
 *
 */
function toTable(entries: GlobStats[], args: Arguments<LsOptions>): Table {
  const rev = args.parsedOptions.r ? -1 : 1
  const sorter = args.parsedOptions.S ? bySize(rev) : args.parsedOptions.t ? byTime(rev) : byLex(rev)

  const hasPermissions = entries.some(_ => _.dirent && _.dirent.permissions)
  const hasSize = entries.some(_ => _.stats && _.stats.size)
  const hasUid = entries.some(_ => (_.dirent && _.dirent.username) || (_.stats && _.stats.uid >= 0))
  const hasGid = entries.some(_ => _.stats && _.stats.gid >= 0)
  const hasMtime = entries.some(_ => _.stats && _.stats.mtimeMs)

  const body = entries.sort(sorter).map(_ => ({
    name: nameOf(_, args.parsedOptions.l),
    css: cssOf(_),
    onclickExec: 'pexec' as const,
    onclick: `${_.dirent.isDirectory ? (args.parsedOptions.l ? 'ls -l' : 'ls') : 'open'} ${encodeComponent(_.path)}`,
    attributes: attrs(_, args, hasPermissions, hasSize, hasUid, hasGid, hasMtime)
  }))

  const wide = args.parsedOptions.l
  const perms = wide && hasPermissions ? [{ value: 'Permissions', outerCSS: outerCSSSecondary }] : []
  const uid = wide && hasUid ? [{ value: 'User', outerCSS: outerCSSSecondary }] : []
  const gid = wide && hasGid ? [{ value: 'Group', outerCSS: outerCSSSecondary }] : []
  const size = wide && hasSize ? [{ value: 'Size', outerCSS: '' }] : []
  const lastMod = wide && hasMtime ? [{ value: 'Last Modified', outerCSS: outerCSSLesser, css: cssLesser }] : []

  const header = {
    name: 'Name',
    attributes: perms
      .concat(uid)
      .concat(gid)
      .concat(size)
      .concat(lastMod)
  }

  const defaultPresentation = wide ? ('table' as const) : ('grid' as const)
  const allowedPresentations = [defaultPresentation]

  return {
    header,
    body,
    markdown: true,
    noSort: true,
    defaultPresentation,
    allowedPresentations,
    drilldownTo: 'this-split',
    style: wide ? undefined : TableStyle.Light
  }
}

/**
 * ls command handler
 *
 */
const doLs = (cmd: string) => async (opts: Arguments<LsOptions>): Promise<MixedResponse | Table> => {
  if (/\|/.test(opts.command)) {
    // conservatively send possibly piped output to the PTY
    return opts.REPL.qexec(`sendtopty ${opts.command}`, opts.block)
  }

  const srcs = opts.argvNoOptions.slice(opts.argv.indexOf(cmd) + 1)

  const cmdline =
    'vfs ls ' + (opts.parsedOptions.l || cmd === 'lls' ? '-l ' : '') + srcs.map(_ => encodeComponent(_)).join(' ')

  if (cmd === 'lls') {
    opts.parsedOptions.l = true
  }

  const entries = (await opts.REPL.rexec<GlobStats[]>(cmdline)).content

  if (entries.length === 0) {
    const isDirs = entries.map(_ => _.dirent.isDirectory)
    if (isDirs.some(_ => !_)) {
      // ls on at least one non-directory yielded no entries (converseley: it is not an error if an ls on only-directories yielded no entries)
      const error: CodedError = new Error(
        srcs
          .map((_, idx) => (isDirs[idx] ? undefined : `ls: ${_}: No such file or directory`))
          .filter(_ => _)
          .join('\n')
      )
      error.code = 404
      throw error
    }
  }

  return toTable(entries, opts)
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
    { name: '-d', boolean: true, docs: strings('lsDashdUsageDocs') },
    {
      name: '-c',
      boolean: true,
      docs: strings('lsDashcUsageDocs')
    },
    { name: '-C', boolean: true, hidden: true },
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
export default (commandTree: Registrar) => {
  const ls = commandTree.listen('/ls', doLs('ls'), {
    usage: usage('ls'),
    flags: {
      boolean: usage('ls')
        .optional.filter(_ => _.boolean)
        .map(_ => _.name.replace(/^-(-)?/, ''))
    }
  })
  commandTree.synonym('/lls', doLs('lls'), ls, {
    usage: usage('lls')
  })
}
