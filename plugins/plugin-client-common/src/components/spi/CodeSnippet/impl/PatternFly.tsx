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
import SimpleEditor from '../../../Content/Editor/SimpleEditor'

// ugh: does not support lazy loading
// import { CodeEditor, CodeEditorProps, Language } from '@patternfly/react-code-editor'

import Props from '../model'

export default class PatternFlyCodeSnippet extends React.PureComponent<Props> {
  private readonly _monacoOptions /*: CodeEditorProps['options'] */ = {
    cursorStyle: 'block',
    lineDecorationsWidth: 0,
    renderFinalNewline: false,
    renderLineHighlight: 'none',
    scrollBeyondLastLine: false
  }

  private language() {
    const { language } = this.props
    // return Language[language === 'sh' || language === 'bash' ? 'shell' : language] || Language.plaintext
    return language || 'text'
  }

  private height() {
    return this.props.height || (this.props.value && this.props.value.split(/\n/).length * 20 + 'px') || '20px'
  }

  private readonly style = {
    padding: '0.875em 0',
    backgroundColor: 'transparent',
    borderRadius: '6px' // copy github styling here
  }

  public render() {
    return (
      /*      <CodeEditor
        isReadOnly
        isLineNumbersVisible={false}
        isCopyEnabled={this.props.isCopyEnabled || false}
        isDownloadEnabled={this.props.isDownloadEnabled || false}
        isLanguageLabelVisible={this.props.isLanguageLabelVisible || true}
        isMinimapVisible={false}
        height={this.height()}
        language={this.language()}
        code={this.props.value}
        options={this._monacoOptions}
      /> */

      <div style={this.style} className="flex-layout">
        <SimpleEditor
          simple
          focus={false}
          readonly={this.props.readonly !== false}
          wordWrap={this.props.wordWrap}
          tabUUID={this.props.tabUUID}
          minHeight={0}
          fontSizeAdjust={12 / 14}
          content={this.props.value}
          contentType={this.language()}
          onContentChange={this.props.onContentChange}
        />
        {this.props.children}
      </div>
    )
  }
}
