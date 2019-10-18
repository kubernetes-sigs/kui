/*
 * Copyright 2019 IBM Corporation
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

import * as ora from 'ora'
import { Writable } from 'stream'

import Commands from '@kui-shell/core/api/commands'
import { i18n } from '@kui-shell/core/api/i18n'

const strings = i18n('plugin-manager')

class OraStream extends Writable {
  private stdout!: (response: HTMLElement | string, killLine?: boolean) => Promise<void>

  private spinner!: ora.Ora

  private killLine = true
  private color = 'yellow-text'

  // private pendingWrite: Promise<void>
  private cb: () => void

  public constructor() {
    super({ highWaterMark: 0 })
  }

  public async init({ createOutputStream }: Commands.Arguments) {
    this.stdout = await createOutputStream()

    this.spinner = ora({
      text: strings('Preparing to install', name),
      isEnabled: true,
      stream: this
    }).start()

    return this
  }

  public set text(str: string) {
    this.spinner.text = str
  }

  public async next(str: string, successStr?: string) {
    await this.succeed(successStr)
    await this.start(str)
  }

  public clear() {
    return new Promise(resolve => {
      this.cb = resolve
      this.spinner.clear()
    })
  }

  private start(str: string) {
    return new Promise(resolve => {
      this.killLine = false
      this.text = str
      this.cb = resolve
      this.spinner.start()
    }).then(() => {
      this.killLine = true
    })
  }

  public async stop(withBlank = false) {
    this.spinner.clear()
    if (withBlank) {
      await this.next('')
      this.spinner.stopAndPersist({ symbol: '' })
    } else {
      this.spinner.stop()
    }
  }

  private blank() {
    return this.next('')
  }

  public async succeed(successStr?: string) {
    return new Promise(resolve => {
      this.cb = resolve
      this.color = 'green-text'
      this.spinner.succeed(successStr)
    }).then(() => {
      this.color = 'yellow-text'
    })
  }

  public async _write(chunk: Buffer, enc: string, next: (error?: Error | null) => void) {
    const str = chunk.toString()
    const spinnerPart = str[0]
    const restPart = str.slice(1)

    const line = document.createElement('pre')
    const spinnerDom = document.createElement('span')
    const restDom = document.createElement('span')
    line.appendChild(spinnerDom)
    line.appendChild(restDom)

    spinnerDom.classList.add(this.color)
    spinnerDom.innerText = spinnerPart
    restDom.innerText = restPart

    await this.stdout(line, this.killLine)

    if (this.cb) {
      this.cb()
      this.cb = undefined
    }

    next()
  }
}

export default OraStream
