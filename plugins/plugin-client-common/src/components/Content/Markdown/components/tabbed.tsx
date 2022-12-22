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
import { Choices } from 'madwizard'
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core/dist/esm/components/Tabs'

import Card from '../../../spi/Card'

import isElementWithProperties from '../isElement'

type Props = Choices.Choices & {
  /** markdown document id */
  uuid: string

  /** tab nesting depth */
  depth: number

  /** id for this tab group */
  'data-kui-choice-group': string

  /** the tab models */
  tabs: {
    props: { title: string; 'data-kui-tab-index': string; children?: React.ReactNode[] }
  }[]
}

type State = {
  activeKey: number
  previousActiveKey: number
}

const activateEvents = new EventEmitter()
export function activateTab(slug: string, evt?: React.MouseEvent) {
  activateEvents.emit(slug, evt)
}

const switchEvents = new EventEmitter()
export function onTabSwitch(uuid: string, cb: (group: string, newTabId: string) => void) {
  switchEvents.on(uuid, cb)
}
export function offTabSwitch(uuid: string, cb: (group: string, newTabId: string) => void) {
  switchEvents.off(uuid, cb)
}
function emitTabSwitch(uuid: string, group: string, member: string) {
  switchEvents.emit(uuid, group, member)
}

export type CurrentMarkdownTabProps = State
export const CurrentMarkdownTab = React.createContext<CurrentMarkdownTabProps>({
  activeKey: 0,
  previousActiveKey: undefined
})

export class LinkableTabs extends React.PureComponent<Props, State> {
  private readonly slugs = new Slugger()
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props) {
    super(props)
    this.state = {
      activeKey: LinkableTabs.findActiveKey(props),
      previousActiveKey: undefined
    }
  }

  private static findActiveKey(props: Props) {
    const activeTitle = props.choices.getKey(LinkableTabs.group(props))
    const idx = LinkableTabs.findTabIndex(props, activeTitle)
    return idx < 0 ? 0 : idx
  }

  private static findTabIndex(props: Props, title: string) {
    // Note the case-insensitive comparison
    return props.tabs.findIndex(_ => _.props.title.localeCompare(title, undefined, { sensitivity: 'accent' }) === 0)
  }

  private initEvents() {
    ;(this.props.tabs || [])
      .map(_ => this.slugs.slug(_.props.title))
      .forEach((slug, activeKey) => {
        const onActivate = (evt?: React.MouseEvent) => {
          this.setState(curState => ({ activeKey, previousActiveKey: curState.activeKey }))

          if (evt) {
            // prevent default interpretation of onClick for the href
            evt.preventDefault()
          }
        }
        activateEvents.on(slug, onActivate)
        this.cleaners.push(() => activateEvents.off(`/markdown/tabs/activate/${slug}`, onActivate))
      })
  }

  public componentDidMount() {
    this.initEvents()
  }

  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())
  }

  private static group(props: Props) {
    return props['data-kui-choice-group']
  }

  private member(tab: Props['tabs'][0]): string {
    return tab.props['data-kui-tab-index']
  }

  private readonly onSelect = (_, tabIndex: number) => {
    const selectedTab = this.props.tabs[tabIndex]
    emitTabSwitch(this.props.uuid, LinkableTabs.group(this.props), this.member(selectedTab))
    // props.choices.set(LinkableTabs.group(this.props), selectedTab.props.title)

    this.setState(curState => ({
      activeKey: tabIndex,
      previousActiveKey: curState.activeKey
    }))
  }

  public render() {
    return this.asTabs()
  }

  private get isSecondary() {
    return this.props.depth > 0
  }

  /** Render as a Tabs UI */
  private asTabs() {
    return (
      <Tabs
        className="kui--markdown-tabs paragraph"
        activeKey={this.state.activeKey}
        onSelect={this.onSelect}
        mountOnEnter
        data-depth={this.props.depth}
        isSecondary={this.isSecondary}
      >
        {(this.props.tabs || []).map((_, idx) => (
          <Tab
            key={idx}
            eventKey={idx}
            data-depth={this.props.depth}
            data-title={_.props.title}
            className="kui--markdown-tab"
            title={<TabTitleText>{_.props.title}</TabTitleText>}
          >
            <Card className="kui--markdown-tab-card">
              <CurrentMarkdownTab.Provider value={this.state}>
                {_.props && _.props.children}
              </CurrentMarkdownTab.Provider>
            </Card>
          </Tab>
        ))}
      </Tabs>
    )

    // re: the <React.Fragment> wrapper around props.tabs; this is
    // to avoid Card's PatternFly impl creating a separate Markdown
    // component for every child. We know here that all of the children are part
    // of the same contiguous stretch of text.
  }
}

export interface TabProps {
  depth: string
  'data-kui-choice-group': string
  children: any
}

export function getTabsDepth(props: TabProps) {
  return typeof props.depth === 'number' ? props.depth : parseInt(props.depth.toString(), 10)
}

export function getTabTitle(child: TabProps['children'][number]) {
  return (isElementWithProperties(child) && child.properties.title) || ''
}

export function isTabs(props: Partial<TabProps>): props is Required<TabProps> {
  return typeof props['data-kui-choice-group'] === 'string'
}

export default function tabbedWrapper(uuid: string, choices: Choices.ChoiceState) {
  return function tabbed(props: TabProps) {
    // isSecondary={parseInt(props.depth, 10) > 0}
    return (
      <LinkableTabs
        uuid={uuid}
        choices={choices}
        depth={parseInt(props.depth, 10)}
        data-kui-choice-group={props['data-kui-choice-group']}
        tabs={props.children}
      />
    )
  }
}
