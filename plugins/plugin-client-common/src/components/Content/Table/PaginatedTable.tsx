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

import {
  Tab,
  REPL,
  Table as KuiTable,
  Row as KuiRow,
  TableStyle,
  i18n,
  isTableWithCount,
  isTableWithTimestamp,
  isWatchable
} from '@kui-shell/core'

import React from 'react'
import { SortByDirection } from '@patternfly/react-table/dist/esm/components/Table'
import { TableComposable } from '@patternfly/react-table/dist/esm/components/TableComposable'

import sortRow from './sort'
import Card from '../../spi/Card'
import Timeline from './Timeline'
import renderBody from './TableBody'
import renderHeader from './TableHeader'
import ProgressState from './ProgressState'
import SequenceDiagram from './SequenceDiagram'
import kuiHeaderFromBody from './kuiHeaderFromBody'
import Toolbar, { Props as ToolbarProps } from './Toolbar'
import Grid, { findGridableColumn } from './Grid'
import { BreadcrumbView } from '../../spi/Breadcrumb'
import KuiConfiguration from '../../Client/KuiConfiguration'

/** import the kui theme alignment */
import '../../../../web/scss/components/Table/_index.scss'
import '../../../../web/scss/components/Table/PatternFly.scss'
// import '../../../../web/scss/components/Table/carbon-kui-theme-alignment.scss'

const strings = i18n('plugin-client-common')

interface PaginationConfiguration {
  pageSize?: number
}

/** parameters to PaginatedTable component */
export type Props<T extends KuiTable = KuiTable> = PaginationConfiguration & {
  tab: Tab
  config: KuiConfiguration
  repl: REPL
  response: T

  /**
   * paginate: true -> always paginate
   * paginate: false -> never paginate
   * paginate: number -> paginate if above the threshold of rows
   */
  paginate: boolean | number

  /** use toolbars? */
  toolbars: boolean

  /** use title? */
  title: boolean

  /** Is the Sidecar visible in this Tab? or some other width constraint? */
  isWidthConstrained: boolean

  /** display as grid (versus as regular table)? */
  asGrid: boolean

  /** prefix breadcrumbs? */
  prefixBreadcrumbs?: BreadcrumbView[]

  onRender: (hasContent: boolean) => void
}

/** state of PaginatedTable component */
export type State<T extends KuiTable = KuiTable> = ToolbarProps &
  ProgressState & {
    response: T
    header: KuiRow
    body: KuiRow[]
    footer: string[]

    page: number
    pageSize: number

    /* sorting */
    activeSortIdx: number
    activeSortDir: SortByDirection

    lastUpdatedMillis: number
  }

export function getBreadcrumbsFromTable(response: KuiTable, prefixBreadcrumbs: BreadcrumbView[]) {
  const titleBreadcrumb: BreadcrumbView[] = response.title
    ? [{ label: response.title, className: 'kui--data-table-title kui--sidecar-kind', isCurrentPage: true }]
    : []

  const _responseCrumbs = typeof response.breadcrumbs === 'function' ? response.breadcrumbs() : response.breadcrumbs
  const responseCrumbs = !_responseCrumbs
    ? []
    : _responseCrumbs.map(_ => Object.assign({}, _, { className: 'kui--secondary-breadcrumb' }))

  const breadcrumbs = (prefixBreadcrumbs || []).concat(responseCrumbs).concat(titleBreadcrumb)

  return breadcrumbs
}

/**
 * A DataTable/Pagination pair
 *
 */
export default class PaginatedTable<P extends Props, S extends State> extends React.PureComponent<P, S> {
  private readonly defaultPageSize: number

  /**
   * A lock that governs the --kui--table-max-height
   * initialization. See https://github.com/IBM/kui/issues/5206
   *
   */
  private static oneTimeInit = false

  public constructor(props: P) {
    super(props)
    this.defaultPageSize = props.pageSize || 10

    /** Manage the --kui--table-max-height css variable */
    if (!PaginatedTable.oneTimeInit) {
      PaginatedTable.oneTimeInit = true
      const adjustMaxHeight = () => {
        const maxHeight = ~~(0.66 * document.body.getBoundingClientRect().height)
        document.body.style.setProperty('--kui--table-max-height', `${maxHeight}px`)
      }
      adjustMaxHeight()
      window.addEventListener('resize', adjustMaxHeight)
    }

    this.state = PaginatedTable.getDerivedStateFromProps(props) as S
  }

