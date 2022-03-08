/*
 * Copyright 2022 The Kubernetes Authors
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
 * This module implements a Webpack loader that inlines markdown
 * snippets at build time.
 *
 */

import Debug from 'debug'
import needle from 'needle'
import { readFile } from 'fs'
import { validate } from 'schema-utils'
import { getOptions } from 'loader-utils'

import { CodedError, RawResponse } from '@kui-shell/core'

import inlineSnippets from './snippets'

const debug = Debug('snippets-main')

/** The schema for our Webpack loader */
const schema = {
  additionalProperties: false,
  properties: {
    esModule: {
      type: 'boolean' as const
    }
  },
  type: 'object' as const
}

/** Fetch a local file */
async function fetchFile(filepath: string) {
  debug('fetching file', filepath)
  return new Promise((resolve, reject) => {
    readFile(filepath, (err, data) => {
      if (err) {
        debug('error fetching file', err)
        reject(err)
      } else {
        debug('successfully fetched file', filepath)
        resolve(data.toString())
      }
    })
  })
}

/** Fetch a remote file */
async function fetchUrl(filepath: string): Promise<string> {
  debug('fetching url', filepath)
  const data = await needle('get', filepath)
  if (data.statusCode !== 200) {
    debug('error fetching url', filepath, data.statusCode)
    const error: CodedError = new Error(data.body)
    error.code = data.statusCode
    throw error
  } else {
    debug('successfully fetched url', filepath, data.body)
    return data.body
  }
}

/**
 * This is the entrypoint for our webpack loader
 * @param   {String}  content   Markdown file content
 */
function loader(
  this: { async: () => (err: Error, data?: string) => void; resourcePath?: string },
  data: string,
  srcFilePath: string = this.resourcePath
) {
  const callback = this.async()
  const options = getOptions(this)

  validate(schema, options, { name: 'snippet-inliner' })

  const REPL = {
    rexec: async (cmdline: string) => {
      const filepath = cmdline
        .replace(/^vfs (_fetchfile|fstat)\s+/, '')
        .replace(/--with-data/g, '')
        .trim()

      if (/^vfs _fetchfile/.test(cmdline)) {
        const content = [await fetchUrl(filepath)]

        return { mode: 'raw' as const, content } as RawResponse<any>
      } else if (/^vfs fstat/.test(cmdline)) {
        const content = {
          data: await fetchFile(filepath)
        }
        return { mode: 'raw' as const, content } as RawResponse<any>
      } else {
        throw new Error(`Unsupported operation ${cmdline}`)
      }
    },
    pexec: undefined,
    reexec: undefined,
    qexec: undefined,
    click: undefined,
    split: undefined,
    encodeComponent: undefined
  }

  const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true
  const exportIt = (data: string) => {
    const json = JSON.stringify(data)
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')

    return (esModule ? 'export default ' : 'module.exports = ') + json
  }

  inlineSnippets({ REPL })(data, srcFilePath)
    .then(exportIt)
    .then(data => callback(null, data))
    .catch(callback)
}

/** Fake `this` for non-webpack "main" usage */
class Fake {
  public async() {
    return (err: Error, data?: string) => {
      if (err) {
        throw err
      } else {
        console.log(data)
      }
    }
  }
}

if (require.main === module) {
  // called directly from the command line
  readFile(process.argv[2], (err, data) => {
    if (err) {
      throw err
    } else {
      loader.bind(new Fake())(data.toString(), process.argv[2])
    }
  })
} else {
  // nothing special to do if we are coming from webpack
}

export default loader
