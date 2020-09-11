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
import { CommentaryResponse, REPL } from '@kui-shell/core'

import Card from '../spi/Card'
import Markdown from './Markdown'

type Props = CommentaryResponse['props'] & {
  repl: REPL
}

export default class Commentary extends React.PureComponent<Props> {
  public render() {
    if (this.props.elsewhere) {
      return (
        <span className="kui--repl-result-else">
          <Markdown source={this.props.children} repl={this.props.repl} />
        </span>
      )
    } else {
      return <Card {...this.props} className="kui--commentary-card" />
    }
  }
}
