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

import * as Debug from 'debug'

import { Tab } from '../cli'
import { RowDiff, Row } from '../models/table'
import { formatOneRowResult, RowFormatOptions } from '../views/table'
const debug = Debug('webapp/views/diff')

export const applyDiffTable = (
  diff: RowDiff,
  tab: Tab,
  tableDom: HTMLElement,
  rows: HTMLElement[],
  prepareRows: Row[],
  option?: RowFormatOptions
) => {
  if (diff.rowUpdate && diff.rowUpdate.length > 0) {
    debug('update rows', diff.rowUpdate)
    diff.rowUpdate.map(update => {
      // apply diff to the view
      const newRowView = formatOneRowResult(tab, option)(update.model)
      tableDom.replaceChild(newRowView, rows[update.updateIndex])
      rows[update.updateIndex] = newRowView
      // apply diff to the model
      prepareRows[update.updateIndex] = update.model
    })
  }

  if (diff.rowDeletion && diff.rowDeletion.length > 0) {
    debug('delete rows', diff.rowDeletion)
    diff.rowDeletion
      .filter(_ => _.model.name !== 'NAME')
      .map(rowDeletion => {
        // apply diff to the model
        rowDeletion.model.attributes.forEach(attr => {
          if (attr.key === 'STATUS') {
            attr.value = 'Offline'
            attr.css = 'red-background'
          }
        })
        prepareRows[rowDeletion.deleteIndex] = rowDeletion.model

        // apply diff to the view
        const status = rows[rowDeletion.deleteIndex].querySelector('.cell-inner[data-key="STATUS"]') as HTMLElement
        if (status) {
          status.className = 'cell-inner red-background'
          status.innerText = 'Offline'
        }
        const pulse = rows[rowDeletion.deleteIndex].querySelector('.repeating-pulse') as HTMLElement
        if (pulse) pulse.classList.remove('repeating-pulse')
      })
  }

  if (diff.rowInsertion && diff.rowInsertion.length > 0) {
    debug('insert rows', diff.rowInsertion)
    diff.rowInsertion.map(update => {
      // apply diff to the view
      const newRowView = formatOneRowResult(tab, option)(update.model)
      tableDom.insertBefore(newRowView, rows[update.insertBeforeIndex])
      rows.splice(update.insertBeforeIndex, 0, newRowView)
      // apply diff to the model
      prepareRows.splice(update.insertBeforeIndex, 0, update.model)
    })
  }
}
