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
import { basename, dirname } from 'path'

import { Commands, REPL } from '@kui-shell/core'
import { MetadataBearing } from '@kui-shell/core/models/entity'

import { persisters, Persister } from './persisters'

const debug = Debug('plugins/editor/fetchers')

interface ExecSpec {
  kind: string
  code: string
}

interface KeyValuePair {
  key: string
  value: string
}

interface Getter {
  getEntity: () => object
}

export interface Entity extends MetadataBearing {
  type: string
  name: string
  noZoom?: boolean
  viewName?: string
  extract?: (raw: string, entity: Entity) => Entity
  extractName?: (raw: string) => string // re-extract name from raw source, e.g. after a save or revert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lock?: any // set to false if you don't want a lock icon
  filepath?: string
  exec: ExecSpec
  persister?: Persister
  gotoReadonlyView?: (Getter) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  annotations: KeyValuePair[]
}

export type IFetcher = (
  entityName: string,
  parsedOptions?: Commands.ParsedOptionsFull,
  execOptions?: Commands.ExecOptions,
  createIfAbsent?: boolean
) => Promise<Entity>

/**
 * Register an entity fetcher for a given entity kind
 *
 */
const fetchers: { fetcher: IFetcher }[] = []
export const registerFetcher = (fetcher: IFetcher): void => {
  debug('registerFetcher')
  fetchers.push({ fetcher })
}

/**
 * Touch a local filepath
 *
 */
function createFile(filepath: string, execOptions: Commands.ExecOptions) {
  return REPL.rexec(`touch ${REPL.encodeComponent(filepath)}`, Object.assign({}, execOptions, { forceProxy: true }))
}

/**
 * Creates parent directories if needed, then creates a file then edits it
 *
 */
async function createFilepath(filepath: string, execOptions: Commands.ExecOptions) {
  const dir = dirname(filepath)
  const base = basename(filepath)

  if (base !== filepath) {
    debug('making parent directories', dir)
    await REPL.rexec(`mkdir -p ${REPL.encodeComponent(dir)}`, Object.assign({}, execOptions, { forceProxy: true }))
  }

  return createFile(filepath, execOptions)
}

/**
 * Read a local file, optionally creating it
 *
 */
export const fetchFile: IFetcher = async (
  filepath: string,
  parsedOptions: Commands.ParsedOptionsFull,
  execOptions: Commands.ExecOptions,
  createIfAbsent: boolean
): Promise<Entity> => {
  let stats: { isDirectory: boolean; filepath: string; data: string }
  try {
    stats = await REPL.qexec(`fstat ${REPL.encodeComponent(filepath)} --with-data`)
  } catch (err) {
    debug('error code', err.code)
    if (err.code === 404 && createIfAbsent) {
      // Code is a string in this case, not a number
      debug('creating file')
      return createFilepath(filepath, execOptions).then(() => fetchFile(filepath, parsedOptions, execOptions)) // no create flag here, so no infinite recursion
    }
    throw err
  }
  if (stats.isDirectory) {
    throw new Error('Specified file is a directory')
  } else if (createIfAbsent) {
    throw new Error(`'${filepath}' cannot be created because it already exists`)
  } else {
    const dotIdx = filepath.lastIndexOf('.')
    const extension = dotIdx < 0 ? 'text' : filepath.substring(dotIdx + 1)
    const kind =
      extension === 'js' ? 'javascript' : extension === 'ts' ? 'typescript' : extension === 'py' ? 'python' : extension

    return {
      type: 'file',
      name: basename(filepath),
      filepath: stats.filepath,
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
  entityName: string,
  parsedOptions: Commands.ParsedOptionsFull,
  execOptions: Commands.ExecOptions
): Promise<Entity> => {
  if (!parsedOptions.create) {
    // The --create option means don't try any of the other fetchers;
    // so we skip over this block of code, and proceed directly to the
    // end, where we call fetchFile with createIfAbsent=true
    for (let idx = 0; idx < fetchers.length; idx++) {
      const { fetcher } = fetchers[idx]

      try {
        const entity = await fetcher(entityName, parsedOptions, execOptions, false)
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
  return fetchFile(entityName, parsedOptions, execOptions, true)
}

/* register the built-in local file fetcher */
registerFetcher(fetchFile)
