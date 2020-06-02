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
import { i18n } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import KuiContext from '../context'
import onSplit from '../../../controller/split'

const strings = i18n('plugin-client-common')

export default class SplitTerminalButtonButton extends React.PureComponent {
  public render() {
    return (
      <KuiContext.Consumer>
        {config =>
          config.splitTerminals && (
            <a
              href="#"
              className="kui--tab-navigatable kui--top-tab-button"
              id="kui--split-terminal-button"
              aria-label="Split terminal"
              tabIndex={0}
              title={strings('Split the Terminal')}
              onClick={() => onSplit()}
            >
              <Icons icon="Split" />
            </a>
          )
        }
      </KuiContext.Consumer>
    )
  }
}
