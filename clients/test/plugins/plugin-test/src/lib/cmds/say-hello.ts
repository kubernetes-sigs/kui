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

import { Arguments, CommandOptions, Registrar, ParsedOptions, KResponse } from '@kui-shell/core/api/commands'
import { prettyPrintAnsi, prettyPrintTime } from '@kui-shell/core/api/pretty-print'

interface Options extends ParsedOptions {
  grumble?: number
}

const sayHello = ({ parsedOptions }: Arguments<Options>): string => {
  return 'hello world' + (parsedOptions.grumble ? ` ${parsedOptions.grumble}` : '')
}

const sayMarkdown = (): KResponse => {
  return `
# hello world
- aaa
- bbbb

## sub
hi`
}

const sayHtmlDom = (): HTMLElement => {
  const dom = document.createElement('div')
  dom.innerText = 'yyyyy'
  dom.classList.add('green-text')
  return dom
}

const sayMixed = (args: Arguments<Options>) => {
  return [sayHello(args), { body: [{ name: 'mumble' }] }, sayHtmlDom()]
}

const sayAnsi1 = () => {
  return prettyPrintAnsi(['\x1b[42mhello world\x1b[40m'])
}
const sayAnsi2 = () => {
  return prettyPrintAnsi(['   xxxxxx\n    \x1b[42mhello world\x1b[40m'])
}
const sayAnsi3 = () => {
  return prettyPrintAnsi(['   xxxxxx\n    \x1b[42mhello world\x1b[40m', 'yyyy'])
}

const sayTime1 = () => {
  return prettyPrintTime(new Date())
}
const sayTime2 = () => {
  return prettyPrintTime(new Date().toLocaleString())
}
const sayTime3 = async () => {
  const t1 = new Date().getTime()
  await new Promise(resolve => setTimeout(resolve, 100))
  const t2 = new Date().getTime()
  return prettyPrintTime(t2, 'long', t1)
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
  commandTree.listen('/test/string', sayHello, options)
  commandTree.listen('/test/html/dom', sayHtmlDom)
  commandTree.listen('/test/markdown', sayMarkdown)
  commandTree.listen('/test/mixed', sayMixed)
  commandTree.listen('/test/ansi1', sayAnsi1)
  commandTree.listen('/test/ansi2', sayAnsi2)
  commandTree.listen('/test/ansi3', sayAnsi3)
  commandTree.listen('/test/time1', sayTime1)
  commandTree.listen('/test/time2', sayTime2)
  commandTree.listen('/test/time3', sayTime3)
}
