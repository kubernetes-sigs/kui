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
import * as Debug from 'debug'

import {
  ParsedOptions,
  Tab as KuiTab,
  ScalarResource,
  SupportedStringContent,
  MultiModalResponse,
  isCommandStringContent,
  FunctionThatProducesContent,
  ReactProvider,
  isReactProvider,
  isScalarContent,
  ScalarContent,
  isStringWithOptionalContentType
} from '@kui-shell/core'

import { Loading } from '../../'
import KuiMMRContent from './KuiContent'

const debug = Debug('plugins/sidecar/Eval')

interface EvalProps {
  tab: KuiTab
  command: string | FunctionThatProducesContent
  args: {
    argvNoOptions: string[]
    parsedOptions: ParsedOptions
  }
  response: MultiModalResponse
  contentType?: SupportedStringContent
}

interface EvalState {
  isLoading: boolean
  command: string | FunctionThatProducesContent
  react: ReactProvider
  content: ScalarResource
  contentType: SupportedStringContent
}

/**
 * Notes: asynchronicity in React is a real pain. I realize that
 * `<Suspense />` is supposed to make this easier, but it's still
 * Experimental.
 *
 * What makes this hard: under a given parent component, an `<Eval/>`
 * will only be constructed once, even when the `props` change
 * (i.e. the `constructor` will only be invoked once per parent
 * element). As such, we need to copy the `props.command` to
 * `state.command`, so that we can force a re-eval of the new
 * command. This in turn means we have to manage `state.isLoading`
 * ourselves. Good grief.
 *
 */
export default class Eval extends React.PureComponent<EvalProps, EvalState> {
  public constructor(props: EvalProps) {
    super(props)

    this.state = {
      isLoading: true,
      command: props.command,
      react: undefined,
      content: undefined,
      contentType: props.contentType
    }

    this.startLoading()
  }

  private startLoading() {
    const done = (content: ScalarResource) => {
      debug('eval done', content)
      this.setState({ isLoading: false, content })
    }

    if (typeof this.props.command === 'string') {
      // command string
      this.props.tab.REPL.qexec<ScalarResource>(this.props.command).then(done)
    } else {
      Promise.resolve(this.props.command(this.props.tab, this.props.response, this.props.args))
        .then(content => {
          if (isCommandStringContent(content)) {
            return this.props.tab.REPL.qexec<ScalarResource | ScalarContent>(content.contentFrom)
          } else {
            return content
          }
        })
        .then(content => {
          if (isReactProvider(content)) {
            this.setState({ isLoading: false, react: content })
          } else if (isStringWithOptionalContentType(content)) {
            this.setState({ isLoading: false, content: content.content, contentType: content.contentType })
          } else if (isScalarContent(content)) {
            done(content.content)
          } else {
            done(content)
          }
        })
    }
  }

  public render() {
    if (this.state.isLoading) {
      return <Loading />
    }

    const mode = this.state.react
      ? this.state.react
      : {
          content: this.state.content,
          contentType: this.state.contentType
        }

    return <KuiMMRContent tab={this.props.tab} mode={mode} response={this.props.response} args={this.props.args} />
  }
}
