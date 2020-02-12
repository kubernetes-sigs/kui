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

// eslint-disable-next-line react/display-name
export default function() {
  return (
    <div className="kui--input-stripe">
      <div className="repl-block" data-base-class="repl-block">
        <div className="repl-input">
          <div className="repl-prompt">
            <span className="repl-prompt-lefty"></span>
            <span className="repl-context"></span>
            <span className="repl-selection clickable" title="The current selection"></span>
            <span className="repl-prompt-righty">
              {/* ChevronRight20 */}
              <svg
                focusable="false"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <path d="M22 16L12 26l-1.4-1.4 8.6-8.6-8.6-8.6L12 6z"></path>
              </svg>
            </span>
          </div>
          <input
            type="text"
            aria-label="Command Input"
            tabIndex={1}
            className="repl-input-element kui--tab-navigatable "
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            placeholder="enter your command"
          />
        </div>
      </div>
    </div>
  )
}
