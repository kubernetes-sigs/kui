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

import React from 'react'
import { CodeSnippet } from 'carbon-components-react'

import Props from '../model'

import 'carbon-components/scss/components/copy-button/_copy-button.scss'
import 'carbon-components/scss/components/code-snippet/_code-snippet.scss'

export default class CarbonCodeSnippet extends React.PureComponent<Props> {
  public render() {
    return (
      <CodeSnippet
        type={this.props.value && (/\n/.test(this.props.value) || this.props.value.length > 40) ? 'multi' : 'single'}
        onClick={this.props.onCopy}
      >
        {this.props.value}
      </CodeSnippet>
    )
  }
}
