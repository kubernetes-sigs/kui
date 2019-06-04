/*
 * Copyright 2017-19 IBM Corporation
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

import * as Debug from 'debug'

import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'

import expandHomeDir from '@kui-shell/core/util/home'
import { inBrowser, isHeadless } from '@kui-shell/core/core/capabilities'
import UsageError from '@kui-shell/core/core/usage-error'
import * as repl from '@kui-shell/core/core/repl'
import { CommandRegistrar, IEvaluatorArgs } from '@kui-shell/core/models/command'
import { IExecOptions } from '@kui-shell/core/models/execOptions'

import { reallyLong, handleNonZeroExitCode } from '../util/exec'
import { extractJSON } from '../util/json'
import { asSidecarEntity } from '../util/sidecar-support'
import { localFilepath } from '../util/usage-helpers'
import { dispatchToShell } from './catchall'
const debug = Debug('plugins/bash-like/cmds/general')

/**
 * Strip off ANSI and other control characters from the given string
 *
 */
const stripControlCharacters = (str: string): string => {
  return str.replace(/\x1b\[(\d+;)?\d+m/g, '') // ansi color codes
    .replace(/^\x08+/, '') // control characters
    .replace(/^\x1b\[[012]?K/, '')
    .replace(/^\x1b\[\(B/, '')
    .replace(/^\x1b\[38;5;(\d+)m/, '')
    .replace(/^\x1b\[\d?J/, '')
    .replace(/^\x1b\[\d{0,3};\d{0,3}f/, '')
    .replace(/^\x1b\[?[\d;]{0,3}/, '')
    .replace(/^\W*OK\W*\n/, '') // OK at the beginning
}

export const doShell = (argv: string[], options, execOptions?: IExecOptions) => new Promise(async (resolve, reject) => {
  if (inBrowser()) {
    reject(new Error('Local file access not supported when running in a browser'))
  }

  // purposefully imported lazily, so that we don't spoil browser mode (where shell is not available)
  const shell = await import('shelljs')

  if (argv.length < 2) {
    reject(new Error('Please provide a bash command'))
  }

  const cmd = argv[1]
  debug('argv', argv)
  debug('cmd', cmd)

  // shell.echo prints the the outer console, which we don't want
  if (shell[cmd] && (inBrowser() || (cmd !== 'mkdir' && cmd !== 'echo'))) {
    const args = argv.slice(2)

    // remember OLDPWD, so that `cd -` works (shell issue #78)
    if (process.env.OLDPWD === undefined) {
      process.env.OLDPWD = ''
    }
    const OLDPWD = shell.pwd() // remember it for when we're done
    if (cmd === 'cd' && args[0] === '-') {
      // special case for "cd -"
      args[0] = process.env.OLDPWD
    }

    // see if we should use the built-in shelljs support
    if (!args.find(arg => arg.charAt(0) === '-') && // any options? then no
        !args.find(arg => arg === '>') && // redirection? then no
        cmd !== 'ls') {
      // shelljs doesn't like dash args
      // otherwise, shelljs has a built-in handler for this

      debug('using internal shelljs', cmd, args)

      const output = shell[cmd](args)
      if (cmd === 'cd') {
        process.env.OLDPWD = OLDPWD

        if (output.code === 0) {
          // special case: if the user asked to change working
          // directory, respond with the new working directory
          resolve(shell.pwd().toString())
        } else {
          reject(new Error(output.stderr))
        }
      } else {
        // otherwise, respond with the output of the command;
        if (output && output.length > 0) {
          if (execOptions && execOptions['json']) {
            resolve(JSON.parse(output))
          } else {
            resolve(output.toString())
          }
        } else {
          resolve(true)
        }
      }
    }
  }

  //
  // otherwise, we use exec to implement the shell command; here, we
  // cross our fingers that the platform implements the requested
  // command
  //
  const rest = argv.slice(1) // skip over '!'
  const cmdLine = rest.map(_ => repl.encodeComponent(_)).join(' ')
  debug('cmdline', cmdLine, rest)

  doExec(cmdLine, execOptions).then(resolve, reject)
})

export const doExec = (cmdLine: string, execOptions: IExecOptions) => new Promise(async (resolve, reject) => {
  // purposefully imported lazily, so that we don't spoil browser mode (where shell is not available)

  const proc = exec(cmdLine, {
    env: Object.assign({}, process.env, execOptions['env'] || {})
  })

  // accumulate doms from the output of the subcommand
  let rawOut = ''
  let rawErr = ''

  let pendingUsage = false
  proc.stdout.on('data', async data => {
    const out = data.toString()

    if (execOptions.stdout) {
      execOptions.stdout(data)
    } else {
      rawOut += out
    }
  })

  proc.stderr.on('data', data => {
    rawErr += data

    if (execOptions.stderr) {
      execOptions.stderr(data.toString())
      // stderrLines += data.toString()
    }
  })

  proc.on('close', async exitCode => {
    if (exitCode === 0) {
      // great, the process exited normally. resolve!
      if (execOptions && execOptions['json']) {
        // caller expects JSON back
        try {
          resolve(JSON.parse(rawOut))
        } catch (err) {
          let error = new Error('unexpected non-JSON')
          error['value'] = rawOut
          reject(error)
        }
      } else if (execOptions && execOptions.raw) {
        // caller just wants the raw textual output
        resolve(rawOut)
      } else if (!rawOut && !rawErr) {
        // in this case, the command produced nothing, but it did exit
        // with a 0 exit code
        resolve(true)
      } else {
        // else, we pass back a formatted form of the output
        const json = extractJSON(rawOut)

        const command = cmdLine.replace(/^\s*(\S+)\s+/, '$1')
        const verb = ''
        const entityType = ''
        const options = {}

        if (json) {
          json['type'] = 'shell'
          json['verb'] = 'get'
          resolve(json)
        } else {
          resolve(rawOut)
        }
      }
    } else {
      // oops, non-zero exit code. reject!
      debug('non-zero exit code', exitCode)

      // strip off e.g. /bin/sh: line 0:
      const cleanErr = rawErr.replace(/(^\/[^/]+\/[^:]+: )(line \d+: )?/, '')
      try {
        handleNonZeroExitCode(cmdLine, exitCode, rawOut, cleanErr, execOptions)
      } catch (err) {
        reject(err)
      }
    }
  })
})

const usage = {
  cd: {
    strict: 'cd',
    command: 'cd',
    title: 'change working directory',
    header: 'Update the current working directory for local filesystem manipulations',
    optional: localFilepath
  }
}

/**
 * cd command
 *
 */
const cd = ({ command, parsedOptions, execOptions }: IEvaluatorArgs) => {
  const dir = repl.split(command, true, true)[1] || ''
  debug('cd dir', dir)
  return doShell(['!', 'cd', dir], parsedOptions, execOptions)
    .catch(err => {
      err['code'] = 500
      throw err
    })
}

/**
 * Register command handlers
 *
 */
export default (commandTree: CommandRegistrar) => {
  const shellFn = ({ command, execOptions, parsedOptions }) => doShell(repl.split(command, false), parsedOptions, execOptions)
  commandTree.listen('/!', dispatchToShell, { docs: 'Execute a UNIX shell command', noAuthOk: true, requiresLocal: true })

  commandTree.listen('/cd', cd, { usage: usage.cd, noAuthOk: true, requiresLocal: true })
}
