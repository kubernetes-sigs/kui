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
 * This plugin introduces commands that dispatch to a local bash-like
 * shell
 *
 */

import type { Arguments, Registrar } from '@kui-shell/core'
import type VFS from '../vfs/VFS'

/** e.g. cd /tmp && echo hi */
const RE_CD_TO_PTY = /(&&|\|\|)/

async function failFastCd(dir: string, dirAsProvided: string, args: Arguments, mount: VFS) {
  const { absolute } = await import('../vfs/find')

  const { isDirectory, fullpath } = !mount
    ? { isDirectory: true, fullpath: absolute(dir) }
    : await mount.fstat(args, absolute(dir))
  const isLocal = mount && mount.isLocal

  if (isDirectory) {
    if (process.env.OLDPWD === undefined) {
      process.env.OLDPWD = ''
    }

    const [{ cwd, expandHomeDir }, { inBrowser }] = await Promise.all([
      import('@kui-shell/core/mdist/api/Util'),
      import('@kui-shell/core/mdist/api/Capabilities')
    ])
    const OLDPWD = cwd() // remember it for when we're done
    const newDir = expandHomeDir(fullpath)

    if (isLocal && !inBrowser()) {
      process.chdir(newDir)
    }

    process.env.OLDPWD = OLDPWD
    process.env.PWD = newDir
    if (isLocal) {
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
}

/**
 * cd command
 *
 */
const cd = async (args: Arguments) => {
  if (RE_CD_TO_PTY.test(args.command)) {
    return args.REPL.qexec(
      `sendtopty ${args.command.replace(/kui(cd\s)/, '$1')}`,
      undefined,
      undefined,
      args.execOptions
    )
  }

  const dirAsProvided = args.REPL.split(args.command, true, true)[1] || ''
  if (dirAsProvided === '-' && !process.env.OLDPWD) {
    throw new Error(`cd: not a directory: ${dirAsProvided}`)
  }

  const { expandHomeDir } = await import('@kui-shell/core/mdist/api/Util')
  const { default: CommandsFS } = await import('../vfs/CommandsFS')

  const dir = !dirAsProvided ? expandHomeDir('~') : dirAsProvided === '-' ? process.env.OLDPWD : dirAsProvided

  const { findMount } = await import('../vfs/find')
  const mount = await findMount(dir, undefined, true)
  try {
    return await failFastCd(dir, dirAsProvided, args, mount)
  } catch (err) {
    if (err.message && err.message.includes('no such file or directory')) {
      // consult CommandsFS
      try {
        return await failFastCd(dir, dirAsProvided, args, CommandsFS)
      } catch (err2) {
        throw new Error(`cd: no such file or directory: ${dirAsProvided}`)
      }
    } else {
      throw err
    }
  }
}

const bcd = async ({ command, execOptions, REPL }: Arguments) => {
  const pwd: string = await REPL.qexec(command.replace(/^cd/, 'kuicd'), undefined, undefined, execOptions)

  if (!RE_CD_TO_PTY.test(command)) {
    // only update PWD if we didn't send this to a PTY
    process.env.PWD = pwd
  }

  return pwd
}

async function cdWrap(args: Arguments) {
  const { inBrowser } = await import('@kui-shell/core/mdist/api/Capabilities')
  if (!inBrowser) {
    return cd(args)
  } else {
    return bcd(args)
  }
}

/**
 * Register command handlers
 *
 */
export default (commandTree: Registrar) => {
  const usage = {
    strict: 'cd',
    command: 'cd',
    title: 'change working directory',
    header: 'Update the current working directory for local filesystem manipulations',
    optional: [{ name: 'path', docs: 'local file path', file: true, positional: true }]
  }

  commandTree.listen('/kuicd', cd, {
    usage,
    requiresLocal: true
  })

  commandTree.listen('/cd', cdWrap, { usage })
}
