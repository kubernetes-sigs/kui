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
import { join } from 'path'
import { BodyData } from 'needle'
import { DirEntry } from '@kui-shell/plugin-bash-like/fs'
import { Arguments, Capabilities, CodedError, ExecOptions, encodeComponent, i18n } from '@kui-shell/core'

import JSONStream from './json'
import getProxyState from '../../controller/client/proxy'
import { KubeOptions as _KubeOptions, isRecursive } from '../../controller/kubectl/options'
import { getCurrentDefaultContextName, ContextArgs } from '../../controller/kubectl/contexts'

type KubeOptions = Pick<_KubeOptions, 'context'>

const strings = i18n('plugin-kubectl')
const debug = Debug('plugin-kubectl/util/fetch-file')

/** Maximum number of times to retry on ECONNREFUSED */
const MAX_ECONNREFUSED_RETRIES = Capabilities.isHeadless() ? 0 : 10

const httpScheme = /http(s)?:\/\//
const openshiftScheme = /^openshift:\/\//
const kubernetesScheme = /^kubernetes:\/\//

/** Instantiate a kubernetes:// scheme with the current kubectl proxy state */
async function rescheme(url: string, args: ContextArgs): Promise<string> {
  const context = await getCurrentDefaultContextName(args)
  if (kubernetesScheme.test(url)) {
    const { baseUrl } = await getProxyState('kubectl', context)
    return url.replace(kubernetesScheme, baseUrl)
  } else if (openshiftScheme.test(url)) {
    const { baseUrl } = await getProxyState('oc', context)
    return url.replace(openshiftScheme, baseUrl)
  } else {
    return url
  }
}

export interface ObjectStream<T extends object> {
  on(evt: 'data', cb: (obj: T) => void)
  on(evt: 'done', cb: () => void)
}

export async function openStream<T extends object>(
  args: ContextArgs,
  url: string,
  mgmt: Pick<ExecOptions, 'onInit' | 'onReady' | 'onExit'>,
  headers?: Record<string, string>
) {
  if (Capabilities.inBrowser() && Capabilities.hasProxy()) {
    debug('routing openStream request to proxy', url)
    await args.REPL.rexec(
      `_openstream ${encodeComponent(url)}`,
      Object.assign(
        {},
        {
          onInit: mgmt.onInit,
          onReady: mgmt.onReady,
          onExit: mgmt.onExit,
          data: { headers }
        }
      )
    )
    debug('routed openStream to proxy: done', url)
  } else {
    // we need to set JSON to false to disable needle's parsing, which
    // seems not to be compatible with streaming
    const [uri, needle] = await Promise.all([rescheme(url, args), import('needle').then(_ => _.default)])
    debug('routing openStream request to endpoint', uri)
    const stream = needle.get(uri, { headers, parse: false })
    const onData = mgmt.onInit({
      abort: () => {
        debug('abort requested', typeof stream['destroy'])
        if (typeof stream['destroy'] === 'function') {
          stream['destroy']()
        }

        if (typeof mgmt.onExit === 'function') {
          debug('sending onExit')
          mgmt.onExit(0)
        }
      },
      xon: () => stream.resume(),
      xoff: () => stream.pause(),
      resize: () => {
        console.error('Unsupported Operation: resize')
      },
      write: () => {
        console.error('Unsupported Operation: write')
      }
    })

    stream.on('error', err => {
      //
      // It's highly likely to be ok if the stream went away. This is
      // usually a sign that we are in the Kui proxy, and the Kui browser
      // client simply went away.
      //
      // !!DANGER!!: do not throw an exception here, as it will currently
      //             percolate all the way up and result in a Kui proxy
      //             failure due to an uncaughtException.
      //
      if (err.code !== 'ERR_STREAM_DESTROYED') {
        console.error('stream suddenly died', err)
      }
    })

    JSONStream(stream, await onData, mgmt.onExit)
  }
}

interface FetchOptions<Data extends BodyData | BodyData[]> {
  returnErrors?: boolean
  data?: Data
  headers?: Record<string, string>
  method?: 'get' | 'put' | 'post' | 'delete'
  tryFetchEvenInBrowser?: boolean
}

