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
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core/dist/esm/components/Breadcrumb'

import Props from '../model'
import { getCurrentPageIdx } from '..'

import '../../../../../web/scss/components/Breadcrumb/Patternfly.scss'

export default class PatternflyBreadcrumb extends React.PureComponent<Props> {
  public render() {
    const currentPageIdx = getCurrentPageIdx(this.props)

    return (
      <Breadcrumb className="kui--breadcrumb">
        {this.props.breadcrumbs.map((_, idx) => {
          const onClick = _.command && (() => this.props.repl.pexec(_.command))
          return (
            <BreadcrumbItem
              to={onClick ? '#' : undefined}
              key={idx}
              className={[
                _.className,
                'kui--breadcrumb-item',
                _.deemphasize && 'kui--secondary-breadcrumb',
                idx === currentPageIdx && 'kui--current-page-breadcrumb'
              ]
                .filter(_ => _)
                .join(' ')}
              isActive={idx === this.props.breadcrumbs.length - 1}
              onClick={onClick}
            >
              {_.label}
            </BreadcrumbItem>
          )
        })}
      </Breadcrumb>
    )
  }
}
