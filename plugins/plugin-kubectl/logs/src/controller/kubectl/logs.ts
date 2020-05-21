/*
 * Copyright 2019-2020 IBM Corporation
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

import Debug from 'debug'
import { Abortable, Arguments, FlowControllable, Registrar, Streamable } from '@kui-shell/core'
import {
  isUsage,
  doHelp,
  KubeOptions,
  doExecWithPty,
  doExecWithStdout,
  defaultFlags as flags,
  isHelpRequest
} from '@kui-shell/plugin-kubectl'

import commandPrefix from '../command-prefix'

interface LogOptions extends KubeOptions {
  f: string
  follow: string
  previous: boolean
  tail: number
}

const debug = Debug('plugin-kubectl/logs/controller/kubectl/logs')

/**
 * Send the request to a PTY for deeper handling, then (possibly) add
 * some ANSI control codes for coloring.
 *
 */
export async function doLogs(args: Arguments<LogOptions>) {
  if (isUsage(args)) {
    // special case: get --help/-h
    return doHelp('kubectl', args)
  }

  if (args.execOptions.raw) {
    return doExecWithStdout(args)
  }

  // if the user has not specified a "--tail",
  // then add one, to prevent the default behavior of
  // kubectl which fetches quite a bit of history
  if (!args.parsedOptions.tail) {
    const tail = 1000
    args.parsedOptions.tail = tail
    args.argv.push('--tail=' + tail)
    args.command = args.command + ' --tail=' + tail
  }

  // a bit of plumbing: tell the PTY that we will be handling everything
  const myExecOptions = Object.assign({}, args.execOptions, {
    rethrowErrors: true, // we want to handle errors
    quiet: true, // don't ever emit anything on your own
    replSilence: true, // repl: same thing
    echo: false, // do not even echo "ok"

    // the PTY will call this when the PTY process is ready; in
    // return, we send it back a consumer of streaming output
    onInit: async (ptyJob: Abortable & FlowControllable) => {
      // set up the PTY stream; we want to stream to this stdout sink
      const stdout = args.execOptions.onInit ? await args.execOptions.onInit(ptyJob) : await args.createOutputStream()

      // _ is one chunk of streaming output
      return (_: Streamable) => {
        if (args.block && args.block['isCancelled']) {
          ptyJob.abort()
        } else if (typeof _ === 'string') {
          // we only know how to handle strings
          stdout(_)
        }
      }
    }
  })

  // be careful not to smash the original execOptions!
  const myArgs = Object.assign({}, args, { execOptions: myExecOptions })
  return doExecWithPty(myArgs).catch(err => {
    if (isHelpRequest(args)) {
      return err
    } else {
      debug(err)
      return true
    }
  })
}

export default (registrar: Registrar) => {
  registrar.listen(`/${commandPrefix}/kubectl/logs`, doLogs, flags)
  registrar.listen(`/${commandPrefix}/k/logs`, doLogs, flags)
}
