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

/*
 * For debugging, this will reset the dulyNoted bit:
 *
 * localStorage.removeItem('kui-shell.org/UpdateChecker/DulyNoted')
 *
 */

import React from 'react'
import needle from 'needle'

import { Events, getCurrentTab, pexecInCurrentTab, i18n } from '@kui-shell/core'
import { TextWithIconWidget as Widget, TextWithIconWidgetProps, Markdown } from '@kui-shell/plugin-client-common'

import '../../web/scss/components/UpdateChecker/_index.scss'

const strings = i18n('plugin-core-support')

/** Default repo/org */
const repo = 'kubernetes-sigs/kui'

/** Base URL for get */
const baseUrl = () => {
  try {
    return require('@kui-shell/client/config.d/repo.json').url
  } catch (err) {
    return `https://api.github.com/repos/${repo}`
  }
}

/** Releases feed */
const FEED = () => `${baseUrl()}/releases/latest`

/** By default, check for updates once a day */
const DEFAULT_INTERVAL = 24 * 60 * 60 * 1000

/** By default, wait 1 minute after statup for the first check */
const DEFAULT_LAG = 1 * 60 * 1000

/** Remember that the version "duly noted" the availability of particular version in localStorage, using this key */
const DULY_NOTED_KEY = 'kui-shell.org/UpdateChecker/DulyNoted'

interface Props {
  /** wait this long (millis) before the first update check */
  lag?: number

  /** periodically check for updates with this interval (millis) */
  interval?: number

  /** Additional css classes */
  className?: string

  /** Name for brew upgrade */
  brewName?: string
}

interface State {
  /** timer that periodically checks for updates */
  pinger: ReturnType<typeof setInterval>

  /** version we are running */
  currentVersion: string

  /** latest version on the release FEED */
  latestVersion: string

  /** user has acknowledged the given version */
  dulyNoted: string

  /** Full atom entry for the latest version */
  entryForLatestVersion?: {
    title: string
    updated: string
    version: string
    content: string
    download: string
  }

  popover: TextWithIconWidgetProps['popover']
}

/**
 * GitHub gives back "v8.10.0" and the Kui version command gives back "8.10.0".
 *
 * @see https://github.com/IBM/kui/issues/4918
 *
 */
function stripOffPrefixV(githubVersionString: string): string {
  return githubVersionString.replace(/^v/, '')
}

export default class UpdateChecker extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    setTimeout(() => this.checkForUpdates(), this.props.lag || DEFAULT_LAG)

    this.state = {
      pinger: this.initPinger(),
      currentVersion: undefined,
      latestVersion: undefined,
      popover: undefined,
      dulyNoted: localStorage.getItem(DULY_NOTED_KEY)
    }
  }

  /** Initialize a timer that periodically checks for updates */
  private initPinger() {
    return setInterval(() => {
      this.checkForUpdates()
    }, this.props.interval || DEFAULT_INTERVAL)
  }

  /** Ping the release feed to check for the latest release */
  private checkForUpdates() {
    needle('get', FEED(), { json: true })
      .then(res => {
        const version = res.body.tag_name

        const entryForLatestVersion = {
          title: 'Release Notes from Kui',
          updated: res.body.published_at,
          version: res.body.tag_name,
          content: res.body.body,
          download: res.body.html_url
        }

        const latestVersion = stripOffPrefixV(version) // see https://github.com/IBM/kui/issues/4918

        this.setState(curState => ({
          latestVersion,
          entryForLatestVersion,
          popover: this.popover(entryForLatestVersion),
          dulyNoted: curState.dulyNoted && curState.dulyNoted !== latestVersion ? undefined : curState.dulyNoted
        }))
      })
      .catch(err => {
        console.error('error checking for updates', err)
      })
  }

  private readonly _brewUpgrade = () => pexecInCurrentTab(`brew upgrade ${this.props.brewName || 'kui'}`)

  private popover(entryForLatestVersion: State['entryForLatestVersion']) {
    if (entryForLatestVersion) {
      return {
        maxWidth: '23rem',
        className: 'kui--update-checker--popover',
        onHide: () => this.dulyNoted(),

        bodyContent: (
          <React.Fragment>
            <Markdown source={entryForLatestVersion.content} baseUrl={baseUrl()} />
          </React.Fragment>
        ),
        headerContent: (
          <React.Fragment>
            <div>{entryForLatestVersion.title}</div>
            <div>
              <strong>{entryForLatestVersion.version}</strong>
            </div>
            <div className="sub-text even-smaller-text">
              {process.platform === 'darwin' ? (
                <a href="#" onClick={this._brewUpgrade}>
                  Upgrade
                </a>
              ) : (
                <a href={entryForLatestVersion.download}>Download</a>
              )}
            </div>
          </React.Fragment>
        )
      }
    }
  }

  /** What version are we running? */
  private async getCurrentVersion() {
    if (!this.state.currentVersion) {
      const tab = getCurrentTab()
      if (!tab || !tab.REPL) {
        if (tab && !tab.REPL) {
          Events.eventChannelUnsafe.once(`/tab/new/${tab.uuid}`, () => this.getCurrentVersion())
        }
        return
      }

      const currentVersion = await tab.REPL.qexec<string>('version')
      this.setState({ currentVersion })
    }
  }

  public componentDidMount() {
    this.getCurrentVersion()
  }

  /** Bye! */
  public componentWillUnmount() {
    if (this.state.pinger) {
      clearInterval(this.state.pinger)
    }
  }

  /** Given current state, is an update available? */
  private isUpdateAvailable() {
    const isSemverUpdateAvailable = () => {
      const latest = this.state.latestVersion.split('.').map(_ => parseInt(_))
      const current = this.state.currentVersion.split('.').map(_ => parseInt(_))
      const res =
        latest[0] > current[0] ||
        (latest[0] === current[0] && latest[1] > current[1]) ||
        (latest[0] === current[0] && latest[1] === current[1] && latest[2] > current[2])

      return res
    }
    return (
      this.state.currentVersion &&
      this.state.latestVersion &&
      isSemverUpdateAvailable() &&
      this.state.latestVersion !== this.state.dulyNoted
    )
  }

  /** Text for update available notification */
  private text() {
    return this.isUpdateAvailable() ? strings('Update available', this.state.latestVersion) : ''
  }

  /** User has acknoledged the notification  */
  private async dulyNoted() {
    try {
      localStorage.setItem(DULY_NOTED_KEY, this.state.latestVersion)
    } catch (err) {
      console.error('Error opening releases page')
    }

    this.setState({
      dulyNoted: this.state.latestVersion
    })
  }

  public render() {
    if (this.isUpdateAvailable()) {
      return (
        <Widget
          id="kui--plugin-core-support--update-checker"
          className={this.props.className}
          viewLevel="info"
          text={this.text()}
          title={strings(
            'Version X is available. Click to see the changelog and download the new release.',
            this.state.latestVersion
          )}
          popover={this.state.popover}
        />
      )
    } else {
      return <React.Fragment />
    }
  }
}
