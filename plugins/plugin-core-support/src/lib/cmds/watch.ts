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

interface Options extends ParsedOptions {
  n: number
  interval: number

  t: string
  'no-title': string
}

class TableWatcher implements Abortable, Watcher {
  private timeout: ReturnType<typeof setInterval>

  // eslint-disable-next-line no-useless-constructor
  public constructor(
    private readonly args: Arguments,
    private readonly command: string,
    private readonly interval: number,
    private readonly watchState: ExecOptions['watch']
  ) {}

  public async init(pusher: WatchPusher) {
    let inProgress = false

    this.timeout = setInterval(async () => {
      if (inProgress) {
        return
      }

      inProgress = true
      const table = await this.args.REPL.qexec(this.command, undefined, undefined, {
        watch: { iteration: this.watchState.iteration++, accumulator: this.watchState.accumulator }
      })

      if (isTable(table)) {
        pusher.header(table.header)
        pusher.setBody(table.body)
      } else {
        this.abort()
      }
      inProgress = false
    }, this.interval)
  }

  public async abort() {
    clearInterval(this.timeout)
  }
}

export default function(registrar: Registrar) {
  registrar.listen<KResponse, Options>(
    '/watch',
    async args => {
      const cmdline = args.command.slice(args.argvNoOptions[0].length + 1)
      const watchState = { accumulator: {}, iteration: 1 }
      const response = await args.REPL.qexec(cmdline, undefined, undefined, { watch: watchState })
      const interval = args.parsedOptions.n || args.parsedOptions.interval || 2000

      if (isTable(response)) {
        return Object.assign(response, { watch: new TableWatcher(args, cmdline, interval, watchState) })
      } else {
        const timeout = setTimeout(async () => {
          await args.REPL.reexec(args.command, { execUUID: args.execOptions.execUUID })
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
