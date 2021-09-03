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
  encodeComponent,
  eventChannelUnsafe,
  flatten,
  getPersistedThemeChoice,
  i18n,
  pexecInCurrentTab,
  uiThemes,
  Theme
} from '@kui-shell/core'

import { Loading } from '../../..'
import DropdownWidget, { Props as DropdownWidgetProps } from './DropdownWidget'

const strings = i18n('plugin-client-common')

type Props = Pick<DropdownWidgetProps, 'position'>

interface State {
  currentTheme: string
  themes: Theme[]
}

export default class Settings extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      currentTheme: undefined,
      themes: []
    }

    this.recomputeThemeList()

    eventChannelUnsafe.on('/theme/change', ({ theme }: { theme: string }) => {
      this.setState({ currentTheme: theme })
    })
  }

  private async recomputeThemeList() {
    const [currentTheme, themes] = await Promise.all([
      getPersistedThemeChoice(),
      uiThemes()
        .then(_ => _.map(({ themes }) => themes))
        .then(flatten)
    ])

    this.setState({
      currentTheme,
      themes: themes
    })
  }

  private header() {
    if (!this.state.currentTheme) {
      return <Loading />
    } else {
      return (
        <React.Fragment>
          <div>{strings('Current Theme')}</div>
          <div>
            <strong>{this.state.currentTheme}</strong>
          </div>
          <div className="sub-text even-smaller-text">{this.changeTheme()}</div>
        </React.Fragment>
      )
    }
  }

  private body() {
    if (!this.state.currentTheme) {
      return <Loading />
    } else {
      return <React.Fragment />
    }
  }

  /** @return UI for changing themes */
  private changeTheme() {
    return (
      <a href="#" onClick={() => pexecInCurrentTab('themes')}>
        {strings('Switch theme')}
      </a>
    )
  }

  public render() {
    //            aria-label="Settings"
    //            tabIndex={0}
    if (!this.state || !this.state.currentTheme) {
      return <React.Fragment />
    }

    return (
      <DropdownWidget
        noPadding
        id="kui--settings-widget"
        title={strings('Switch theme')}
        actions={this.state.themes.map(_ => ({
          label: _.name,
          isSelected: _.name === this.state.currentTheme,
          handler: () => pexecInCurrentTab(`theme set ${encodeComponent(_.name)}`)
        }))}
      />
    )
  }
}
