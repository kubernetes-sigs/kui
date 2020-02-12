/*
 * Copyright 2020 IBM Corporation
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

import * as React from 'react'
import { internalBeCarefulListen as listen } from '@kui-shell/core'

import { BlockState } from './BlockModel'

interface Props {
  state: BlockState
  readOnly: boolean
}

export default class Input extends React.PureComponent<Props> {
  private _prompt: HTMLInputElement

  public componentDidMount() {
    listen(this.prompt)
  }

  public get prompt() {
    return this._prompt
  }

  public render() {
    return (
      <div className="repl-input">
        <div className="repl-prompt">
          <span className="repl-prompt-lefty"></span>
          <span className="repl-context"></span>
          <span className="repl-selection clickable" title="The current selection"></span>
          <span className="repl-prompt-righty">
            {/* a right chevron */}
            <i>&#x276f;</i>
          </span>
        </div>
        <input
          type="text"
          ref={c => (this._prompt = c)}
          className="repl-input-element"
          aria-label="Command Input"
          autoFocus
          readOnly={this.props.readOnly}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <span className="repl-prompt-right-elements">
          <div className="kui--repl-prompt-buttons">
            <div className="graphical-icon kui--repl-prompt-buttons--screenshot kui--hide-in-webpack">
              <svg
                focusable="false"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M29 26H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h6.46l1.71-2.55A1 1 0 0 1 12 4h8a1 1 0 0 1 .83.45L22.54 7H29a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1zM4 24h24V9h-6a1 1 0 0 1-.83-.45L19.46 6h-6.92l-1.71 2.55A1 1 0 0 1 10 9H4z"></path>
                <path d="M16 22a6 6 0 1 1 6-6 6 6 0 0 1-6 6zm0-10a4 4 0 1 0 4 4 4 4 0 0 0-4-4z"></path>
              </svg>
            </div>
          </div>

          <span className="repl-prompt-timestamp even-smaller-text slightly-deemphasize"></span>
          <div className="repl-prompt-right-element-status-icon deemphasize">
            <svg
              className="kui--icon-error"
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10 1c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9zm3.5 13.5l-8-8 1-1 8 8-1 1z"></path>
              <path d="M13.5 14.5l-8-8 1-1 8 8-1 1z" data-icon-path="inner-path" opacity="0"></path>
            </svg>
            <svg
              className="kui--icon-ok"
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10 1c-4.9 0-9 4.1-9 9s4.1 9 9 9 9-4 9-9-4-9-9-9zM8.7 13.5l-3.2-3.2 1-1 2.2 2.2 4.8-4.8 1 1-5.8 5.8z"></path>
              <path
                d="M8.7 13.5l-3.2-3.2 1-1 2.2 2.2 4.8-4.8 1 1-5.8 5.8z"
                data-icon-path="inner-path"
                opacity="0"
              ></path>
            </svg>
            <div data-loading className="bx--loading kui--icon-processing">
              <svg
                className="bx--loading__svg"
                focusable="false"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="-75 -75 150 150"
                aria-hidden="true"
              >
                <circle className="bx--loading__stroke-kui" cx="0" cy="0" r="48.875" />
                <circle className="bx--loading__stroke" cx="0" cy="0" r="46.875" />
              </svg>
            </div>
          </div>
        </span>
      </div>
    )
  }
}
