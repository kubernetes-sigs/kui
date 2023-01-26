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
import { basename, dirname } from 'path'

import type { MultiModalResponse, Arguments, Registrar, KResponse, ParsedOptions } from '@kui-shell/core'

import File from './File'
import { contentTypeOf } from './open'
import { fslice } from '../vfs/delegates'

export interface HeadOptions extends ParsedOptions {
  n: number // line counts
  c: number // bytes
}

export async function showResponseAsMMR(filepath: string, data: string): Promise<MultiModalResponse> {
  const suffix = filepath.substring(filepath.lastIndexOf('.') + 1)
  const enclosingDirectory = dirname(filepath)
  const packageName = enclosingDirectory === '.' ? undefined : enclosingDirectory

  const [{ i18n }, { absolute, expandHomeDir }] = await Promise.all([
    import('@kui-shell/core/mdist/api/i18n'),
    import('@kui-shell/core/mdist/api/Util')
  ])

  const strings = i18n('plugin-bash-like')

  const mode = {
    mode: 'view',
    label: strings('View'),
    contentType: contentTypeOf(suffix),
    content: data
  }

  const response: MultiModalResponse<File> = {
    apiVersion: 'kui-shell/v1',
    kind: 'File',
    metadata: {
      name: basename(filepath),
      namespace: packageName
    },
    modes: [mode],
    spec: {
      filepath,
      size: 0,
      fullpath: absolute(expandHomeDir(filepath))
    }
  }

  return response
}

async function head(args: Arguments<HeadOptions>): Promise<KResponse> {
  const { argvNoOptions, parsedOptions } = args
  const filepath = argvNoOptions[argvNoOptions.indexOf('head') + 1]
  const debug = Debug('plugins/bash-like/cmds/head')
  debug('head', filepath)

  if (typeof filepath === 'number' && filepath < 0) {
    // special case for command: e.g. head -10 file
    // change `head -10 file` to `head -n 10 file`
    const newarg = `-n ${filepath * -1}`
    return args.REPL.qexec(args.command.replace(filepath, newarg))
  } else if (typeof filepath === 'undefined') {
    throw new Error('Missing input file')
  }

  try {
    const data = await fslice(
      filepath,
      0,
      parsedOptions.c || parsedOptions.n || 10,
      parsedOptions.c ? 'bytes' : 'lines'
    )

    const { isHeadless, inProxy } = await import('@kui-shell/core/mdist/api/Capabilities')
    if (isHeadless() && !inProxy()) {
      return data
    } else {
      return showResponseAsMMR(filepath, data)
    }
  } catch (err) {
    throw new Error(`head: ${err.message}`)
  }
}

/**
 * Register command handlers
 *
 */
export default (registrar: Registrar) => {
  registrar.listen('/head', head, {
    requiresLocal: true
  })
}