export async function _needle(
  args: ContextArgs,
  url: string,
  opts?: FetchOptions<BodyData>,
  retryCount = 0
): Promise<{ statusCode: number; body: string | object }> {
  if (!Capabilities.inBrowser() || (opts && opts.tryFetchEvenInBrowser)) {
    const method = (opts && opts.method) || 'get'
    const headers = Object.assign({ connection: 'keep-alive' }, opts.headers)
    debug('fetch via needle', method, headers, url)

    // internal usage: test kui's error handling of apiServer
    if (process.env.TRAVIS_CHAOS_TESTING) {
      // simulate a condition where kuiproxy is not installed on the apiserver
      const error: CodedError = new Error('404 page not found')
      error.code = 404
      error.statusCode = 404
      throw error
    }

    try {
      const needle = (await import('needle')).default
      const { statusCode, body } = await needle(method, await rescheme(url, args), opts.data, {
        json: !/\.(md|yaml)$/.test(url),
        follow_max: 10,
        headers
      })
      debug('fetch via needle done', statusCode, url)
      return { statusCode, body }
    } catch (err) {
      if (err.code === 'ECONNREFUSED' && retryCount < MAX_ECONNREFUSED_RETRIES) {
        // then the proxy is probably transiently offline, e.g. due to
        // switching context or namespace
        debug('retrying due to ECONNREFUSED')
        return new Promise((resolve, reject) => {
          setTimeout(async () => {
            try {
              _needle(args, url, opts, retryCount + 1).then(resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 50)
        })
      } else {
        throw err
      }
    }
  } else if (Capabilities.inBrowser()) {
    // Unfortunately, we cannot rely on being able to fetch files
    // directly from a browser. For one, if the remote site does not
    // offer an Access-Control-Allow-Origin, then well behaving
    // browsers will refuse to load their content;
    // e.g. https://k8s.io/examples/controllers/nginx-deployment.yaml
    // Solution: have the kui proxy do this
    if (!Capabilities.hasProxy()) {
      throw new Error(strings('Unable to fetch remote file'))
    } else {
      debug('fetch via proxy')
      const context = await getCurrentDefaultContextName(args)
      const body = (
        await args.REPL.rexec<(string | object)[]>(`_fetchfile ${encodeComponent(url)} --context ${context}`, {
          data: opts
        })
      ).content[0]
      return {
        statusCode: 200,
        body
      }
    }
  }
}

async function fetchRemote(args: ContextArgs, url: string, opts?: FetchOptions<BodyData>) {
  debug('fetchRemote', url, opts)
  const fetchOnce = () =>
    _needle(args, url, opts).then(_ => {
      if (_.statusCode === 0 || _.statusCode === 200 || typeof _.body !== 'string') {
        return _.body
      } else {
        const err: CodedError = new Error(_.body.toString())
        err.code = _.statusCode
        throw err
      }
    })

  const retry = (delay: number) => async (err: Error) => {
    if (/timeout/.test(err.message) || /hang up/.test(err.message) || /hangup/.test(err.message)) {
      debug('retrying', err)
      await new Promise(resolve => setTimeout(resolve, delay))
      return fetchOnce()
    } else {
      throw err
    }
  }

  // fetch with three retries
  return fetchOnce()
    .catch(retry(500))
    .catch(retry(1000))
    .catch(retry(5000))
}

export type ReturnedError = {
  code: number | string
  error: string
}

export type FetchedFile = string | Buffer | object | ReturnedError

export function isReturnedError(file: FetchedFile): file is ReturnedError {
  const err = file as ReturnedError
  return typeof file !== 'string' && !Buffer.isBuffer(file) && typeof err.error === 'string'
}

/**
 * Either fetch a remote file or read a local one
 *
 */
export async function fetchFile(
  args: ContextArgs,
  url: string,
  opts?: FetchOptions<BodyData | BodyData[]>
): Promise<FetchedFile[]> {
  const urls = url.split(/,/)
  debug('fetchFile', urls)
  const start = Date.now()

  const responses = await Promise.all(
    urls.map(async (url, idx) => {
      if (httpScheme.test(url) || kubernetesScheme.test(url) || openshiftScheme.test(url)) {
        debug('fetch remote', url)
        return fetchRemote(
          args,
          url,
          Object.assign({}, opts, { data: !opts ? undefined : Array.isArray(opts.data) ? opts.data[idx] : opts.data })
        ).catch(err => {
          if (opts && opts.returnErrors) {
            return {
              code: err.code,
              error: err.message || JSON.stringify(err)
            }
          } else throw err
        })
      } else {
        const filepath = url
        debug('fetch local', filepath)
        const stats = (await args.REPL.rexec<{ data: string }>(`vfs fstat ${encodeComponent(filepath)} --with-data`))
          .content
        return stats.data
      }
    })
  )

  debug('fetchFile done', Date.now() - start)
  return responses
}

/** same as fetchFile, but returning a string rather than a Buffer */
export async function fetchFileString(
  args: ContextArgs,
  url: string,
  headers?: Record<string, string>
): Promise<(void | string)[]> {
  const files = await fetchFile(args, url, { headers })
  return files.map(_ => {
    try {
      return _ ? (typeof _ === 'string' ? _ : Buffer.isBuffer(_) ? _.toString() : JSON.stringify(_)) : undefined
    } catch (err) {
      console.error('Unable to convert fetched file to string', err, _)
      return ''
    }
  })
}

export async function fetchFileKustomize(args: ContextArgs, url: string): Promise<{ data: string; dir?: string }> {
  const context = await getCurrentDefaultContextName(args)
  const stats = (
    await args.REPL.rexec<{ data: string; dir?: string }>(
      `_fetchfile ${encodeComponent(url)} --kustomize --context ${context}`
    )
  ).content
  return stats
}

/**
 * fetch raw files from `filepath`
 */
export async function fetchRawFiles(args: Arguments<KubeOptions>, filepath: string) {
  if (filepath.match(/http(s)?:\/\//)) {
    return fetchRemote(args, filepath)
  } else {
    const path = args.REPL.encodeComponent(filepath)
    const resourceStats = (
      await args.REPL.rexec<{ data?: string; isDirectory?: boolean }>(`vfs fstat ${path} --with-data`)
    ).content

    if (resourceStats.isDirectory) {
      return args.REPL.rexec<{ path: string }[]>(
        `vfs ls ${join(path, isRecursive(args) ? '/**/*.yaml' : '/*.yaml')} --with-data`
      )
        .then(_ => _.content)
        .then(filenames =>
          Promise.all(
            filenames.map(({ path }) =>
              args.REPL.rexec<{ data: string }>(`vfs fstat ${path} --with-data`).then(_ => _.content.data)
            )
          )
        )
        .then(_ => _.join('---\n'))
    } else {
      return resourceStats.data
    }
  }
}

export default fetchFileString

export async function fetchFilesVFS(
  args: Arguments<KubeOptions>,
  srcs: string | string[],
  fetchNestedYamls?: boolean
): Promise<{ filepath: string; data: string }[]> {
  const filepaths = typeof srcs === 'string' ? [srcs] : srcs

  const path = fetchNestedYamls
    ? filepaths.map(filepath => `${encodeComponent(filepath)} ${encodeComponent(filepath)}/**/*.{yaml,yml}`).join(' ')
    : filepaths.join(' ')
  const paths = new Set((await args.REPL.rexec<DirEntry[]>(`vfs ls ${path}`)).content.map(_ => _.path))

  const raw = await fetchFileString(args, paths.size === 0 ? filepaths.join(',') : Array.from(paths).join(','))

  return raw.map((data, idx) => {
    if (data) {
      return { filepath: paths.size === 0 ? filepaths[idx] : Array.from(paths)[idx], data }
    }
  })
}

interface Kustomization {
  resources?: string[]
}

export async function fetchKusto(args: Arguments<KubeOptions>, kusto: string) {
  const [{ load }, { join }, raw] = await Promise.all([
    import('js-yaml'),
    import('path'),
    fetchFileKustomize(args, kusto)
  ])

  const kustomization = load(raw.data) as Kustomization

  if (kustomization.resources) {
    const resources = kustomization.resources
      .map(resource => encodeComponent(raw.dir ? join(raw.dir, resource) : resource))
      .join(' ')
    const files = await fetchFilesVFS(args, resources)
    return {
      customization: { filepath: kusto, data: raw.data, contentType: 'yaml', isFor: 'k' },
      templates: files.map(({ filepath, data }) => ({ filepath, data, contentType: 'yaml', isFor: 'k' }))
    }
  }
}
