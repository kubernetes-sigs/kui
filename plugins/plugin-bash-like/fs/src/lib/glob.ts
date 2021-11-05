/*
 * Copyright 2020 The Kubernetes Authors
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

import { userInfo } from 'os'
import { stat, Stats, constants } from 'fs'
import { VFS } from '../vfs'

import { i18n, isHeadless, CodedError, Arguments, ParsedOptions, Util } from '@kui-shell/core'

const strings = i18n('plugin-bash-like')

/** Just the bits of fs.Stats that we need */
type PartialStats = Pick<Stats, 'size' | 'mtimeMs' | 'uid' | 'gid' | 'mode'>

interface BaseStats {
  name: string
  path: string
  stats: PartialStats
}

interface DirentStats {
  isFile: boolean
  isDirectory: boolean
  isSymbolicLink: boolean

  // simplify the model a bit, for what we need
  isSpecial: boolean
  // isBlockDevice: boolean
  // isCharacterDevice: boolean
  // isFIFO: boolean
  // isSocket: boolean

  // we manufacture these, to avoid requiring fs.constants in a browser
  isExecutable: boolean
  permissions: string
  username: string
  mount: Pick<VFS, 'isLocal' | 'tags' | 'mountPath'>
}

interface RawGlobStats extends BaseStats {
  dirent: {
    isFile: () => boolean
    isDirectory: () => boolean
    isSymbolicLink: () => boolean
  }
}

export interface GlobStats extends BaseStats {
  viewer?: string
  nameForDisplay: string
  dirent: DirentStats
}

export interface KuiGlobOptions extends ParsedOptions {
  a?: boolean
  all?: boolean
  d?: boolean
  l?: boolean
  C?: boolean
}

function formatPermissions(stats: PartialStats, isFile: boolean, isDirectory: boolean, isSymbolicLink: boolean) {
  const { mode } = stats

  const d = isDirectory ? 'd' : isSymbolicLink ? 'l' : isFile ? '-' : 's'
  const ur = mode & constants.S_IRUSR ? 'r' : '-'
  const uw = mode & constants.S_IWUSR ? 'w' : '-'
  const ux = mode & constants.S_IXUSR ? 'x' : '-'
  const gr = mode & constants.S_IRGRP ? 'r' : '-'
  const gw = mode & constants.S_IWGRP ? 'w' : '-'
  const gx = mode & constants.S_IXGRP ? 'x' : '-'
  const or = mode & constants.S_IROTH ? 'r' : '-'
  const ow = mode & constants.S_IWOTH ? 'w' : '-'
  const ox = mode & constants.S_IXOTH ? 'x' : '-'

  return `${d}${ur}${uw}${ux}${gr}${gw}${gx}${or}${ow}${ox}`
}

/**
 * promisey form of stat
 *
 */
async function isDir(filepath: string): Promise<Stats> {
  return new Promise((resolve, reject) => {
    stat(filepath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
          resolve(undefined)
        } else {
          reject(err)
        }
      } else {
        resolve(stats)
      }
    })
  })
}

const nope = () => false
const yup = () => true

/**
 * Kui command for globbing readdir
 *
 */
