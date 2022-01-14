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

// FIXME:
/* eslint-disable react/prop-types */

import Debug from 'debug'
import React from 'react'
import { Capabilities, Events, i18n, REPL, pexecInCurrentTab, encodeComponent, Themes } from '@kui-shell/core'

import KuiContext from './context'
import CommonClientProps from './props/Common'
import GuidebookProps from './props/Guidebooks'
import KuiConfiguration from './KuiConfiguration'
import StatusStripe, { Props as StatusStripeProps } from './StatusStripe'
import { TabContainer, Loading, Alert } from '../..'
import loadUserSettings, { on as onUserSettingsChange } from './UserSettings'

const InputStripe = React.lazy(() => import('./InputStripe'))
const LoadingCard = React.lazy(() => import('./LoadingCard'))

const debug = Debug('<Kui/>')
const strings = i18n('client')
const Popup = React.lazy(() => import(/* webpackMode: "lazy" */ './Popup'))

const defaultThemeProperties: Themes.ThemeProperties = {
  components: 'patternfly',
  topTabNames: 'fixed'
}

export type Props = Partial<KuiConfiguration> &
  GuidebookProps &
  CommonClientProps & {
    /** no Kui bootstrap needed? */
    noBootstrap?: boolean

    /** operate in bottom Input mode? rather than as a conventional Input/Output terminal */
    bottomInput?: true | React.ReactNode

    /** Elements to place between TabContainer and StatusStripe */
    toplevel?: React.ReactNode | React.ReactNode[]

    /** do not echo the command? */
    quietExecCommand?: boolean

    /** initial tab title */
    initialTabTitle?: string
  }

type State = KuiConfiguration & {
  userOverrides?: KuiConfiguration
  isBootstrapped: boolean
  commandLine?: string[]
  quietExecCommand?: boolean
}

/**
 * Render the main body of our client.
 *
 * |Notes on Session Initialization|: to provide custom views for
 * session initialization (only relevant for browser-based hosted
 * Kui), you can instantiate <Kui/> with these properties (defined in
 * KuiConfiguration), show here with some sample views:
 *
 * <Kui
 *    loading={<div className="kui--hero-text">Hold on...</div>}
 *    reinit={<div className="kui--hero-text">Connection broken...</div>}
 *    loadingError={err => <div className="kui--hero-text">{err.toString()}</div>}
 *    loadingDone={<div>Welcome to Kui</div>}
 * />
 *
 */
