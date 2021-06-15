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
import { basename, dirname, join } from 'path'

import { Icons, ViewLevel, TextWithIconWidget } from '@kui-shell/plugin-client-common'
import {
  wireToStandardEvents,
  unwireToStandardEvents,
  eventBus,
  getCurrentTab,
  inBrowser,
  i18n,
  encodeComponent,
  pexecInCurrentTab,
  CodedError
} from '@kui-shell/core'

const strings = i18n('plugin-bash-like')
const strings2 = i18n('plugin-git')

interface Props {
  className?: string
}

interface State {
  text: string
  status: string
  viewLevel: ViewLevel
}

export default class CurrentGitBranch extends React.PureComponent<Props, State> {
  private readonly handler = this.reportCurrentBranch.bind(this)

  public constructor(props: Props) {
    super(props)

    this.state = {
      text: '',
      status: '',
      viewLevel: 'hidden'
    }
  }

  /** Avoid recomputation for a flurry of events */
  private last: number
  private debounce(): boolean {
    const now = Date.now()
    const last = this.last
    this.last = now

    return last && now - last < 250
  }

  /**
   * Check the current branch, and the dirtiness thereof.
   *
   */
  private async reportCurrentBranch() {
    const tab = getCurrentTab()
    if (!tab || !tab.REPL) {
      return
    } else if (this.debounce()) {
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

      tab.REPL.qexec<true | string>('git status -s').then(status =>
        this.setState({ status: status === true ? '' : status })
      )

      // is the branch dirty?
      this.setState({
        text: branch,
        viewLevel: isDirty ? 'warn' : 'normal'
      })
    } catch (error) {
      const err = error as CodedError
      this.last = undefined
      if (err.code !== 128 && !/ambiguous argument 'HEAD'/.test(err.message) && !/not a git repo/.test(err.message)) {
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
    if (inBrowser()) {
      eventBus.once('/tab/new', this.handler)
    } else {
      this.handler()
    }
    wireToStandardEvents(this.handler)
  }

  /** Make sure to unsubscribe! */
  public componentWillUnmount() {
    unwireToStandardEvents(this.handler)
  }

  /** @return the header for the Popover component */
  private popoverHeader() {
    return (
      <React.Fragment>
        <div>{strings('Git Branch')}</div>
        <div>
          <strong>{this.state.text}</strong>
        </div>
        <div className="sub-text even-smaller-text">{this.changeBranch()}</div>
      </React.Fragment>
    )
  }

  /** @return the body for the Popover component */
  private popoverBody() {
    const statusModel = this.statusModel()

    return (
      <div className="top-pad bottom-pad">
        {this.summary(statusModel)}
        {this.changes(statusModel)}
      </div>
    )
  }

  /** @return a model of `git status -s` */
  private statusModel() {
    return !this.state.status
      ? []
      : this.state.status
          .split(/\n/)
          .map(line => {
            const match = line.match(/(.+)\s+(.+)/)
            if (match) {
              return { M: match[1], file: match[2] }
            }
          })
          .filter(_ => _)
  }

  /** @return UI that summarizes the `statusModel` changes */
  private summary(statusModel: ReturnType<CurrentGitBranch['statusModel']>) {
    return (
      <span className="sub-text">
        {statusModel.length > 0
          ? strings('You have made the following changes to this branch.')
          : strings('You have made no changes to this branch.')}
      </span>
    )
  }

  /** @return UI for changes represented by `statusModel` */
  private changes(statusModel: ReturnType<CurrentGitBranch['statusModel']>) {
    return (
      <div className="small-top-pad monospace even-smaller-text pre-wrap">
        {statusModel.map(({ M, file }) => (
          <div key={`${M}-${file}`} className="tiny-top-pad">
            {[...M].map((m, idx) => (
              <strong
                key={`${m}-${idx}`}
                className={/M/.test(m) ? 'red-text' : /D/.test(m) ? 'red-text' : /A/.test(m) ? 'cyan-text' : ''}
              >
                {m}
              </strong>
            ))}
            <span
              title={file}
              className="small-left-pad clickable"
              onClick={() => pexecInCurrentTab(`git diff ${encodeComponent(file)}`)}
            >
              {join(basename(dirname(file)), basename(file))}
            </span>
          </div>
        ))}
      </div>
    )
  }

  /** @return desired Popover model */
  private popover() {
    return {
      bodyContent: this.popoverBody(),
      headerContent: this.popoverHeader()
    }
  }

  /** @return UI for changing branches */
  private changeBranch() {
    return (
      <a href="#" onClick={() => pexecInCurrentTab('git branch')}>
        {strings2('Switch branch')}
      </a>
    )
  }

  public render() {
    return (
      <TextWithIconWidget
        className={this.props.className}
        text={this.state.text}
        viewLevel={this.state.viewLevel}
        id="kui--plugin-git--current-git-branch"
        title={strings2('Your current git branch')}
        popover={this.popover()}
      >
        <Icons icon="CodeBranch" />
      </TextWithIconWidget>
    )
  }
}
