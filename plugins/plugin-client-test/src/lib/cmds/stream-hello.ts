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

import { Abortable, Arguments, CommandOptions, ParsedOptions, Registrar, Streamable } from '@kui-shell/core'

interface Options extends ParsedOptions {
  grumble?: number
  prefix?: string
}

function hello(parsedOptions: Options) {
  return 'hello world' + (parsedOptions.grumble ? ` ${parsedOptions.grumble}` : '')
}

const sayHello = async ({ parsedOptions, createOutputStream }: Arguments<Options>) => {
  ;(await createOutputStream())(hello(parsedOptions))
  return true
}

function dom() {
  const dom = document.createElement('div')
  dom.innerText = 'yyyyy'
  dom.classList.add('green-text')
  return dom
}

const sayHtmlDom = async ({ createOutputStream }: Arguments<Options>) => {
  ;(await createOutputStream())(dom())
  return true
}

const sayMixed = async ({ parsedOptions, createOutputStream }: Arguments<Options>) => {
  ;(await createOutputStream())([hello(parsedOptions), { body: [{ name: 'mumble' }] }, dom()])
  return true
}

/**
 * Use the pty's onInit function to consume the streaming output of an
 * underlying command.
 *
 */
const sayPty = async ({ block, parsedOptions, REPL, createOutputStream }: Arguments<Options>) => {
  // abort after nLinesDesired
  const nLinesDesired = parsedOptions.grumble || 10

  // prefix the pty output with this string
  const prefix = parsedOptions.prefix || 'XXX'

  // we will use this output stream to stream output to the console
  const stdout = await createOutputStream()

  return new Promise((resolve, reject) => {
    const onInit = (job: Abortable) => {
      let done = false
      const abort = () => {
        try {
          done = true
          job.abort()
          resolve(true) // this should return control to the REPL
        } catch (err) {
          reject(err)
        }
      }

      let nLines = 0

      return (line: Streamable) => {
        if (typeof block !== 'boolean' && block.isCancelled) {
          abort()
        }
        if (done) {
          return
        }

        if (typeof line === 'string') {
          // prefix a string to the "echo hi" output; we should expect
          // output where each line is "${prefix} hi"
          stdout(`${prefix} ${line}`)

          if (++nLines === nLinesDesired) {
            abort()
          }
        } else {
          reject(new Error('unexpected output'))
        }
      }
    }

    // spawn a PTY that emits lines with "hi"; consume this output in
    // our onInit, which will prefix each line with XXX and emit
    // *that* to the console
    REPL.qexec('sendtopty while true; do echo hi; sleep 1; done', block, undefined, {
      onInit,
      quiet: true,
      replSilence: true,
      echo: false
    }).catch(reject)
  })
}

const options: CommandOptions = {}
const options2: CommandOptions = Object.assign(
  {
    usage: {
      command: 'string',
      strict: 'string',
      optional: [{ name: '--grumble', numeric: true }],
      docs: 'The obligatory hello world'
    }
  },
  options
)

export default (commandTree: Registrar) => {
  commandTree.listen('/test/stream/string', sayHello, options2)
  commandTree.listen('/test/stream/html/dom', sayHtmlDom, options)
  commandTree.listen('/test/stream/mixed', sayMixed, options)
  commandTree.listen('/test/stream/pty', sayPty, options)
}
