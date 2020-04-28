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
import { Tab } from '@kui-shell/core'
import KuiContext from '../../../Client/context'
import { HistoryEntry } from '../LeftNavSidecar'

import CarbonSideNav from './Carbon'
import PatternflyNavgitation from './Patternfly'

export interface NavigationProps {
  tab: Tab
  current: HistoryEntry
  changeCurrent: (menuIdx: number, tabIdx: number) => void
}

export default class Navigation extends React.PureComponent<NavigationProps> {
  public render() {
    return (
      <React.Suspense fallback={<div />}>
        <KuiContext.Consumer>
          {config =>
            (config.components === 'patternfly' && <PatternflyNavgitation {...this.props} />) || (
              <CarbonSideNav {...this.props} />
            )
          }
        </KuiContext.Consumer>
      </React.Suspense>
    )
  }
}