export async function kuiglob(
  vfs: VFS,
  { tab, argvNoOptions, parsedOptions }: Pick<Arguments<KuiGlobOptions>, 'tab' | 'argvNoOptions' | 'parsedOptions'>
): Promise<GlobStats[]> {
  // Intentional require versus import... some typing issues right
  // now. Also intentionally lazy here, to avoid complications with
  // webpack bundling with browser targets.
  const globby = require('globby')

  // this is the list of top-level entry points the user asked us to
  // traverse
  const inputs = argvNoOptions
    .slice(argvNoOptions.indexOf('kuiglob') + 1)
    .map(Util.expandHomeDir) // ~ -> /home/me/
    .map(_ => _.replace(/([^\\])"/g, '$1')) // /tmp/"foo bar" -> /tmp/foo bar

  const stats = inputs.length === 0 ? [] : await Promise.all(inputs.map(isDir))
  const startingPointsAreDirs = stats.map(_ => _ && _.isDirectory())

  // assemble the list of top-level glob entry points to traverse: 1)
  // filter out directories, if the user specified -d; 2a) add a
  // trailing wildcard, for starting points that are known to be
  // directories (e.g. `ls dirname` should traverse into dirname,
  // unless -d is specified hence the first filter; 2b) add a trailing
  // wildcard, if the user specified a trailing wildcard themselves
  // (e.g. `ls foo*` should traverse into foobar/ if it is a
  // directory)
  const toGlob = inputs
    .filter((_, idx) => !parsedOptions.d || !startingPointsAreDirs[idx])
    .reduce((A, _, idx) => {
      if (!parsedOptions.d) {
        if (startingPointsAreDirs[idx]) {
          // ls dirname -> dirname/* as the glob
          // ls dirname/ -> dirname/* as the glob
          A.push(_.endsWith('/') ? `${_}*` : `${_}/*`)
          return A
        } else if (_.endsWith('*')) {
          // ls foo* -> [foo*, foo*/*]
          A.push(_)
          A.push(`${_}/*`)
          return A
        }
      }

      // otherwise, what the user typed is what we'll use as the glob
      A.push(_)
      return A
    }, [])

  const needStats = parsedOptions.l || parsedOptions.C

  const globbedEntries =
    toGlob.length === 0 && inputs.length > 0
      ? []
      : (((await globby(toGlob.length === 0 ? ['*'] : toGlob, {
          onlyFiles: false,
          suppressErrors: true,
          expandDirectories: false, // see https://github.com/sindresorhus/globby/issues/166
          followSymbolicLinks: false,
          dot: parsedOptions.a || parsedOptions.all,
          stats: needStats,
          objectMode: !needStats,
          cwd: isHeadless() ? process.cwd() : tab.state.getState('plugins/plugin-bash-like', 'v1', 'cwd')
        })) as any) as RawGlobStats[])
  //  ^^^^^^ re: type conversion; globby type declaration issue #139

  // handle -d; fast-glob doesn't seem to handle this very well on its
  // own; it doesn't have a way for clients to express "stop
  // traversing at any directories"
  const dirEntries: RawGlobStats[] = !parsedOptions.d
    ? []
    : inputs
        .map((name, idx) => {
          if (!startingPointsAreDirs[idx]) {
            return undefined
          } else {
            return {
              name,
              path: name,
              dirent: {
                isFile: nope,
                isSymbolicLink: nope,
                isDirectory: yup
              },
              stats: stats[idx]
            }
          }
        })
        .filter(_ => _)

  const entries = globbedEntries.concat(dirEntries)

  if (entries.length === 0 && !inputs.some(_ => /\*/.test(_)) && !startingPointsAreDirs.some(_ => _)) {
    // we found nothing; be careful only to report a 404 if: a) user
    // specified no wildcards b) none of the inputs were directories;
    // e.g. `ls emptyDir` will glob nothing, but shouldn't be a 404
    const error: CodedError = new Error(strings('No such file or directory', inputs.join(' ')))
    error.code = 404
    throw error
  }

  const user = userInfo()

  return entries.map(({ name, path, dirent, stats }) => {
    const isFile = dirent.isFile()
    const isDirectory = dirent.isDirectory()
    const isSymbolicLink = dirent.isSymbolicLink()

    const isExecutable = stats && !!(stats.mode & (constants.S_IXUSR | constants.S_IXGRP | constants.S_IXOTH))

    const isSpecial = !isFile && !isDirectory && !isSymbolicLink
    // dirent.isBlockDevice() || dirent.isCharacterDevice() || dirent.isFIFO() || dirent.isSocket()

    // e.g. ls dir1 dir2... we want to display the dir1 and dir2 as part of the response
    const nameForDisplay = toGlob.length > 1 ? path : name

    return {
      name,
      path,
      nameForDisplay,
      stats,
      dirent: {
        isFile,
        isDirectory,
        isSymbolicLink,
        isExecutable,
        isSpecial,
        mount: { isLocal: vfs.isLocal, tags: vfs.tags, mountPath: vfs.mountPath },
        permissions: parsedOptions.l ? formatPermissions(stats, isFile, isDirectory, isSymbolicLink) : '',
        username: stats && user.uid === stats.uid ? user.username : ''
      }
    }
  })
}
