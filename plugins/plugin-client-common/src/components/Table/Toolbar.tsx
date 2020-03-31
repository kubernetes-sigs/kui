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

import { Breadcrumb as KuiBreadcrumb } from '@kui-shell/core'

import * as React from 'react'
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import {
  Grid16 as GridIcon,
  List16 as ListIcon,
  CaretRight20 as NextPage,
  CaretLeft20 as PreviousPage
} from '@carbon/icons-react'

import 'carbon-components/scss/components/pagination/_pagination.scss'

export type Props = Partial<GridProps> &
  Partial<PaginationProps> &
  Partial<BreadcrumbProps> & {
    frame?: boolean
  }

interface GridProps {
  gridableColumn: number
  asGrid?: boolean
  setAsGrid: (asGrid: boolean) => void
}

interface PaginationProps {
  paginate: boolean
  page: number
  totalItems: number
  pageSize: number
  setPage: (page: number) => void
}

export type ToolbarBreadcrumb = KuiBreadcrumb & { className?: string; isCurrentPage?: boolean }

interface BreadcrumbProps {
  breadcrumbs: ToolbarBreadcrumb[]
}

export default class Toolbar extends React.PureComponent<Props> {
  private isGridable() {
    return this.props.gridableColumn && this.props.gridableColumn >= 0
  }

  private gridController() {
    if (this.isGridable()) {
      return (
        <React.Fragment>
          <a
            role="presentation"
            href="#"
            className="kui--table-navigatable kui--toolbar-button-with-icon kui--toolbar-button-as-list"
            data-enabled={!this.props.asGrid}
            onClick={() => this.props.setAsGrid(false)}
          >
            <ListIcon />
          </a>
          <a
            role="presentation"
            href="#"
            className="kui--table-navigatable kui--toolbar-button-with-icon kui--toolbar-button-as-grid"
            data-enabled={this.props.asGrid}
            onClick={() => this.props.setAsGrid(true)}
          >
            <GridIcon />
          </a>
        </React.Fragment>
      )
    }
  }

  private previousPage() {
    this.props.setPage(this.props.page - 1)
  }

  private nextPage() {
    this.props.setPage(this.props.page + 1)
  }

  private paginationController() {
    if (this.props.paginate) {
      const start = (this.props.page - 1) * this.props.pageSize + 1
      const end = this.props.page * this.props.pageSize
      const isFirstPage = this.props.page === 1
      const nPages = ~~(this.props.totalItems / this.props.pageSize)
      const isLastPage = this.props.page === nPages

      const maxLength = end.toString().length
      const rangeText = `${start.toString().padStart(maxLength)} \u2014 ${end} of ${this.props.totalItems}`

      return (
        <div className="kui--data-table-toolbar-pagination bx--pagination">
          <span className="kui--data-table-toolbar-pagination-info">{rangeText}</span>
          <button
            type="button"
            onMouseDown={evt => evt.preventDefault()}
            disabled={isFirstPage}
            className={
              'bx--pagination__button bx--pagination__button--forward' +
              (isFirstPage ? ' bx--pagination__button--no-index' : '')
            }
            aria-label="Previous page"
            onClick={() => this.previousPage()}
          >
            <PreviousPage />
          </button>
          <button
            type="button"
            onMouseDown={evt => evt.preventDefault()}
            disabled={isLastPage}
            className={
              'bx--pagination__button bx--pagination__backward--forward' +
              (isLastPage ? ' bx--pagination__button--no-index' : '')
            }
            aria-label="Next page"
            onClick={() => this.nextPage()}
          >
            <NextPage />
          </button>
        </div>
      )
    }
  }

  private breadcrumbs() {
    if (this.props.breadcrumbs) {
      return (
        <Breadcrumb noTrailingSlash>
          {this.props.breadcrumbs.map((_, idx) => (
            <BreadcrumbItem href="#" key={idx} className={_.className} isCurrentPage={_.isCurrentPage}>
              {_.command ? <a href="#">{_.label}</a> : <span>{_.label}</span>}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      )
    }
  }

  public render() {
    return (
      <div className="kui--data-table-toolbar" data-frame={this.props.frame}>
        {this.breadcrumbs()}
        <div className="kui--data-table-toolbar-buttons">{this.gridController()}</div>
        {this.paginationController()}
      </div>
    )
  }
}
