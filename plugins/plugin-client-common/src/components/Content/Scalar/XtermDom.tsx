/*
 * Copyright 2020 The Kubernetes Authors
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

import React from 'react'

interface Props {
  response: XtermResponse
}

/** for html pre-rendered dom content */
export default class XtermDom extends React.PureComponent<Props> {
  private renderRow(cells: XtermResponseCell[]) {
    if (cells.length === 1) {
      // If we have a single child with no styling, inline its text
      // directly into the row element.
      const cell = cells[0]
      if (cell.classList && cell.classList.length === 0 && cell.style && Object.keys(cell.style).length === 0) {
        const text = cell.innerText || cell.textContent || '\u00a0' // whitespace seems to be in textContent
        return text
      }
    }

    return cells.map((cell, idx) => {
      const text = cell.innerText || cell.textContent || '\u00a0' // whitespace seems to be in textContent

      return cell.classList.length === 0 && !cell.style ? (
        text
      ) : (
        <span key={idx} className={cell.classList.join(' ')} style={cell.style || {}}>
          {text || '\u00a0'}
        </span>
      )
    })
  }

  public render() {
    return this.props.response.rows.length === 0 ? (
      <React.Fragment />
    ) : (
      <div className="kui--xterm-output padding-content scrollable scrollable-auto page-content">
        <div style={{ display: 'flex', flex: 1 }}>
          <div className="xterm-container xterm-terminated">
            <div className="xterm-rows">
              {this.props.response.rows.map((_, idx) => (
                <div key={idx}>{this.renderRow(_)}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
