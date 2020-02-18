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

interface Props {
  source: string
}

export default class Markdown extends React.PureComponent<Props> {
  public render() {
    return (
      <ReactMarkdown
        source={this.props.source}
        className="padding-content scrollable scrollable-auto marked-content page-content"
        renderers={{
          code: props => <CodeSnippet type="inline">{props.value}</CodeSnippet>,
          link: props => <Link {...props} target="_blank" title={props.href} />
        }}
      />
    )
  }
}
