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
import { Tab as KuiTab, ScalarResource, SupportedStringContent } from '@kui-shell/core'

import Loading from './Loading'
import KuiMMRContent from './KuiContent'

interface EvalProps {
  tab: KuiTab
  command: string
  contentType: SupportedStringContent
}

interface EvalState {
  isLoading: boolean
  command: string
  content: ScalarResource
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
      isLoading: false,
      command: props.command,
      content: undefined
    }
  }

  public static getDerivedStateFromProps(props: EvalProps, state: EvalState) {
    const newState = {
      isLoading: state.isLoading,
      command: props.command,
      content: props.command === state.command ? state.content : undefined
    }

    return newState
  }

  public render() {
    if (!this.state.content) {
      if (!this.state.isLoading) {
        this.setState({ isLoading: true })
        this.props.tab.REPL.qexec<ScalarResource>(this.props.command).then(content => {
          console.error('eval done', content)
          this.setState({ isLoading: false, content })
        })
      }

      return <Loading />
    }

    const mode = {
      content: this.state.content,
      contentType: this.props.contentType
    }

    return <KuiMMRContent tab={this.props.tab} mode={mode} />
  }
}
