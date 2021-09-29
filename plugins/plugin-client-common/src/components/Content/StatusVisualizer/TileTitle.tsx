/*
 * Copyright 2021 The Kubernetes Authors
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

import { StatusModelSection, StatusModelTileAction, StatusModelTile, StatusModelItem } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import Popover from '../../spi/Popover'
import Button, { Props as ButtonProps } from '../../spi/Button'

import Items from './Items'

interface TileTitleProps {
  section: StatusModelSection
  tile: StatusModelTile
}

interface TileTitleState {
  items: StatusModelItem[]
  visibleActions: (Pick<StatusModelTileAction, 'label'> & Pick<ButtonProps, 'onClick'>)[]
}

export default class TileTitle extends React.PureComponent<TileTitleProps, TileTitleState> {
  public constructor(props: TileTitleProps) {
    super(props)
    this.state = {
      items: props.tile.items,
      visibleActions: undefined
    }
  }

  private computeActionVisibility(items = this.props.tile.items) {
    return Promise.all(this.props.tile.actions.map(action => action.isVisible(items)))
  }

  private async computeVisibleActions(items = this.props.tile.items) {
    const actionVisibility = await this.computeActionVisibility(items)

    return actionVisibility
      .map(
        (isVisible, idx) =>
          isVisible && {
            label: this.props.tile.actions[idx].label,
            onClick: async () => {
              const items = await this.props.tile.actions[idx].onClick(this.state.items)
              const visibleActions = await this.computeVisibleActions(items)

              this.setState({
                items,
                visibleActions
              })
            }
          }
      )
      .filter(Boolean)
  }

  public componentDidMount() {
    if (this.state.visibleActions === undefined && this.props.tile.actions && this.props.tile.actions.length > 0) {
      setTimeout(async () => {
        const visibleActions = await this.computeVisibleActions()
        this.setState({ visibleActions })
      })
    }
  }

  private actions() {
    if (this.state.visibleActions && this.state.visibleActions.length > 0) {
      return (
        <React.Fragment>
          {this.state.visibleActions.map(({ label, onClick }) => (
            <Button key={label} onClick={onClick}>
              {label}
            </Button>
          ))}
        </React.Fragment>
      )
    }
  }

  public render() {
    const title =
      this.props.section.title === 'Other'
        ? this.props.tile.title
        : `${this.props.section.title} ${this.props.tile.title}`

    return (
      <strong>
        {title}
        <Popover headerContent={title} bodyContent={<Items items={this.state.items} />} footerContent={this.actions()}>
          <Icons icon="Info" className="sub-text small-left-pad clickable" />
        </Popover>
      </strong>
    )
  }
}
