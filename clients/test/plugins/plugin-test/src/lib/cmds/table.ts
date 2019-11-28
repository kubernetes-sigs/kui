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

/**
 * This file introduces a "test table" command that presents a table in the REPL.
 *
 */

// Notes: this is part of the Kui core API
import { Commands, Tables } from '@kui-shell/core'
import { Watchable } from '@kui-shell/core/api/models'

import tableContent from './content/table-with-drilldown'

interface Options extends Commands.ParsedOptions {
  watch: 'push' | 'poll'
  'final-state': string
}

// generateNewPush generates new `Row` with badge and message
const generateNewPush = (
  name: string,
  onlineLike: boolean,
  message: string,
  args: Commands.Arguments<Options>
): Tables.Row => {
  const status = onlineLike ? 'Running' : 'Terminating'
  const css = onlineLike ? 'green-background' : 'yellow-background'
  const onclick = () => args.REPL.pexec('test string')
  return {
    name,
    onclick,
    attributes: [{ key: 'STATUS', tag: 'badge', value: status, css }, { key: 'MESSAGE', value: message }]
  }
}

const doTable = (): ((args: Commands.Arguments<Options>) => Tables.Table & Partial<Watchable>) => {
  return (args: Commands.Arguments<Options>) => {
    const table = tableContent()
    const emptyRows: Tables.Row[] = []

    const tableWithoutRows: Tables.Table = {
      noSort: true,
      header: { name: 'name', attributes: [{ value: 'status' }, { value: 'message' }] },
      body: emptyRows
    }

    const watch = args.parsedOptions.watch
    const finalState = args.parsedOptions['final-state']

    if (watch && watch === 'push' && finalState) {
      const watch: Watchable = {
        watch: {
          init: (update, offline) => {
            const name1 = 'foo1'
            const name2 = 'foo2'

            update(generateNewPush(name1, true, 'should create a new row', args))
            if (finalState === 'createRow1') return

            setTimeout(() => update(generateNewPush(name1, false, 'should terminate the row', args)), 1000)
            if (finalState === 'terminateRow1') return

            setTimeout(() => offline(name1), 1500)
            if (finalState === 'deleteRow1') return

            setTimeout(() => update(generateNewPush(name1, true, 'should activate the deleted row', args)), 2000)
            if (finalState === 'activateRow1') return

            setTimeout(() => update(generateNewPush(name1, false, 'should terminate the row again', args)), 2500)
            if (finalState === 'terminateRow1Again') return

            setTimeout(() => offline(name1), 3000)
            if (finalState === 'deleteRow1Again') return

            setTimeout(() => update(generateNewPush(name2, true, 'should create the second row', args)), 3500)
            if (finalState === 'createRow2') return

            if (finalState === 'activeRow1Again')
              setTimeout(() => update(generateNewPush(name1, true, 'should activate the first row again', args)), 4000)
          }
        }
      }

      return Object.assign({}, tableWithoutRows, watch)
    } else if (watch && watch === 'poll') {
      return Object.assign({}, tableWithoutRows, { watch: { refreshCommand: 'test table' } })
    } else {
      return table
    }
  }
}

/**
 * Here is where we register our command.
 *
 */
export default (commandTree: Commands.Registrar) => {
  commandTree.listen('/test/table', doTable(), {
    usage: {
      docs: 'A showcase of the Table view'
    }
  })
}
