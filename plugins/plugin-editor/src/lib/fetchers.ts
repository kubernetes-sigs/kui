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

import { basename } from 'path'

import { encodeComponent, qexec } from '@kui-shell/core/core/repl'
import { MetadataBearing } from '@kui-shell/core/models/entity'

import { persisters } from './persisters'
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
  viewName?: string
  extractName?: (raw: string) => string // re-extract name from raw source, e.g. after a save or revert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lock?: any // set to false if you don't want a lock icon
  filepath?: string
  exec: ExecSpec
  persister: any // eslint-disable-line @typescript-eslint/no-explicit-any
  gotoReadonlyView?: (Getter) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  annotations: KeyValuePair[]
}

export type IFetcher = (name: string, parsedOptions?, execOptions?) => Promise<Entity>

/**
 * Register an entity fetcher for a given entity kind
 *
 */
const fetchers = []
export const registerFetcher = (fetcher: IFetcher): void => {
  debug('registerFetcher')
  fetchers.push({ fetcher })
}

/**
 * See if we one of the registered entity fetchers knows how to fetch
 * the text for the given named entity
 *
 */
export const fetchEntity = async (name: string, parsedOptions, execOptions): Promise<Entity> => {
  let lastError
  for (let idx = 0; idx < fetchers.length; idx++) {
    const { fetcher } = fetchers[idx]

    try {
      const entity = await fetcher(name, parsedOptions, execOptions)
      if (entity) {
        return entity
      }
    } catch (err) {
      debug('got error from fetcher', err)
      if (!lastError || (err.code && err.code !== 404)) {
        lastError = err
      }
    }
  }

  if (lastError) {
    throw lastError
  }
}

/**
 * Read a local file
 *
 */
export const fetchFile: IFetcher = async (name: string): Promise<Entity> => {
  const stats: { isDirectory: boolean; filepath: string; data: string } = await qexec(
    `fstat ${encodeComponent(name)} --with-data`
  )

  if (stats.isDirectory) {
    throw new Error('Specified file is a directory')
  } else {
    const extension = name.substring(name.lastIndexOf('.') + 1)
    const kind =
      extension === 'js' ? 'javascript' : extension === 'ts' ? 'typescript' : extension === 'py' ? 'python' : extension

    return {
      type: 'file',
      name: basename(name),
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

/* register the built-in local file fetcher */
registerFetcher(fetchFile)
