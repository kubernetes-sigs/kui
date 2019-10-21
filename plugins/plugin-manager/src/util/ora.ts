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

import { isHeadless } from '@kui-shell/core/api/capabilities'
import Commands from '@kui-shell/core/api/commands'

const defaultColor = 'processing-text'

class OraStream extends Writable {
  private stdout!: (response: HTMLElement | string, killLine?: boolean) => Promise<void>

  private spinner!: ora.Ora

  private killLine = true
  private color = defaultColor

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
      spinner: 'growHorizontal',
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

    if (isHeadless()) {
      await this.stdout('\n')
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
      this.color = defaultColor
    })
  }

  public async succeed(message?: string) {
    return new Promise(resolve => {
      this.cb = resolve
      this.color = 'green-text'
      this.spinner.succeed(message)
    }).then(() => {
      this.color = defaultColor
    })
  }

  public async _write(chunk: Buffer, enc: string, next: (error?: Error | null) => void) {
    if (isHeadless()) {
      const str = chunk.toString()
      await this.stdout(str.substring(0, str.indexOf('\n')), this.killLine)
    } else {
      const str = chunk.toString()
      const splitIdx = str[0] === '\u001b' ? str.indexOf('m', 1) + 2 : 1
      const spinnerPart = str[splitIdx - 1]
      const restPart = str[splitIdx] === '\u001b' ? str.slice(splitIdx + 5) : str.slice(splitIdx)

      const line = document.createElement('pre')
      const spinnerDom = document.createElement('div')
      const restDom = document.createElement('div')
      line.appendChild(spinnerDom)
      line.appendChild(restDom)
      line.classList.add('flex-layout')
      restDom.classList.add('do-not-overflow')

      // here, we modify the spinner text a bit, e.g. replacing ✔ and ✖
      // with SVG analogs
      spinnerDom.classList.add(this.color)
      spinnerDom.innerText = spinnerPart

      if (!/✔/.test(spinnerPart) && !/'✖'/.test(spinnerPart)) {
        restDom.classList.add('lighter-text')
        line.classList.add('flex-align-top')
      } else {
        spinnerDom.style.fontSize = '125%'
        spinnerDom.style.lineHeight = '1.2rem'
        spinnerDom.style.width = '1rem'
        spinnerDom.style.textAlign = 'center'
      }

      // the rest of the line we use unchanged
      restDom.innerText = restPart

      // emit the line to the UI
      await this.stdout(line, this.killLine)
    }

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
