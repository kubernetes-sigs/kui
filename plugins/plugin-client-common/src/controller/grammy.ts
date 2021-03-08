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

import PromisePool from '@supercharge/promise-pool'

import { Arguments, Row, Registrar, Table, UsageModel, encodeComponent } from '@kui-shell/core'

/**
 * grammy command usage
 */
const usage: UsageModel = {
  command: 'grammy',
  strict: 'grammy',
  example: 'grammy filepath',
  docs: 'Grammy'
}

async function doHistogram(args: Arguments): Promise<Table> {
  const { REPL, argvNoOptions } = args
  const filepath = argvNoOptions[1]
  if (filepath) {
    const files = (await REPL.rexec<{ name: string; path: string }[]>(`vfs ls ${REPL.encodeComponent(filepath)}`))
      .content

    const histo: Record<string, number> = {}
    await PromisePool.withConcurrency(1024)
      .for(files)
      .process(async ({ path }) => {
        const data = (await REPL.rexec<string>(`vfs fslice ${encodeComponent(path)} 0`)).content

        if (data) {
          data
            .split('\n')
            .map(_ => {
              const line = _.trim()
              const count = line.slice(0, line.indexOf(' '))
              const occurence = line.replace(count, '').trim()
              if (count && occurence) {
                if (histo[occurence]) {
                  histo[occurence] += parseInt(count)
                } else {
                  histo[occurence] = parseInt(count)
                }
              }
            })
            .filter(_ => _)
        }
      })

    const body: Row[] = Object.entries(histo).map(([occurence, count]) => {
      return {
        rowKey: occurence,
        name: occurence,
        attributes: [
          {
            key: 'Count',
            value: count.toString() // FIXME: cell value could be number
          }
        ]
      }
    })

    const header = {
      name: 'Name',
      attributes: [{ key: 'Count', value: 'Count' }]
    }

    return {
      body,
      header,
      title: args.command,
      defaultPresentation: 'histogram'
    }
  } else {
    throw new Error('grammy: file not provided')
  }
}

/**
 * This plugin introduces the /grammy command
 *
 */
export default async (commandTree: Registrar) => {
  commandTree.listen('/grammy', doHistogram, { usage })
}