  public static getDerivedStateFromProps(props: Props, currentState?: State) {
    try {
      const { header = kuiHeaderFromBody(props.response.body), body, footer, defaultPresentation } = props.response
      props.response.header = header
      if (props.config && props.config.drilldownTo) {
        props.response.drilldownTo = props.config.drilldownTo
      }

      const asGrid =
        ((!defaultPresentation || defaultPresentation === 'grid') &&
          props.asGrid &&
          findGridableColumn(props.response) >= 0) ||
        defaultPresentation === 'grid'
      const asSequence =
        (!asGrid && PaginatedTable.hasSequenceButton(props) && props.response.body.length > 1) ||
        defaultPresentation === 'sequence-diagram'

      const defaults = {
        page: 1,
        pageSize: 10,
        asTimeline: false
      }

      const newState = {
        body,
        asGrid,
        footer,
        header,
        asSequence,
        lastUpdatedMillis: !currentState ? Date.now() : currentState.lastUpdatedMillis,
        activeSortIdx: -1,
        activeSortDir: undefined,
        response: props.response,
        pageSize: props.pageSize || defaults.pageSize
      }

      if (!currentState) {
        // new instance of this component
        return Object.assign(defaults, newState)
      } else if (newState.response !== currentState.response) {
        // user made changes to the existing props instance
        return Object.assign(defaults, currentState, newState)
      } else {
        // different props
        return Object.assign(defaults, newState, currentState, { asSequence })
      }
    } catch (err) {
      console.error('Internal error preparing PaginatedTable', err)
    }
  }

  private topToolbar(lightweightTables = false) {
    // 1) If we started as a table, and are now a grid, then show
    // "Status Grid", otherwise:
    // 2) only for client w/o disableTableTitle, show a breadcrumb
    const breadcrumbs = !this.props.title
      ? []
      : getBreadcrumbsFromTable(this.props.response, this.props.prefixBreadcrumbs)

    // ... except when we're displaying asGrid by default
    if (!(!lightweightTables && !this.props.asGrid && this.state.asGrid)) {
      const nRows = this.props.response.body.length
      if (!lightweightTables && breadcrumbs.length > 0 && (nRows > 1 || isWatchable(this.props.response))) {
        breadcrumbs.push({
          label: nRows === 1 ? strings('nRows1') : strings('nRows', nRows),
          className: 'kui--secondary-breadcrumb kui--nrows-breadcrumb'
        })
      }
    }

    if (breadcrumbs.length > 0) {
      return (
        <Toolbar
          className="kui--data-table-toolbar-top"
          breadcrumbs={breadcrumbs.length > 0 && breadcrumbs}
          repl={this.props.repl}
        />
      )
    }
  }

  private isPaginated() {
    return false
    /**
     * return (
     * this.props.paginate !== undefined &&
     * this.props.paginate !== false &&
     * !this.state.asGrid &&
     * (this.props.paginate === true || this.state.rows.length > this.props.paginate)
     * )
     */
  }

  private hasFooterLines() {
    return this.state.footer && this.state.footer.length > 0
  }

  private footerLines() {
    const nRows = -(this.props.response.nFooterMessages || 6)
    return this.state.footer ? this.state.footer.slice(nRows) : undefined
  }

