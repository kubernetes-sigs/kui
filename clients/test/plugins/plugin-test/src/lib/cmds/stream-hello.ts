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

import { Arguments, CommandOptions, Registrar, ParsedOptions } from '@kui-shell/core/api/commands'

interface Options extends ParsedOptions {
  grumble?: number
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

const options: CommandOptions = {
  usage: {
    command: 'string',
    strict: 'string',
    optional: [{ name: '--grumble', numeric: true }],
    docs: 'The obligatory hello world'
  }
}

export default (commandTree: Registrar) => {
  commandTree.listen('/test/stream/string', sayHello, options)
  commandTree.listen('/test/stream/html/dom', sayHtmlDom)
  commandTree.listen('/test/stream/mixed', sayMixed)
}
