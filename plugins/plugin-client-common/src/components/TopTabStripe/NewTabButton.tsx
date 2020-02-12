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

interface Props {
  onNewTab: () => void
}

export default class NewTabButton extends React.PureComponent<Props> {
  public render() {
    return (
      <a
        href="#"
        className="kui--tab-navigatable kui-new-tab__plus left-tab-stripe-button smaller-button kui-new-tab"
        id="new-tab-button"
        data-balloon-disabled="Open a new tab"
        data-balloon-pos="right"
        data-balloon-length="fit"
        aria-label="Open a new tab"
        tabIndex={2}
        onClick={() => this.props.onNewTab()}
      >
        <svg
          className="kui-new-tab__plus"
          focusable="false"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path d="M17 15V7h-2v8H7v2h8v8h2v-8h8v-2h-8z"></path>
        </svg>
      </a>
    )
  }
}
