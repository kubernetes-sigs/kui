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
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'

import Props from '../model'
import { getCurrentPageIdx } from '..'

import '../../../../../web/scss/components/Breadcrumb/Carbon.scss'

export default class CarbonBreadcrumb extends React.PureComponent<Props> {
  public render() {
    const breadcrumbs = this.props.breadcrumbs
    const currentPageIdx = getCurrentPageIdx(this.props)

    return (
      <Breadcrumb noTrailingSlash={breadcrumbs.length > 1}>
        {breadcrumbs.map((_, idx) => (
          <BreadcrumbItem
            href="#"
            key={idx}
            className={[_.className, _.deemphasize && 'kui--secondary-breadcrumb', 'zoomable'].filter(_ => _).join(' ')}
            isCurrentPage={idx === currentPageIdx}
            onClick={_.command && (() => this.props.repl.pexec(_.command))}
          >
            {_.command ? <a href="#">{_.label}</a> : <span>{_.label}</span>}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    )
  }
}
