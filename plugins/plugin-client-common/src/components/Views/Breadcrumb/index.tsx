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
import { REPL, Breadcrumb as KuBreadcrumb } from '@kui-shell/core'

import KuiContext from '../../Client/context'

import CarbonBreadcrumb from './Carbon'
import PatternflyBreadcrumb from './Patternfly'

export type BreadcrumbView = KuBreadcrumb & { deemphasize?: boolean; isCurrentPage?: boolean; className?: string }

export interface BreadcrumbProps {
  breadcrumbs: BreadcrumbView[]
  repl: REPL
}

export default class Breadcrumb extends React.PureComponent<BreadcrumbProps> {
  public render() {
    const breadcrumbs = this.props.breadcrumbs
    const currentPageIdxAsSpecified = breadcrumbs && breadcrumbs.findIndex(_ => _.isCurrentPage)
    const currentPageIdx = currentPageIdxAsSpecified < 0 ? breadcrumbs.length - 1 : currentPageIdxAsSpecified

    return (
      <React.Suspense fallback={<div />}>
        <KuiContext.Consumer>
          {config =>
            (config.components === 'patternfly' && (
              <PatternflyBreadcrumb breadcrumbs={breadcrumbs} currentPageIdx={currentPageIdx} repl={this.props.repl} />
            )) || <CarbonBreadcrumb breadcrumbs={breadcrumbs} currentPageIdx={currentPageIdx} repl={this.props.repl} />
          }
        </KuiContext.Consumer>
      </React.Suspense>
    )
  }
}
