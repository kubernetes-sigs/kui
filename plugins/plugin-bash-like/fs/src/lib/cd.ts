/*
 * Copyright 2017-21 IBM Corporation
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
 * This plugin introduces commands that dispatch to a local bash-like
 * shell
 *
 */

import Debug from 'debug'
import { join } from 'path'

import { cwd, inBrowser, Arguments, Registrar, i18n, expandHomeDir } from '@kui-shell/core'
import { localFilepath } from './usage-helpers'
import { findMount } from '../vfs'

const strings = i18n('plugin-bash-like')
const debug = Debug('plugins/bash-like/cmds/general')

const usage = {
  cd: {
    strict: 'cd',
    command: 'cd',
    title: strings('cdUsageTitle'),
    header: strings('cdUsageHeader'),
    optional: localFilepath
  }
}

/**
 * cd command
 *
 */
const cd = async (args: Arguments) => {
  const dirAsProvided = args.REPL.split(args.command, true, true)[1] || ''
  if (dirAsProvided === '-' && !process.env.OLDPWD) {
    throw new Error(`cd: not a directory: ${dirAsProvided}`)
  }

  const dir = !dirAsProvided ? expandHomeDir('~') : dirAsProvided === '-' ? process.env.OLDPWD : dirAsProvided

  const mount = findMount(dir)
  try {
    const resolveDir =
      mount.isLocal || dirAsProvided === '-' ? dir : process.env.VIRTUAL_CWD ? join(process.env.VIRTUAL_CWD, dir) : dir
    debug('cd dir', resolveDir)
    const stat = await mount.fstat(args, resolveDir)

    if (stat.isDirectory) {
      if (process.env.OLDPWD === undefined) {
        process.env.OLDPWD = ''
      }

      const OLDPWD = cwd() // remember it for when we're done
      const newDir = expandHomeDir(stat.fullpath)

      if (mount.isLocal && !inBrowser()) {
        process.chdir(newDir)
      }

      process.env.OLDPWD = OLDPWD
      process.env.PWD = newDir
      if (mount.isLocal) {
        delete process.env.VIRTUAL_CWD
      } else {
        process.env.VIRTUAL_CWD = newDir
      }

      if (args.tab.state) {
        args.tab.state.capture()
      }
      return newDir
    } else {
      throw new Error(`cd: not a directory: ${dirAsProvided}`)
    }
  } catch (err) {
    if (err.message && err.message.includes('no such file or directory')) {
      throw new Error(`cd: no such file or directory: ${dirAsProvided}`)
    } else {
      throw err
    }
  }
}

const bcd = async ({ command, execOptions, REPL }: Arguments) => {
  const pwd: string = await REPL.qexec(command.replace(/^cd/, 'kuicd'), undefined, undefined, execOptions)
  process.env.PWD = pwd
  return pwd
}

/**
 * Register command handlers
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen('/kuicd', cd, {
    requiresLocal: true
  })

  if (!inBrowser()) {
    commandTree.listen('/cd', cd, {
      usage: usage.cd
    })
  } else {
    commandTree.listen('/cd', bcd, {
      usage: usage.cd
    })
  }
}
