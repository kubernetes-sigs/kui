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

  public async init(text: string, { createOutputStream }: Commands.Arguments) {
    this.stdout = await createOutputStream()

    this.spinner = ora({
      text,
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
      await this.succeed()
    }
  }

  private blank() {
    return this.next('')
  }

  public async fail(message?: string) {
    return new Promise(resolve => {
      this.cb = resolve
      this.color = 'red-text'
      this.spinner.fail(message)
    }).then(() => {
      this.color = 'yellow-text'
    })
  }

  public async succeed(message?: string) {
    return new Promise(resolve => {
      this.cb = resolve
      this.color = 'green-text'
      this.spinner.succeed(message)
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
    line.classList.add('flex-layout')

    // here, we modify the spinner text a bit, e.g. replacing ✔ and ✖
    // with SVG analogs
    spinnerDom.classList.add(this.color)
    if (spinnerPart === '✔') {
      // replace the unicode text with a "success" SVG
      line.classList.remove('flex-align-top')
      spinnerDom.style.display = 'inline-flex'
      spinnerDom.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM14 21.5l-5-5 1.59-1.5L14 18.35 21.41 11 23 12.58z"></path><title>Checkbox checked filled</title></svg>'
    } else if (spinnerPart === '✖') {
      // replace the unicode text with an "error" SVG
      line.classList.remove('flex-align-top')
      spinnerDom.style.display = 'inline-flex'
      spinnerDom.innerHTML =
        '<svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true"><path d="M29.88 27.52l-13-25a1 1 0 0 0-1.76 0l-13 25a1 1 0 0 0 0 1A1 1 0 0 0 3 29h26a1 1 0 0 0 .86-.49 1 1 0 0 0 .02-.99zM14.88 10h2.25v10h-2.25zM16 26a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 26z"></path><title>Warning alt filled</title></svg>'
    } else {
      // otherwise, use whatever spinner unicode text ora throws at
      // us, but increase the font size a bit
      spinnerDom.classList.add('even-larger-text')
      line.classList.add('flex-align-top')
      spinnerDom.innerText = spinnerPart
    }

    // the rest of the line we use unchanged
    restDom.innerText = restPart

    // emit the line to the UI
    await this.stdout(line, this.killLine)

    // notify any waiters from within this class
    if (this.cb) {
      this.cb()
      this.cb = undefined
    }

    // notify the Writable that we are done
    next()
  }
}

export default OraStream
