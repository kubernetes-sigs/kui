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

import { PromisePool } from '@supercharge/promise-pool'

import { GlobStats } from '@kui-shell/plugin-bash-like/fs'
import { Arguments, ParsedOptions, i18n, Row, Registrar, Table, UsageModel, encodeComponent } from '@kui-shell/core'

const strings = i18n('plugin-core-support')

/**
 * grammy command usage
 */
const usage: UsageModel = {
  command: 'grammy',
  strict: 'grammy',
  example: 'grammy filepath',
  docs: 'Grammy',
  optional: [{ name: '--color', alias: '-c', boolean: true }]
}

interface Options extends ParsedOptions {
  color: boolean
}

async function doHistogram(args: Arguments<Options>): Promise<Table> {
  const { REPL, argvNoOptions } = args
  const filepath = argvNoOptions[1]

  if (filepath) {
    const histo: Record<string, number> = {}
    const files = (await REPL.rexec<GlobStats[]>(`vfs ls -l ${REPL.encodeComponent(filepath)}`)).content

    const pushToHistogram = (content: string) => {
      if (content) {
        content
          .split('\n')
          .map(_ => {
            const line = _.trim()
            const separator = line.indexOf(' ')

            if (separator !== -1) {
              const countPart = line.slice(0, separator)
              const occurence = line.replace(countPart, '').trim()
              const count = parseInt(countPart)

              if (countPart && !isNaN(count) && occurence) {
                if (histo[occurence]) {
                  histo[occurence] += count
                } else {
                  histo[occurence] = count
                }
              }
            }
          })
          .filter(_ => _)
      }
    }

    const accumulatorKey = (path: string, mtimeMs: number) => `${path}-${mtimeMs}`

    const fetchFile = async (path: string) => {
      return (await REPL.rexec<string>(`vfs fslice ${encodeComponent(path)} 0`)).content
    }

    const fetchAndCache = async (path: string, mtimeMs: number) => {
      const data = await fetchFile(path)
      if (args.execOptions.watch) {
        args.execOptions.watch.accumulator[accumulatorKey(path, mtimeMs)] = { data }
      }
      return data
    }

    const getOrCreate = async (path: string, mtimeMs: number): Promise<string> => {
      return args.execOptions.watch && args.execOptions.watch.accumulator[accumulatorKey(path, mtimeMs)]
        ? args.execOptions.watch.accumulator[accumulatorKey(path, mtimeMs)].data
        : await fetchAndCache(path, mtimeMs)
    }

    await PromisePool.withConcurrency(1024)
      .for(files)
      .process(async ({ path, stats }) => {
        pushToHistogram(await getOrCreate(path, stats.mtimeMs))
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
      title: strings('Histogram'),
      defaultPresentation: 'histogram',
      colorBy: args.parsedOptions.color ? 'default' : undefined
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
  commandTree.listen('/grammy', doHistogram, { usage, flags: { boolean: ['color', 'c'] } })
}
