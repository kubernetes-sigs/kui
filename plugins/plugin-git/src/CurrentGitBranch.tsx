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

import { Icons, ViewLevel, TextWithIconWidget } from '@kui-shell/plugin-client-common'
import { wireToStandardEvents, getCurrentTab, i18n, CodedError } from '@kui-shell/core'

const strings = i18n('plugin-bash-like')
const strings2 = i18n('plugin-git')

interface Props {
  className?: string
}

interface State {
  text: string
  viewLevel: ViewLevel
}

export default class CurrentGitBranch extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      text: '',
      viewLevel: 'hidden'
    }
  }

  /**
   * Check the current branch, and the dirtiness thereof.
   *
   */
  private async reportCurrentBranch() {
    const tab = getCurrentTab()
    if (!tab || !tab.REPL) {
      return
    }

    try {
      const [isDirty, branch] = await Promise.all([
        // exit 0/1 indicates clean/dirty
        tab.REPL.qexec('git diff-index --quiet HEAD --')
          .then(() => false)
          .catch(() => true),

        // exits with branch name
        tab.REPL.qexec<string>('git rev-parse --abbrev-ref HEAD')
      ])

      // is the branch dirty?
      this.setState({
        text: branch,
        viewLevel: isDirty ? 'warn' : 'normal'
      })
    } catch (error) {
      const err = error as CodedError
      if (err.code !== 128 && !/ambiguous argument 'HEAD'/.test(err.message)) {
        // 128: not a git repository; don't report those as errors
        console.error('unable to determine git branch', err.code, typeof err.code, err)
      }

      // but, in either case, hide the entry
      this.setState({
        text: strings('not a repo'),
        viewLevel: 'hidden'
      })
    }
  }

  /**
   * Once we have mounted, we immediately check the current branch,
   * and schedule an update based on standard REPL events.
   *
   */
  public componentDidMount() {
    this.reportCurrentBranch()
    wireToStandardEvents(this.reportCurrentBranch.bind(this))
  }

  public render() {
    return (
      <TextWithIconWidget
        className={this.props.className}
        text={this.state.text}
        viewLevel={this.state.viewLevel}
        id="kui--plugin-git--current-git-branch"
        title={strings2('Your current git branch')}
        iconOnclick="git status"
        textOnclick="git branch"
      >
        <Icons icon="CodeBranch" />
      </TextWithIconWidget>
    )
  }
}