  private static hasSequenceButton(props: Props) {
    return isTableWithTimestamp(props.response)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private bottomToolbar(lightweightTables = false) {
    const gridableColumn = findGridableColumn(this.props.response)
    const hasSequenceButton = PaginatedTable.hasSequenceButton(this.props)
    const hasTimelineButton = false // disabled for now, see https://github.com/IBM/kui/issues/5864

    const needsBottomToolbar =
      this.caption() ||
      this.isPaginated() ||
      (gridableColumn >= 0 && (this.props.response.body.length > 1 || isWatchable(this.props.response))) ||
      isTableWithTimestamp(this.props.response) ||
      isTableWithCount(this.props.response)

    return (
      <React.Fragment>
        {this.hasFooterLines() && <Toolbar stream={this.footerLines()} repl={this.props.repl} />}
        {this.props.toolbars && needsBottomToolbar && (
          <Toolbar
            className="kui--data-table-toolbar-bottom"
            repl={this.props.repl}
            asGrid={this.state.asGrid}
            gridableColumn={gridableColumn}
            setAsGrid={(asGrid: boolean) => {
              this.setState({ asGrid })
              if (asGrid) {
                this.props.response.defaultPresentation = 'grid'
              }
            }}
            paginate={this.isPaginated()}
            setPage={(page: number) => this.setState({ page })}
            page={this.state.page}
            totalItems={this.state.body.length}
            pageSize={this.state.pageSize}
            hasSequenceButton={hasSequenceButton}
            asSequence={this.state.asSequence}
            setAsSequence={(asSequence: boolean) => {
              this.setState({ asSequence })
              if (asSequence) {
                this.props.response.defaultPresentation = 'sequence-diagram'
              }
            }}
            hasTimelineButton={hasTimelineButton}
            asTimeline={this.state.asTimeline}
            caption={this.caption() || undefined}
            setAsTimeline={(asTimeline: boolean) => {
              this.setState({ asTimeline })
              if (asTimeline) {
                this.props.response.defaultPresentation = 'timeline'
              }
            }}
          />
        )}
      </React.Fragment>
    )
  }

  /** E.g. last updated time for live tables */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected caption(): ToolbarProps['caption'] | void {}

  private grid(visibleRows: KuiRow[]) {
    return (
      <Grid
        tab={this.props.tab}
        repl={this.props.repl}
        response={this.props.response}
        visibleRows={visibleRows}
        justUpdated={this.justUpdatedMap()}
      />
    )
  }

  private readonly _justUpdatedMap = {}
  private justUpdatedMap() {
    return this._justUpdatedMap
    /* FIXME return this.state.body.reduce(M => {
      if (_.justUpdated) M[_.rowKey] = true
      return M
    }, {} as Record<string, boolean>) */
  }

  private table() {
    const { tab, repl } = this.props
    const { page } = this.state

    const response = this.props.response
    const { body, header } = this.state

    const variant = 'compact'
    /* this.props.response.style === TableStyle.Heavy
      ? null
      : this.props.response.style === undefined || this.props.response.style === TableStyle.Medium
      ? null
      : 'compact' */

    const isSortable = response.body.length > 1

    const onSort = (key: string, cidx: number, clickColIdx: number, clickDir: SortByDirection) => {
      response.body.sort((a, b) => sortRow(a, b, key, cidx, clickDir))

      this.setState({
        body,
        activeSortDir: clickDir,
        activeSortIdx: clickColIdx
      })
    }

    const dataTable = (visibleRows: KuiRow[], offset = 0) => (
      <div
        className={
          'kui--data-table-container' +
          (this.props.title ? ' kui--data-table-container-with-toolbars' : '') +
          (this.props.response.title || this.props.response.breadcrumbs
            ? ' kui--data-table-container-with-title'
            : '') +
          (isSortable ? ' kui--data-table-sortable' : '')
        }
        data-is-empty={response.body.length === 0}
      >
        <TableComposable className="kui--table-like-wrapper" variant={variant} isStickyHeader gridBreakPoint="">
          {header &&
            renderHeader(
              header,
              body,
              isSortable,
              this.state.activeSortIdx,
              this.state.activeSortDir,
              onSort.bind(this)
            )}
          {renderBody(response, this.justUpdatedMap(), tab, repl, offset)}
        </TableComposable>
      </div>
    )

    const paginated = this.isPaginated()
    return dataTable(
      !paginated ? body : body.slice((page - 1) * this.state.pageSize, page * this.state.pageSize),
      !paginated ? 0 : (page - 1) * this.state.pageSize
    )
  }

  private sequence() {
    return (
      <SequenceDiagram
        {...this.props}
        isWatching={this.isWatching()}
        progressVersion={this.state.progressVersion}
        progress={this.state.progress}
      />
    )
  }

  private timeline() {
    return <Timeline {...this.props} />
  }

  /** @return whether the table is currently "live", and responding to updates from the controller */
  protected isWatching(): boolean {
    return false
  }

  private content(includeToolbars = false, lightweightTables = false) {
    return (
      <React.Fragment>
        {includeToolbars && this.topToolbar(lightweightTables)}
        {this.state.asGrid
          ? this.grid(this.state.body)
          : this.state.asSequence
          ? this.sequence()
          : this.state.asTimeline
          ? this.timeline()
          : this.table()}
        {includeToolbars && this.bottomToolbar(lightweightTables)}
      </React.Fragment>
    )
  }

  protected dataAttrs() {
    return {}
  }

  public render() {
    if (!this.state) {
      return <div className="oops">Internal Error</div>
    } else {
      const lightweightTables = this.props.response.style === TableStyle.Light
      const className =
        'kui--data-table-wrapper' +
        (this.state.asGrid ? ' kui--data-table-as-grid' : '') +
        (this.state.asSequence ? ' kui--data-table-as-sequence' : '') +
        (this.state.asTimeline ? ' kui--data-table-as-timeline' : '') +
        (lightweightTables ? ' kui--data-table-wrapper-lightweight flex-fill' : '')

      return (
        <div className={className} {...this.dataAttrs()}>
          <div className="kui--screenshotable">
            {lightweightTables ? (
              this.content(true, true)
            ) : (
              <Card
                boxShadow
                header={this.topToolbar()}
                footer={this.bottomToolbar()}
                className="kui--table-card"
                tab={this.props.tab}
              >
                {this.content()}
              </Card>
            )}
          </div>
        </div>
      )
    }
  }
}
