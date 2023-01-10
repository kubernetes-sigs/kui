/*
 * Copyright 2022 The Kubernetes Authors
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
import { TextContent } from '@patternfly/react-core'
import { Markdown } from '@kui-shell/plugin-client-common'

/** Wrapper over <Markdown/> to keep it simple for plain text */
export default class Mdown extends React.PureComponent<{ children: string }> {
  private static readonly plainText = /^["'&!|\\/=-_:;.,\w\s]+$/

  public render() {
    if (Mdown.plainText.test(this.props.children)) {
      return (
        <TextContent>
          <div className="marked-content">
            <p>{this.props.children}</p>
          </div>
        </TextContent>
      )
    } else {
      return <Markdown nested source={this.props.children} />
    }
  }
}
