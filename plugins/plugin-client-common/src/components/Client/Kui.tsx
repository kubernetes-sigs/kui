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

// FIXME:
/* eslint-disable react/prop-types */

import Debug from 'debug'
import * as React from 'react'
import {
  i18n,
  REPL,
  Theme,
  inBrowser,
  eventChannelUnsafe,
  findThemeByName,
  getPersistedThemeChoice,
  getDefaultTheme,
  ThemeProperties
} from '@kui-shell/core'

import Card from '../spi/Card'
import KuiContext from './context'
import KuiConfiguration from './KuiConfiguration'
import { ComboSidecar, InputStripe, StatusStripe, TabContainer, Loading } from '../..'

const debug = Debug('<Kui/>')
const strings = i18n('plugin-client-common')
const Popup = React.lazy(() => import(/* webpackMode: "lazy" */ './Popup'))

const defaultThemeProperties: ThemeProperties = {
  components: 'carbon',
  topTabNames: 'fixed'
}

export type Props = Partial<KuiConfiguration> & {
  /** no Kui bootstrap needed? */
  noBootstrap?: boolean

  /** operate in bottom Input mode? rather than as a conventional Input/Output terminal */
  bottomInput?: true | React.ReactNode

  /** operate in popup mode? */
  isPopup?: boolean

  /** if in popup mode, execute the given command line */
  commandLine?: string[]
}

type State = KuiConfiguration & {
  isBootstrapped: boolean
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

    eventChannelUnsafe.on('/theme/change', this.onThemeChange.bind(this))
    setTimeout(async () => {
      const { theme } = await findThemeByName((await getPersistedThemeChoice()) || (await getDefaultTheme()))
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

    try {
      this.state = Object.assign({}, this.defaultSessionBehavior(), this.defaultFeatureFlag(), props, {
        isBootstrapped: !!props.noBootstrap
      })
      debug('initial state', this.state)
    } catch (err) {
      console.log('using default configuration')
      this.state = {
        isBootstrapped: !!props.noBootstrap
      }
    }
  }

  private defaultFeatureFlag() {
    return {
      sidecarName: 'breadcrumb'
    }
  }

  /**
   * For browser-based clients, this defines the default UI for
   * session initialization.
   *
   */
  private defaultSessionBehavior(): KuiConfiguration {
    return !inBrowser()
      ? {}
      : {
          loading: <div className="kui--hero-text">Connecting to your cloud...</div>,
          reinit: <div className="kui--hero-text">Connection broken...</div>,
          loadingError: err => <div className="kui--hero-text">Error connecting to your cloud: {err.toString()}</div>,
          loadingDone: (repl: REPL) => (
            <Card title={strings('Successfully connected to your cloud')} repl={repl}>
              {strings('To learn more, try getting started')}
            </Card>
          )
        }
  }

  private onThemeChange({ themeModel }: { themeModel: Theme }) {
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

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo)
  }

  public render() {
    if (!this.state.isBootstrapped) {
      return <Loading />
    }

    if (this.props.isPopup && this.props.commandLine) {
      return (
        <KuiContext.Provider value={this.state}>
          <React.Suspense fallback={<div />}>
            <Popup commandLine={this.props.commandLine}>{this.props.children}</Popup>
          </React.Suspense>
        </KuiContext.Provider>
      )
    } else {
      const bottom = !!this.props.bottomInput && <InputStripe>{this.props.bottomInput}</InputStripe>

      return (
        <KuiContext.Provider value={this.state}>
          <div className="kui--full-height">
            <TabContainer noActiveInput={!!this.props.bottomInput} bottom={bottom}>
              <ComboSidecar />
            </TabContainer>
            <StatusStripe>{this.props.children}</StatusStripe>
          </div>
        </KuiContext.Provider>
      )
    }
  }
}

export default Kui
