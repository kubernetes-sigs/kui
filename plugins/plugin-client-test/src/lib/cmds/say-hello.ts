/*
 * Copyright 2019 The Kubernetes Authors
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

import { Arguments, CommandOptions, Registrar, ParsedOptions, KResponse, Util } from '@kui-shell/core'

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

const sayTime1 = () => {
  return Util.prettyPrintTime(new Date())
}
const sayTime2 = () => {
  return Util.prettyPrintTime(new Date().toLocaleString())
}
const sayTime3 = async () => {
  const t1 = new Date().getTime()
  await new Promise(resolve => setTimeout(resolve, 100))
  const t2 = new Date().getTime()
  return Util.prettyPrintTime(t2, 'long', t1)
}

const options: CommandOptions = { isExperimental: true }
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
  commandTree.listen('/test/string', sayHello, options2)
  commandTree.listen('/test/html/dom', sayHtmlDom, options)
  commandTree.listen('/test/markdown', sayMarkdown, options)
  commandTree.listen('/test/mixed', sayMixed, options)
  commandTree.listen('/test/time1', sayTime1, options)
  commandTree.listen('/test/time2', sayTime2, options)
  commandTree.listen('/test/time3', sayTime3, options)
}
