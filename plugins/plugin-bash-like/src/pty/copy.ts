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

import { XtermResponse, XtermResponseCell } from '@kui-shell/core'
import { prepareCellForDomRenderer } from '@kui-shell/xterm-helpers'

import { IBufferCell, IBufferLine, Terminal } from 'xterm'

/**
 * @return a XtermResponseCell matching the styling of the given xtermjs
 * IBufferCell.
 *
 */
function createCell(cell: IBufferCell): XtermResponseCell {
  const { classList, style, textContent } = prepareCellForDomRenderer(cell)

  return {
    innerText: cell.getChars(),
    classList,
    style,
    textContent
  }
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
    cell1.isStrikethrough() === cell2.isStrikethrough() &&
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
function squashRow(row: IBufferLine, previous: IBufferCell, current: IBufferCell, cells: XtermResponseCell[]) {
  let runningSquash: XtermResponseCell

  row.getCell(0, previous) // this copies the first cell into `previous`
  if (cells[cells.length - 1] && sameStyle(previous, current)) {
    runningSquash = cells[cells.length - 1]
    runningSquash.innerText += previous.getChars()
  } else {
    runningSquash = createCell(previous)
    cells.push(runningSquash)
  }

  for (let idx = 1; idx < row.length; idx++) {
    row.getCell(idx - 1, previous) // previous now holds cells[idx-1]
    row.getCell(idx, current) // current now holds cells[idx]

    if (sameStyle(previous, current)) {
      // same decoration from one cell to the next
      runningSquash.innerText += current.getChars()
    } else {
      // we need to start a new span, because the decoration changed
      runningSquash = createCell(current)
      cells.push(runningSquash)
    }
  }
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

export default function copy(terminal: Terminal): XtermResponse['rows'] {
  const rows: XtermResponse['rows'] = []

  // templates, to avoid creating lots of temporary objects
  const previous = terminal.buffer.active.getNullCell()
  const current = terminal.buffer.active.getNullCell()

  const nLines = lastFullLineIdx(terminal, current) + 1
  let prevRow: XtermResponseCell[] = undefined // eslint-disable-line
  for (let ridx = 0; ridx < nLines; ridx++) {
    const line = terminal.buffer.active.getLine(ridx)

    if (line.isWrapped && prevRow !== undefined) {
      squashRow(line, previous, current, prevRow)
    } else {
      prevRow = []
      squashRow(line, previous, current, prevRow)
      rows.push(prevRow)
    }
  }

  return rows
}
