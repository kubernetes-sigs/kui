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

import React from 'react'
import { CodeEditor, Language } from '@patternfly/react-code-editor'

import Props from '../model'

export default class PatternFlyCodeSnippet extends React.PureComponent<Props> {
  private language() {
    return Language[this.props.language] || Language.plaintext
  }

  private height() {
    return this.props.height || (this.props.value && this.props.value.split(/\n/).length * 20 + 'px') || '20px'
  }

  public render() {
    return (
      <CodeEditor
        isReadOnly
        isCopyEnabled
        isDownloadEnabled
        isLanguageLabelVisible
        isMinimapVisible={false}
        height={this.height()}
        language={this.language()}
        code={this.props.value}
      />
    )
  }
}
