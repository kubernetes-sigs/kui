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

import { IBufferCell, IBufferLine, Terminal } from 'xterm'
import applyStyle from './drrf'

/**
 * If we have a single child with no styling, inline its text
 * directly into the row element.
 *
 * @return the input, for further chaining
 *
 */
function inlineSingleChild(rowDom: HTMLElement): HTMLElement {
  if (rowDom.children.length === 1) {
    const singleton = rowDom.firstElementChild as HTMLElement
    if (!singleton.className) {
      // only for undecorated solitary children
      singleton.remove()
      rowDom.innerText += singleton.innerText
    }
  }

  return rowDom
}

/**
 * @return a DOM cell matching the styling of the given xtermjs
 * IBufferCell.
 *
 */
function createCell(cell: IBufferCell): HTMLSpanElement {
  const span = document.createElement('span')
  span.innerText = cell.getChars()
  applyStyle(span, cell)
  return span
}

/** Do the two cells have the same styling? */
function sameStyle(cell1: IBufferCell, cell2: IBufferCell): boolean {
  if (cell1.isAttributeDefault() && cell2.isAttributeDefault()) {
    return true
  } else if (
    cell1.getFgColorMode() === cell2.getFgColorMode() &&
    cell1.getBgColorMode() === cell2.getBgColorMode() &&
    cell1.isBold() === cell2.isBold() &&
    cell1.isItalic() === cell2.isItalic() &&
    cell1.isDim() === cell2.isDim() &&
    cell1.isUnderline() === cell2.isUnderline() &&
    cell1.isBlink() === cell2.isBlink() &&
    cell1.isInvisible() === cell2.isInvisible()
  ) {
    return true
  } else {
    return false
  }
}

/**
 * In one xterm-row, squash consecutive spans that have the same
 * className. We do this to avoid costly reflows, which xterm.js
 * causes a huge number of, and that cost O(numSpans). xterm.js
 * creates one span per character :(
 *
 */
function squashRow(row: IBufferLine, previous: IBufferCell, current: IBufferCell, rowDom: HTMLElement) {
  row.getCell(0, previous)
  let runningSquash = createCell(previous)
  rowDom.appendChild(runningSquash)

  for (let idx = 1; idx < row.length; idx++) {
    row.getCell(idx - 1, previous)
    row.getCell(idx, current)

    if (sameStyle(previous, current)) {
      // same decoration from one cell to the next
      runningSquash.innerText += current.getChars()
    } else {
      // we need to start a new span, because the decoration changed
      runningSquash = createCell(current)
      rowDom.appendChild(runningSquash)
    }
  }

  inlineSingleChild(rowDom)
}

function lastFullLineIdx(terminal: Terminal, current: IBufferCell): number {
  let ridx = terminal.buffer.active.length - 1

  while (ridx >= 0) {
    const line = terminal.buffer.active.getLine(ridx)
    for (let cidx = 0; cidx < line.length; cidx++) {
      line.getCell(cidx, current)
      if (current.getCode() !== 0) {
        return ridx
      }
    }

    ridx--
  }

  return -1
}

export default function copy(terminal: Terminal): HTMLElement {
  const rows = document.createElement('div')
  rows.classList.add('xterm-rows')

  // templates, to avoid creating lots of temporary objects
  const previous = terminal.buffer.active.getNullCell()
  const current = terminal.buffer.active.getNullCell()

  const nLines = lastFullLineIdx(terminal, current) + 1
  let prevRow: HTMLElement
  for (let idx = 0; idx < nLines; idx++) {
    const line = terminal.buffer.active.getLine(idx)

    if (line.isWrapped && prevRow !== undefined) {
      squashRow(line, previous, current, prevRow)
    } else {
      prevRow = document.createElement('div')
      squashRow(line, previous, current, prevRow)
      rows.appendChild(prevRow)
    }
  }

  return rows
}
