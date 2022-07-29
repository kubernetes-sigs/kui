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
import { encodeComponent, Events, pexecInCurrentTab, Settings as Setting, Themes, Util } from '@kui-shell/core'

import DropdownWidget, { Props as DropdownWidgetProps } from './DropdownWidget'

type Props = Pick<DropdownWidgetProps, 'position'>

interface State {
  currentTheme: string
  actions: DropdownWidgetProps['actions']
}

export default class Settings extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      currentTheme: undefined,
      actions: []
    }

    this.recomputeThemeList()

    Events.eventChannelUnsafe.on('/theme/change', ({ theme }: { theme: string }) => {
      this.setState({ currentTheme: theme })
    })
  }

  private async recomputeThemeList() {
    const [currentTheme, themes] = await Promise.all([
      Themes.getPersistedThemeChoice(),
      Setting.uiThemes()
        .then(_ => _.map(({ themes }) => themes))
        .then(Util.flatten)
    ])

    this.setState({
      currentTheme,
      actions: themes.map(_ => ({
        label: _.name,
        isSelected: _.name === currentTheme,
        handler: () => pexecInCurrentTab(`theme set ${encodeComponent(_.name)}`, undefined, true)
      }))
    })
  }

  public render() {
    if (!this.state || !this.state.currentTheme) {
      return <React.Fragment />
    }

    return <DropdownWidget noPadding id="kui--settings-widget" actions={this.state.actions} />
  }
}
