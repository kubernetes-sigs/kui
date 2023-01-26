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

import { flatten } from '@kui-shell/core/mdist/api/Util'
import { uiThemes } from '@kui-shell/core/mdist/api/Settings'
import { eventChannelUnsafe } from '@kui-shell/core/mdist/api/Events'
import { getPersistedThemeChoice } from '@kui-shell/core/mdist/api/Themes'
import { encodeComponent, pexecInCurrentTab } from '@kui-shell/core/mdist/api/Exec'

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
  }

  public componentDidMount() {
    eventChannelUnsafe.on('/theme/change', ({ theme }: { theme: string }) => {
      this.setState({ currentTheme: theme })
    })
    this.recomputeThemeList()
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
