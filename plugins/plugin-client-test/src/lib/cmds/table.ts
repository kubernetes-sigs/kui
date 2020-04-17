/*
 * Copyright 2019-2020 IBM Corporation
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
import { Watchable, Table, Row, Arguments, ParsedOptions, Registrar, CodedError } from '@kui-shell/core'

import tableContent from './content/table-with-drilldown'

interface Options extends ParsedOptions {
  watch: 'push'
  sequence: string // help generate a sequence of changes
  'final-state': FinalState
}

enum FinalState {
  NotPendingLike,
  OnlineLike,
  OfflineLike
}

/** Help format a `Row` with the given message and Running or Terminating status */
const row = (name: string, state: FinalState, message: string, args: Arguments<Options>): Row => {
  const status = state === FinalState.OnlineLike ? 'Running' : 'Terminating'
  const css = state === FinalState.OnlineLike ? 'green-background' : 'yellow-background'
  const onclick = () => args.REPL.pexec('test string')
  return {
    name,
    onclick,
    attributes: [
      { key: 'STATUS', tag: 'badge', value: status, css },
      { key: 'MESSAGE', value: message }
    ]
  }
}

const doTable = (): ((args: Arguments<Options>) => Table & Partial<Watchable>) => {
  return (args: Arguments<Options>) => {
    const table = tableContent()
    const emptyRows: Row[] = []

    const statusTableWithoutRows: Table = {
      noSort: true,
      header: { name: 'NAME', attributes: [{ value: 'STATUS' }, { value: 'MESSAGE' }] },
      body: emptyRows
    }

    const watch = args.parsedOptions.watch
    const finalState = args.parsedOptions['final-state']
    const sequence = args.parsedOptions['sequence'] // help generate a sequence of changes

    if (watch && sequence) {
      // the command is looking for a table with push watcher
      const watch: Watchable = {
        watch: {
          abort: () => {
            console.log('abort')
          },
          init: ({ update: updated, offline: deleted }) => {
            const name1 = 'foo1'
            const name2 = 'foo2'

            updated(row(name1, FinalState.OnlineLike, 'should create a new row', args))
            if (sequence === 'createRow1') return

            setTimeout(() => updated(row(name1, FinalState.OfflineLike, 'should terminate the row', args)), 1000)
            if (sequence === 'terminateRow1') return

            setTimeout(() => deleted(name1), 1500)
            if (sequence === 'deleteRow1') return

            setTimeout(() => updated(row(name1, FinalState.OnlineLike, 'should activate the deleted row', args)), 2000)
            if (sequence === 'activateRow1') return

            setTimeout(() => updated(row(name1, FinalState.OfflineLike, 'should terminate the row again', args)), 2500)
            if (sequence === 'terminateRow1Again') return

            setTimeout(() => deleted(name1), 3000)
            if (sequence === 'deleteRow1Again') return

            setTimeout(() => updated(row(name2, FinalState.OnlineLike, 'should create the second row', args)), 3500)
            if (sequence === 'createRow2') return

            if (sequence === 'activeRow1Again')
              setTimeout(
                () => updated(row(name1, FinalState.OnlineLike, 'should activate the first row again', args)),
                4000
              )
          }
        }
      }

      // return an empty table with watch
      return Object.assign({}, statusTableWithoutRows, watch)
    } else {
      // command is looking for a plain table
      if (finalState && finalState === FinalState.OfflineLike) {
        // If the command is looking for a deleted table, return Error 404
        const err: CodedError = { name: 'error', message: 'resource has been deleted', code: 404 }
        throw err
      } else {
        return table
      }
    }
  }
}

/**
 * Here is where we register our command.
 *
 */
export default (commandTree: Registrar) => {
  commandTree.listen('/test/table', doTable(), {
    usage: {
      docs: 'A showcase of the Table view'
    }
  })
}
