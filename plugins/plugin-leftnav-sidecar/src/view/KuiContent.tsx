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

import {
  Tab as KuiTab,
  Content,
  isHTML,
  isStringWithOptionalContentType,
  hasEditor,
  isTable,
  isCommandStringContent,
  isFunctionContent,
  isScalarContent
} from '@kui-shell/core'

import { renderTable } from '@kui-shell/plugin-carbon-tables'

import Eval from './Eval'
import Loading from './Loading'
import Markdown from './Markdown'

interface KuiMMRProps {
  tab: KuiTab
  mode: Content
}

export default class KuiMMRContent extends React.PureComponent<KuiMMRProps> {
  public render() {
    const { tab, mode } = this.props
    if (isStringWithOptionalContentType(mode)) {
      if (mode.contentType === 'text/html') {
        // for html-formatted text, wrap it in a container with padding and scrolling
        return (
          <div className="padding-content scrollable page-content">
            <div dangerouslySetInnerHTML={{ __html: mode.content }} />
          </div>
        )
      } else if (mode.contentType === 'text/markdown') {
        return <Markdown source={mode.content} />
      } else {
        if (hasEditor()) {
          /* const entity = {
            kind: mode.contentType || 'text',
            metadata: {
              name: 'tmp'
            },
            content: mode.content
          } */
          return <Loading />
          /* <Suspense fallback={<Loading/>}>
            <Async provider={tryOpenWithEditor(tab, entity, {}).then(({content}) => content as any as LegacyRef<HTMLDivElement>)} />
            </Suspense> */
        }
      }
    } else if (isCommandStringContent(mode)) {
      try {
        return <Eval tab={tab} command={mode.contentFrom} contentType={mode.contentType} />
      } catch (err) {
        console.error('error evaluating command string', err)
      }
    } else if (isFunctionContent(mode)) {
      // TODO
    } else if (isScalarContent(mode)) {
      if (isTable(mode.content)) {
        // some song and dance to make typescript happy
        try {
          return renderTable(tab, tab.REPL, mode.content)
        } catch (err) {
          console.error('error rendering table', err)
        }

        // typescript doesn't like this, and i don't know why:
        // "is not assignable to type IntrinsicAttributes..."
        // <PaginatedTable {...props} />
      } else if (isHTML(mode.content)) {
        // then its already a DOM
        //        const ref = React.createRef()
        // return <div key="html-content" ref={div => {
        //          div.appendChild(ref)
        //        }}/>
        // const div = React.createElement('div')

        return (
          <div className="padding-content scrollable page-content" style={{ display: 'flex', flex: 1 }}>
            <div style={{ display: 'flex', flex: 1 }} dangerouslySetInnerHTML={{ __html: mode.content.innerHTML }} />
          </div>
        )
      }
    }

    console.error('oops', mode)
    return <div>oops</div>
  }
}
