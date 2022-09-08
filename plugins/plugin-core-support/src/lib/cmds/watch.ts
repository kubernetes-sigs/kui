/*
 * Copyright 2020 The Kubernetes Authors
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

import {
  Abortable,
  ExecOptions,
  Watcher,
  WatchPusher,
  isTable,
  KResponse,
  ParsedOptions,
  Registrar,
  ScalarResponse,
  Arguments
} from '@kui-shell/core'

const debug = Debug('plugins/plugin-core-support/watch')

interface Options extends ParsedOptions {
  n: number
  interval: number

  t: string
  'no-title': string

  until: string // keep watching until this command return true
}

class TableWatcher implements Abortable, Watcher {
  private timeout: ReturnType<typeof setInterval>
  private pusher: WatchPusher

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly args: Arguments,
    private readonly command: string,
    private readonly interval: number,
    private readonly watchState: ExecOptions['watch'],
    private readonly until?: string
  ) {}

  private async poll() {
    const table = await this.args.REPL.qexec(this.command, undefined, undefined, {
      watch: { iteration: this.watchState.iteration++, accumulator: this.watchState.accumulator }
    })

    if (isTable(table)) {
      this.pusher.header(table.header)
      this.pusher.setBody(table.body)
    } else {
      this.abort()
    }
  }

  public async init(pusher: WatchPusher) {
    let inProgress = false
    this.pusher = pusher

    this.timeout = setInterval(async () => {
      if (inProgress) {
        return
      }

      inProgress = true
      await this.poll()

      if (this.until) {
        try {
          if (await this.args.REPL.qexec<boolean>(this.until)) {
            // poll one more time after the until condition is reached
            // to pick up any leftover information that appeared
            // between the last poll and the time the condition was met
            await this.poll()
            this.abort()
          }
        } catch (err) {
          debug(`watch-until failed exeuting ${this.until}`, err)
        }
      }

      inProgress = false
    }, this.interval)
  }

  public async abort() {
    clearInterval(this.timeout)
    this.pusher.done()
  }
}

export default function (registrar: Registrar) {
  registrar.listen<KResponse, Options>(
    '/watch',
    async args => {
      const until = args.parsedOptions.until
      const endOfCmd = !until ? args.command.length : args.command.indexOf('--until')
      const cmdline = args.command.slice(args.argvNoOptions[0].length + 1, endOfCmd)
      const watchState = { accumulator: {}, iteration: 1 }

      const response = await args.REPL.qexec(cmdline, undefined, undefined, { watch: watchState })
      const interval = args.parsedOptions.n || args.parsedOptions.interval || 2000

      if (isTable(response)) {
        return Object.assign(response, { watch: new TableWatcher(args, cmdline, interval, watchState, until) })
      } else {
        const poll = () => args.REPL.reexec(args.command, { execUUID: args.execOptions.execUUID })

        const timeout = setTimeout(async () => {
          await poll()

          if (until) {
            try {
              if (await args.REPL.qexec<boolean>(until)) {
                await poll()
                clearTimeout(timeout)
              }
            } catch (err) {
              debug(`watch-until failed exeuting ${until}`, err)
            }
          }
        }, interval)

        return {
          response: response as ScalarResponse,
          abort: () => {
            clearTimeout(timeout)
          }
        }
      }
    },
    {
      flags: {
        boolean: ['t', 'no-title']
      }
    }
  )
}
