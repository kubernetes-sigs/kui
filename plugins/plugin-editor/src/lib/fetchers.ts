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

import Debug from 'debug'
import { basename, dirname } from 'path'

import { Tab, ParsedOptions, ExecOptions } from '@kui-shell/core'

import Entity from './entity'

const debug = Debug('plugins/editor/fetchers')

export type IFetcher = (
  entityName: string,
  parsedOptions?: ParsedOptions,
  execOptions?: ExecOptions,
  createIfAbsent?: boolean,
  tab?: Tab
) => Promise<Entity>

/**
 * Register an entity fetcher for a given entity kind
 *
 */
const fetchers: { fetcher: IFetcher }[] = []
export const registerFetcher = (fetcher: IFetcher): void => {
  fetchers.push({ fetcher })
}

/**
 * Touch a local filepath
 *
 */
function createFile(tab: Tab, filepath: string, execOptions: ExecOptions) {
  return tab.REPL.rexec(
    `touch ${tab.REPL.encodeComponent(filepath)}`,
    Object.assign({}, execOptions, { forceProxy: true })
  )
}

/**
 * Creates parent directories if needed, then creates a file then edits it
 *
 */
async function createFilepath(tab: Tab, filepath: string, execOptions: ExecOptions) {
  const dir = dirname(filepath)
  const base = basename(filepath)

  if (base !== filepath) {
    debug('making parent directories', dir)
    await tab.REPL.rexec(
      `mkdir -p ${tab.REPL.encodeComponent(dir)}`,
      Object.assign({}, execOptions, { forceProxy: true })
    )
  }

  return createFile(tab, filepath, execOptions)
}

interface FStat {
  isDirectory: boolean
  filepath: string
  fullpath: string
  data: string
}

/**
 * Read a local file, optionally creating it
 *
 */
export const fetchFile: IFetcher = async (
  filepath: string,
  parsedOptions: ParsedOptions,
  execOptions: ExecOptions,
  createIfAbsent: boolean,
  tab: Tab
): Promise<Entity> => {
  let stats: FStat
  try {
    if (!tab) {
      const { getTabFromTarget, getCurrentPrompt } = await import('@kui-shell/core')
      tab = getTabFromTarget(getCurrentPrompt())
    }

    stats = (await tab.REPL.rexec<FStat>(`fstat ${tab.REPL.encodeComponent(filepath)} --with-data`)).content
  } catch (err) {
    debug('error code', err.code)
    if (err.code === 404 && createIfAbsent) {
      // Code is a string in this case, not a number
      debug('creating file')
      return createFilepath(tab, filepath, execOptions).then(() => fetchFile(filepath, parsedOptions, execOptions)) // no create flag here, so no infinite recursion
    }
    throw err
  }
  if (stats.isDirectory) {
    throw new Error('Specified file is a directory')
  } else if (createIfAbsent) {
    throw new Error(`'${filepath}' cannot be created because it already exists`)
  } else {
    const name = basename(filepath)

    const dotIdx = filepath.lastIndexOf('.')
    const extension = dotIdx < 0 ? 'text' : filepath.substring(dotIdx + 1)
    const kind =
      extension === 'js' ? 'javascript' : extension === 'ts' ? 'typescript' : extension === 'py' ? 'python' : extension

    const { persisters } = await import('./persisters')

    return {
      type: 'file',
      name,
      kind,
      filepath: stats.filepath,
      metadata: {
        name,
        namespace: dirname(stats.fullpath)
      },
      exec: {
        kind,
        code: stats.data
      },
      annotations: [],
      persister: persisters.files
    }
  }
}

/**
 * See if we one of the registered entity fetchers knows how to fetch
 * the text for the given named entity
 *
 */
export const fetchEntity = async (
  tab: Tab,
  entityName: string,
  parsedOptions: ParsedOptions,
  execOptions: ExecOptions
): Promise<Entity> => {
  if (!parsedOptions.create) {
    // The --create option means don't try any of the other fetchers;
    // so we skip over this block of code, and proceed directly to the
    // end, where we call fetchFile with createIfAbsent=true
    for (let idx = 0; idx < fetchers.length; idx++) {
      const { fetcher } = fetchers[idx]

      try {
        const entity = await fetcher(entityName, parsedOptions, execOptions, false, tab)
        if (entity) {
          return entity
        }
      } catch (err) {
        debug('got error from fetcher', err.code, err.statusCode, err)
        if (err.code !== 404) {
          throw err
        }
      }
    }
  }

  debug('treating this as an createIfAbsent edit of a local filepath')
  return fetchFile(entityName, parsedOptions, execOptions, true, tab)
}

/* register the built-in local file fetcher */
registerFetcher(fetchFile)
