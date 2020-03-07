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
import * as ReactMarkdown from 'react-markdown'
import { CodeSnippet, Link } from 'carbon-components-react'

import 'carbon-components/scss/components/link/_link.scss'
import 'carbon-components/scss/components/code-snippet/_code-snippet.scss'
import 'carbon-components/scss/components/copy-button/_copy-button.scss'

interface Props {
  source: string
}

export default class Markdown extends React.PureComponent<Props> {
  private onCopy(value: string) {
    navigator.clipboard.writeText(value)
  }

  public render() {
    return (
      <ReactMarkdown
        source={this.props.source}
        className="padding-content scrollable scrollable-auto marked-content page-content"
        renderers={{
          code: props => (
            <CodeSnippet
              type={/\n/.test(props.value) || props.value.length > 100 ? 'multi' : 'single'}
              onClick={this.onCopy.bind(this, props.value)}
            >
              {props.value}
            </CodeSnippet>
          ),
          link: props => <Link {...props} target="_blank" title={props.href} />
        }}
      />
    )
  }
}
