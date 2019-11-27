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

interface Options extends ParsedOptions {
  grumble?: number
}

const sayHello = ({ parsedOptions }: Arguments<Options>): KResponse => {
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
  commandTree.listen('/test/markdown', sayMarkdown)
}
