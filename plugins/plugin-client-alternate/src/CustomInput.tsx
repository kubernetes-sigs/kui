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
import { InputProvider, defaultOnKeyDown, defaultOnKeyPress, defaultOnKeyUp } from '@kui-shell/plugin-client-common'

import '../web/scss/CustomInput.scss'

/**
 * Use DefaultClient configured to run in bottomInput mode.
 *
 */
export default class CustomInput extends InputProvider {
  /** This is the "input" that we provide */
  protected input() {
    return (
      <input
        autoFocus
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        autoCapitalize="off"
        key={this.props.idx}
        className="repl-input-element"
        onKeyPress={defaultOnKeyPress.bind(this)}
        onKeyDown={defaultOnKeyDown.bind(this)}
        onKeyUp={defaultOnKeyUp.bind(this)}
        ref={prompt => {
          if (prompt) {
            prompt.focus()
            this.setState({ prompt })
          }
        }}
      />
    )
  }
}
