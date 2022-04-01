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

import {
  ScalarResource,
  SupportedStringContent,
  isCommandStringContent,
  FunctionThatProducesContent,
  ReactProvider,
  isReactProvider,
  isScalarContent,
  ScalarContent,
  EditableSpec,
  isStringWithOptionalContentType
} from '@kui-shell/core'

import { Loading } from '../../'
import KuiMMRContent, { KuiMMRProps } from './KuiContent'

interface EvalProps extends Omit<KuiMMRProps, 'mode'> {
  execUUID: string
  command: string | FunctionThatProducesContent
  contentType?: SupportedStringContent
}

interface EvalState {
  execUUID: string
  isLoading: boolean
  command: string | FunctionThatProducesContent
  react: ReactProvider
  content: ScalarResource
  contentType: SupportedStringContent
  spec?: EditableSpec
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
    this.state = Eval.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: EvalProps, state?: EvalState) {
    if (!state || state.execUUID !== props.execUUID) {
      return {
        execUUID: props.execUUID,
        isLoading: true,
        command: props.command,
        react: undefined,
        spec: undefined,
        content: undefined,
        contentType: props.contentType
      }
    } else {
      return state
    }
  }

  public componentDidMount() {
    this.startLoading()
  }

  private startLoading() {
    const done = (content: ScalarResource) => {
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
            this.setState({
              isLoading: false,
              content: content.content,
              contentType: content.contentType,
              spec: content.spec
            })
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
          spec: this.state.spec,
          content: this.state.content,
          contentType: this.state.contentType
        }

    return <KuiMMRContent {...this.props} mode={mode} />
  }
}
