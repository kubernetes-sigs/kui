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

import { lstat, readFile } from 'fs'
import { dirname, resolve as pathResolve } from 'path'
import { Parser } from 'htmlparser2/lib/Parser'

import { Arguments, expandHomeDir } from '@kui-shell/core'

/**
 * Deploy a linked asset
 *
 */
const link = ({ REPL }: Arguments, dir: string, file: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const filepath = pathResolve(dir, file)
    lstat(filepath, (err, stats) => {
      if (stats) {
        const mime = file.endsWith('.js') ? '.webjs' : ''
        REPL.qexec(`let ${file}${mime} = ${filepath}`).then(() => resolve(), reject)
      }
      if (err) {
        resolve()
      }
    })
  })

/**
 * Turn an attribute map into a key=value string
 *
 */
const mapToString = (map: Record<string, string>): string => {
  let str = ''
  for (const key in map) {
    str += ` ${key}="${map[key]}"`
  }
  return str
}

/**
 * If we store certain content as OpenWhisk actions, they will need to
 * be served with a .http extension
 *
 */
const webbify = (uri: string): string => {
  if (uri.endsWith('.css') || uri.endsWith('.png')) {
    return `${uri.substring(0, uri.lastIndexOf('.'))}.http`
  } else {
    return uri
  }
}

/**
 * Deploy an HTML page, along with any locally linked scripts and stylesheets
 *
 */
export const deployHTMLViaOpenWhisk = (command: Arguments, location: string) =>
  new Promise((resolve, reject) => {
    try {
      const filepath = expandHomeDir(location)
      const dir = dirname(filepath)

      readFile(filepath, (err, data) => {
        try {
          if (err) {
            reject(err)
          }

          const Ps = [] // for any other assets we may need to create
          let text = '' // we may need to rewrite the content

          const parser = new Parser(
            {
              onopentag: (name: string, attribs) => {
                if (name === 'script' && attribs.src) {
                  const webbed = webbify(attribs.src)
                  Ps.push(link(command, dir, attribs.src))
                  attribs.src = webbed
                } else if (name === 'link' && attribs.href) {
                  const webbed = webbify(attribs.href)
                  Ps.push(link(command, dir, attribs.href))
                  attribs.href = webbed
                }

                text += `<${name}${mapToString(attribs)}>`
              },
              ontext: txt => {
                text += txt
              },
              onclosetag: tagname => {
                if (tagname !== 'img' && tagname !== 'link') {
                  text += `</${tagname}>`
                }
              }
            } /*, {decodeEntities: true} */
          )

          parser.write(data.toString())
          parser.end()

          // wait for the promises to complete
          Promise.all(Ps)
            .then(() => resolve({ location, text })) // return the location and updated text
            .catch(reject)
        } catch (err) {
          reject(err)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
