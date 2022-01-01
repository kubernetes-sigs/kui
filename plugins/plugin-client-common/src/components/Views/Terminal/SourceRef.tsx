/*
 * Copyright 2021 The Kubernetes Authors
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
import { basename } from 'path'
import { Tab, KResponse, isTable, getPrimaryTabId, hasSourceReferences } from '@kui-shell/core'

const Accordion = React.lazy(() => import('../../spi/Accordion'))
const SimpleEditor = React.lazy(() => import('../../Content/Editor/SimpleEditor'))

type Props = {
  tab: Tab

  isWidthConstrained?: boolean

  /** Response from a command execution which may have a potential SourceRef */
  response: KResponse
}

export default class SourceRef extends React.PureComponent<Props> {
  /** render sourceRef content. Currently only use SimpleEditor. */
  protected sourceRefContent(content: string, contentType: string) {
    return () => (
      <React.Suspense fallback={<div />}>
        <SimpleEditor
          tabUUID={getPrimaryTabId(this.props.tab)}
          content={content.replace(/\n$/, '')} /* monaco's renderFinalNewline option doesn't seem to do what we need */
          contentType={contentType}
          className="kui--source-ref-editor"
          fontSizeAdjust={12 / 14}
          simple
        />
      </React.Suspense>
    )
  }

  public render() {
    const { response } = this.props

    if (response && isTable(response) && hasSourceReferences(response)) {
      const sourceRef = response.kuiSourceRef
      const names = sourceRef.templates.concat(sourceRef.customization || []).map(_ => basename(_.filepath))
      const content = sourceRef.templates
        .map(_ => this.sourceRefContent(_.data, _.contentType))
        .concat(sourceRef.customization ? this.sourceRefContent(sourceRef.customization.data, 'yaml') : [])

      return (
        <div className="repl-input-sourceref">
          <div className="repl-context"></div>
          <Accordion
            names={names}
            isWidthConstrained={this.props.isWidthConstrained || false}
            tab={this.props.tab}
            content={content}
            className="no-padding"
          />
        </div>
      )
    } else {
      return <React.Fragment />
    }
  }
}
