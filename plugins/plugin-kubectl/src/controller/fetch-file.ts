/*
 * Copyright 2018 The Kubernetes Authors
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
import { Arguments, Registrar } from '@kui-shell/core'

import KubeOptions from './kubectl/options'
import { openStream, fetchFile, fetchFileString } from '../lib/util/fetch-file'

const debug = Debug('plugin-kubectl/controller/fetch-file')

type Options = KubeOptions & {
  kustomize?: boolean
}

async function isFile(filepath: string): Promise<boolean> {
  const { lstat } = await import('fs')
  return new Promise((resolve, reject) => {
    lstat(filepath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false)
        } else {
          reject(err)
        }
      } else {
        resolve(stats.isFile())
      }
    })
  })
}

async function fetchKustomizeString(
  args: Parameters<typeof fetchFileString>[0],
  uri: string
): Promise<{ data: string; dir?: string }> {
  const [isFile0, { join }] = await Promise.all([isFile(uri), import('path')])

  if (isFile0) {
    return { data: await fetchFileString(args, uri)[0] }
  } else {
    const k1 = join(uri, 'kustomization.yml')
    const k2 = join(uri, 'kustomization.yaml')
    const k3 = join(uri, 'Kustomization')

    const [isFile1, isFile2, isFile3] = await Promise.all([isFile(k1), isFile(k2), isFile(k3)])
    const dir = uri // if we are here, then `uri` is a directory
    if (isFile1) {
      return { data: (await fetchFileString(args, k1))[0] || '', dir }
    } else if (isFile2) {
      return { data: (await fetchFileString(args, k2))[0] || '', dir }
    } else if (isFile3) {
      return { data: (await fetchFileString(args, k3))[0] || '', dir }
    }
  }
}

/**
 * A server-side shim to allow browser-based clients to fetch `-f`
 * file content.
 *
 */
export default (registrar: Registrar) => {
  registrar.listen(
    `/_openstream`,
    async (args: Arguments<KubeOptions>) => {
      const uri = args.argvNoOptions[args.argvNoOptions.indexOf('_openstream') + 1]
      const headers =
        typeof args.execOptions.data === 'object' && !Buffer.isBuffer(args.execOptions.data)
          ? args.execOptions.data.headers
          : undefined
      debug('openstream', uri)

      if (!args.execOptions.onInit) {
        throw new Error('Internal Error: onInit required')
      }

      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          await openStream(
            args,
            uri,
            {
              onInit: args.execOptions.onInit,
              onReady: args.execOptions.onReady,
              onExit: exitCode => {
                debug('got exit from stream', exitCode)
                if (args.execOptions.onExit) {
                  args.execOptions.onExit(exitCode)
                }
                resolve(true)
              }
            },
            headers
          )
        } catch (err) {
          reject(err)
        }
      })
    },
    { requiresLocal: true }
  )

  registrar.listen(
    `/_fetchfile`,
    async (args: Arguments<Options>) => {
      const { argvNoOptions, parsedOptions, execOptions } = args

      const uri = argvNoOptions[argvNoOptions.indexOf('_fetchfile') + 1]
      const opts =
        typeof execOptions.data === 'object' && !Buffer.isBuffer(execOptions.data) ? execOptions.data : undefined

      if (!parsedOptions.kustomize) {
        return { mode: 'raw', content: await fetchFile(args, uri, opts) }
      } else {
        return { mode: 'raw', content: await fetchKustomizeString(args, uri) }
      }
    },
    { requiresLocal: true, flags: { boolean: ['kustomize'] } }
  )
}
