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
import { Add20 } from '@carbon/icons-react'

interface Props {
  onNewTab: () => void
}

export default class NewTabButton extends React.PureComponent<Props> {
  public render() {
    return (
      <a
        href="#"
        className="kui--tab-navigatable kui--new-tab__plus left-tab-stripe-button smaller-button kui-new-tab"
        id="new-tab-button"
        data-balloon-disabled="Open a new tab"
        data-balloon-pos="right"
        data-balloon-length="fit"
        aria-label="Open a new tab"
        tabIndex={0}
        onClick={() => this.props.onNewTab()}
      >
        <Add20 className="kui-new-tab__plus" focusable="false" preserveAspectRatio="xMidYMid meet" aria-hidden="true" />
      </a>
    )
  }
}
