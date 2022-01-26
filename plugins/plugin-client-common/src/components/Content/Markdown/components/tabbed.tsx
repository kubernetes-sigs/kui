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

/* eslint-disable react/prop-types, react/display-name */

import React from 'react'
import Slugger from 'github-slugger'
import { EventEmitter } from 'events'
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core'

import Card from '../../../spi/Card'

type Props = {
  depth: number
  children: {
    props: { title: string; children?: React.ReactNode[] }
  }[]
}

type State = {
  activeKey: number
}

const activateEvents = new EventEmitter()
export function activateTab(slug: string, evt?: React.MouseEvent) {
  activateEvents.emit(slug, evt)
}

class LinkableTabs extends React.PureComponent<Props, State> {
  private readonly slugs = new Slugger()
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props) {
    super(props)
    this.state = {
      activeKey: 0
    }

    this.initEvents()
  }

  private initEvents() {
    ;(this.props.children || [])
      .map(_ => this.slugs.slug(_.props.title))
      .forEach((slug, activeKey) => {
        const onActivate = (evt?: React.MouseEvent) => {
          this.setState({ activeKey })

          if (evt) {
            // prevent default interpretation of onClick for the href
            evt.preventDefault()
          }
        }
        activateEvents.on(slug, onActivate)
        this.cleaners.push(() => activateEvents.off(`/markdown/tabs/activate/${slug}`, onActivate))
      })
  }

  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())
  }

  private readonly onSelect = (_, tabIndex: number) => {
    this.setState({
      activeKey: tabIndex
    })
  }

  public render() {
    return this.asTabs()
  }

  /** Render as a Tabs UI */
  private asTabs() {
    return (
      <Tabs
        className="kui--markdown-tabs paragraph"
        activeKey={this.state.activeKey}
        onSelect={this.onSelect}
        mountOnEnter
        unmountOnExit
        data-depth={this.props.depth}
      >
        {(this.props.children || []).map((_, idx) => (
          <Tab
            key={idx}
            eventKey={idx}
            data-depth={this.props.depth}
            data-title={_.props.title}
            className="kui--markdown-tab"
            title={<TabTitleText>{_.props.title}</TabTitleText>}
          >
            <Card className="kui--markdown-tab-card">
              <React.Fragment>{_.props && _.props.children}</React.Fragment>
            </Card>
          </Tab>
        ))}
      </Tabs>
    )

    // re: the <React.Fragment> wrapper around props.children; this is
    // to avoid Card's PatternFly impl creating a separate Markdown
    // component for every child. We know here that all of the children are part
    // of the same contiguous stretch of text.
  }
}

export default function tabbed(props) {
  // isSecondary={parseInt(props.depth, 10) > 0}
  return <LinkableTabs depth={props.depth}>{props.children}</LinkableTabs>
}