export class Kui extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    // refresh the UI after user changes settings overrides
    onUserSettingsChange(evt => {
      this.setState(curState => {
        // a bit of care is needed to handle removing keys
        if (evt !== 'set') {
          for (const key in curState.userOverrides) {
            delete curState[key]
          }
        }

        const newUserOverrides = loadUserSettings()
        return Object.assign(newUserOverrides, { userOverrides: newUserOverrides })
      })
    })

    Events.eventChannelUnsafe.on('/theme/change', this.onThemeChange.bind(this))
    setTimeout(async () => {
      const { theme } = await Themes.findThemeByName(
        (await Themes.getPersistedThemeChoice()) || (await Themes.getDefaultTheme())
      )
      this.setState(curState => {
        const stateWithThemeProps = Object.assign({}, theme, curState)
        debug('state with theme props', stateWithThemeProps)
        return stateWithThemeProps
      })
    })

    if (!props.noBootstrap) {
      import('@kui-shell/core')
        .then(_ => _.bootIntoSandbox())
        .then(() => {
          this.setState({ isBootstrapped: true })
        })
    }

    let commandLine = this.props.commandLine
    let quietExecCommand = this.props.quietExecCommand !== undefined ? this.props.quietExecCommand : !this.props.isPopup

    if (Capabilities.inBrowser()) {
      const windowQuery = window.location.search
      if (windowQuery) {
        // parse and extract the question mark in window.location.search
        // e.g. query = { command: 'replay /kui/welcome.json' }
        const query = require('querystring').parse(windowQuery.substring(1))

        // To avoid SQL injection attacks, users can only query with `replay` command
        if (query.command && /^replay/.test(query.command)) {
          commandLine = query.command.split(' ')
          quietExecCommand = false
        }
      }
    }

    try {
      const userOverrides = loadUserSettings()
      this.state = Object.assign({}, this.defaultSessionBehavior(), this.defaultFeatureFlag(), props, userOverrides, {
        userOverrides,
        isBootstrapped: !!props.noBootstrap,
        commandLine,
        quietExecCommand
      })
      debug('initial state:inBrowser?', Capabilities.inBrowser())
      debug('initial state:given properties', props)
      debug('initial state:final value', this.state)
    } catch (err) {
      console.log('using default configuration')
      this.state = {
        isBootstrapped: !!props.noBootstrap,
        commandLine,
        quietExecCommand
      }
    }
  }

  private defaultFeatureFlag() {
    return {
      sidecarName: 'breadcrumb',
      showWelcomeMax: -1
    }
  }

  private defaultLoading() {
    return (
      <Loading className="somewhat-larger-text" description={strings('Please wait while we connect to your cluster')} />
    )
  }

  private defaultReinit() {
    return (
      <Alert
        hideCloseButton
        className="kui--terminal-alert kui--connection-lost top-pad left-pad right-pad"
        alert={{
          type: 'error',
          title: strings('Lost connection to your cluster'),
          body: strings('Attempting to reconnect...')
        }}
      />
    )
  }

  private defaultLoadingDone() {
    return (repl: REPL) => (!Capabilities.inBrowser() ? undefined : <LoadingCard repl={repl} />)
  }

  private defaultLoadingError() {
    return err => (
      <Alert
        className="top-pad"
        alert={{ type: 'error', title: strings('Error connecting to your cluster'), body: err.toString() }}
      />
    )
  }

  /**
   * For browser-based clients, this defines the default UI for
   * session initialization.
   *
   */
  private defaultSessionBehavior(): KuiConfiguration {
    const behavior = !Capabilities.inBrowser()
      ? {}
      : {
          loading: this.defaultLoading(),
          reinit: this.defaultReinit(),
          loadingError: this.defaultLoadingError(),
          loadingDone: this.defaultLoadingDone()
        }

    debug('defaultSessionBehavior', behavior)
    return behavior
  }

  private onThemeChange({ themeModel }: { themeModel: Themes.Theme }) {
    this.setState(curState => {
      // note the priority order, from highest to lowest:
      //  1) any properties defined by the theme (since we just switched themes)
      //  2) any properties defined by the container of this <Kui/>
      //  3) default choices
      //  4) any prior state
      // re: ordering of 3 and 4, see https://github.com/IBM/kui/issues/4423
      const stateAfterThemeChange = Object.assign({}, curState, defaultThemeProperties, this.props, themeModel)
      debug('state after theme change', stateAfterThemeChange)
      return stateAfterThemeChange
    })
  }

  /**
   * Props to pass to StatusStripe. This allows us to set the desired
   * status stripe color at startup time, rather than seeing the
   * default color, followed quickly by a change to the color desired
   * by the controller backing the given `props.commandLine`. The
   * controller may still want to specialize the status stripe
   * further, but at least we can avoid that odd
   * e.g. defaultColor-then-blue effect.
   *
   */
  private statusStripeProps(): StatusStripeProps {
    if (this.state.commandLine) {
      const statusStripeIdx = this.state.commandLine.findIndex(_ => _ === '--status-stripe')
      if (statusStripeIdx >= 0) {
        return { type: this.props.commandLine[statusStripeIdx + 1] as StatusStripeProps['type'] }
      }
    }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  private firstTab = true
  private onTabReady() {
    if (this.state.commandLine && this.firstTab) {
      this.firstTab = false

      pexecInCurrentTab(
        this.state.commandLine.map(_ => encodeComponent(_)).join(' '),
        undefined,
        this.state.quietExecCommand
      )
    }
  }

  private readonly _onTabReady = this.onTabReady.bind(this)

  public render() {
    if (!this.state.isBootstrapped) {
      return <Loading />
    }

    if (this.props.isPopup && this.state.commandLine) {
      return (
        <KuiContext.Provider value={this.state}>
          <React.Suspense fallback={<div />}>
            <Popup commandLine={this.state.commandLine} noHelp={this.props.noHelp} noSettings={this.props.noSettings}>
              {this.props.children}
            </Popup>
          </React.Suspense>
        </KuiContext.Provider>
      )
    } else {
      const bottom = !!this.props.bottomInput && <InputStripe>{this.props.bottomInput}</InputStripe>
      return (
        <KuiContext.Provider value={this.state}>
          <React.Suspense fallback={<div />}>
            <div className="kui--full-height">
              <TabContainer
                productName={this.props.productName}
                version={this.props.version}
                noActiveInput={this.props.noActiveInput || !!this.props.bottomInput}
                bottom={bottom}
                title={this.props.initialTabTitle}
                onTabReady={this.state.commandLine && this._onTabReady}
                closeableTabs={this.props.closeableTabs}
                guidebooks={this.props.guidebooks}
                guidebooksCommand={this.props.guidebooksCommand}
                guidebooksExpanded={this.props.guidebooksExpanded}
              ></TabContainer>
              {this.props.toplevel}
              {this.props.statusStripe !== false && (
                <StatusStripe
                  noHelp={this.props.noHelp}
                  noSettings={this.props.noSettings}
                  {...this.statusStripeProps()}
                >
                  {this.props.children}
                </StatusStripe>
              )}
            </div>
          </React.Suspense>
        </KuiContext.Provider>
      )
    }
  }
}

export default Kui
