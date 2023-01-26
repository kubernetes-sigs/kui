/*
 * Copyright 2021 The Kubernetes Authors
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
import type { Arguments, Registrar, KResponse } from '@kui-shell/core'

import { FStat } from '../'
import { fslice } from '../vfs/delegates'
import { HeadOptions, showResponseAsMMR } from './head'

type TailOptions = HeadOptions & {
  q: boolean
  f: boolean
  F: boolean
}

async function tail(args: Arguments<TailOptions>): Promise<KResponse> {
  if (args.parsedOptions.q || args.parsedOptions.f || args.parsedOptions.F) {
    return args.REPL.qexec(
      `sendtopty ${args.command}`,
      undefined,
      undefined,
      Object.assign(args.execOptions, { quiet: false })
    )
  }

  const debug = Debug('plugins/bash-like/cmds/tail')
  const { argvNoOptions, parsedOptions } = args
  const filepath = argvNoOptions[argvNoOptions.indexOf('tail') + 1]
  debug('tail', filepath)

  if (typeof filepath === 'number' && filepath < 0) {
    // special case for command: e.g. head -10 file
    // change `head -10 file` to `head -n 10 file`
    const newarg = `-n ${filepath * -1}`
    return args.REPL.qexec(args.command.replace(filepath, newarg))
  }

  const { encodeComponent } = await import('@kui-shell/core/mdist/api/Exec')
  const { size } = (await args.REPL.rexec<FStat>(`vfs fstat ${encodeComponent(filepath)}`)).content

  try {
    let data = ''

    if (parsedOptions.c) {
      // tail bytes: easy
      data = await fslice(filepath, size - parsedOptions.c, parsedOptions.c, 'bytes')
    } else {
      // tail lines: a bit harder
      const nLinesDesired = parsedOptions.n || 10
      let nLinesLeft = nLinesDesired
      const chunkSize = 4 * 1024
      let offset = Math.max(0, size - chunkSize)

      while (nLinesLeft > 0 && offset >= 0) {
        const rawData = await fslice(filepath, offset, -nLinesLeft, 'lines', offset + chunkSize)

        const rawDataNLines = rawData.split(/\n/).length

        nLinesLeft -= rawDataNLines
        offset -= chunkSize
        data += rawData
      }
    }

    return showResponseAsMMR(filepath, data)
  } catch (err) {
    throw new Error(`tail: ${err.message}`)
  }
}

/**
 * Register command handlers
 *
 */
export default (registrar: Registrar) => {
  registrar.listen('/tail', tail, {
    requiresLocal: true,
    flags: {
      boolean: ['f', 'F', 'q']
    }
  })
}
