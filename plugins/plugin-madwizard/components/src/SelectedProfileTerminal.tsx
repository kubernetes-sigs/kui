/*
 * Copyright 2022 The Kubernetes Authors
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

import RestartableTerminal, { Props } from './RestartableTerminal'

type MyProps = Props & {
  selectedProfile: string
}

type State = {
  cmdline: string
}

export default class SelectedProfileTerminal extends React.PureComponent<MyProps, State> {
  public static readonly selectedProfilePattern = /\$\{SELECTED_PROFILE\}/g

  public constructor(props: MyProps) {
    super(props)
    this.state = {
      cmdline: this.cmdline(props.selectedProfile)
    }
  }

  private cmdline(selectedProfile: string) {
    return this.props.cmdline.replace(SelectedProfileTerminal.selectedProfilePattern, selectedProfile)
  }

  public render() {
    return <RestartableTerminal {...this.props} cmdline={this.state.cmdline} />
  }
}
