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

import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListDescription,
  DescriptionListTerm
} from '@patternfly/react-core'

import { StatusModelItem, StatusModelStatus } from '@kui-shell/core'

import Icons from '../../spi/Icons'
import Markdown from '../../Content/Markdown'

import icons from './icons'

type Props = {
  items: StatusModelItem[]
}

import '../../../../web/scss/components/Sidebar/_index.scss'
import '../../../../web/scss/components/DescriptionList/PatternFly.scss'

type ItemProps = StatusModelItem

interface ItemState {
  status: StatusModelStatus
}

class Item extends React.PureComponent<ItemProps, ItemState> {
  public constructor(props: ItemProps) {
    super(props)
    this.state = Item.getDerivedStateFromProps(props)
  }

  public static getDerivedStateFromProps(props: ItemProps, state?: ItemState) {
    if (!state) {
      return {
        status: 'unknown' as const
      }
    } else {
      return state
    }
  }

  public componentDidMount() {
    if (this.state.status === 'unknown' && typeof this.props.status !== 'string') {
      setTimeout(async () => {
        if (typeof this.props.status !== 'string') {
          const status = await this.props.status()
          this.setState({ status })
        }
      })
    }
  }

  /** Icon for tile with given status */
  private icon() {
    const { icon, className } = typeof this.state.status === 'string' ? icons[this.state.status] : icons['in-progress']
    return <Icons icon={icon} className={className} />
  }

  public render() {
    return (
      <DescriptionListGroup className="kui--sidebar-items-group" key={this.props.title}>
        <DescriptionListTerm>
          {this.icon()} <span className="break-all">{this.props.title}</span>
        </DescriptionListTerm>

        <DescriptionListDescription>
          <Markdown source={this.props.description} />
        </DescriptionListDescription>
      </DescriptionListGroup>
    )
  }
}

export default class StatusItems extends React.PureComponent<Props> {
  public render() {
    return (
      <DescriptionList isAutoFit isCompact className="kui--sidebar-items">
        {this.props.items.map(_ => (
          <Item key={_.title} {..._} />
        ))}
      </DescriptionList>
    )
  }
}
