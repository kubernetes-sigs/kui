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

import React from 'react'

import { i18n, eventBus, DiffState, TreeItem } from '@kui-shell/core'
import { TreeView, TreeViewDataItem } from '@patternfly/react-core'
import { Props } from '../'
import Tag from '../../../spi/Tag/impl/PatternFly'
import Events from '../../../Content/Events'

import '../../../../../web/scss/components/Tree/index.scss'

interface State {
  activeItem: TreeItem
}

const strings = i18n('plugin-client-common')

export default class KuiTreeView extends React.PureComponent<Props, State> {
  public constructor(props) {
    super(props)

    this.state = {
      activeItem: this.props.data[0]
    }
  }

  public static getDerivedStateFromProps(props: Props, state: State) {
    if (props.toolbarText) {
      props.willUpdateToolbar(props.toolbarText)
    }
    return state
  }

  private diffTag(item: TreeItem) {
    if (!item.children && item.diff !== undefined && item.diff !== DiffState.UNCHANGED && item.diffBadge) {
      const getCss = (state: DiffState) => {
        if (state === DiffState.ADDED) {
          return 'green-background'
        } else if (state === DiffState.DELETED) {
          return 'red-background'
        } else if (state === DiffState.CHANGED) {
          return 'yellow-background'
        } else {
          return ''
        }
      }
      return <Tag className={getCss(item.diff)}>{item.diffBadge}</Tag>
    }
  }

  private kuiTreeItemsToView(kuiTreeItems: TreeItem[]) {
    const getModificationFromNodes = (treeItem: TreeItem[], isLeafNode?: boolean) => {
      const totalNum = treeItem.length

      const record = [0, 0, 0, 0]
      treeItem.forEach(({ diff }) => {
        if (diff === DiffState.ADDED) {
          record[DiffState.ADDED]++
        } else if (diff === DiffState.DELETED) {
          record[DiffState.DELETED]++
        } else if (diff === DiffState.CHANGED) {
          record[DiffState.CHANGED]++
        } else {
          record[DiffState.UNCHANGED]++
        }
      })

      const getText = () => {
        if (!record[DiffState.ADDED] && !record[DiffState.DELETED] && !record[DiffState.CHANGED]) {
          return totalNum.toString()
        } else {
          const nodes = record
            .map((num, idx) => {
              if (num !== 0) {
                if (idx === DiffState.ADDED) {
                  return strings('n new', num.toString())
                } else if (idx === DiffState.DELETED) {
                  return strings('n deleted', num.toString())
                } else if (idx === DiffState.CHANGED) {
                  return strings('n changed', num.toString())
                }
              }
            })
            .filter(_ => _)

          if (nodes.length !== 0) {
            const text = nodes.join(', ')
            if (isLeafNode) {
              return text.replace(`${totalNum} `, '')
            } else {
              if (nodes.length > 1) {
                return `${totalNum.toString()} ( ${text} )`
              } else {
                return text
              }
            }
          }
        }
      }

      const getTotalModification = () => {
        if (!record[DiffState.ADDED] && !record[DiffState.DELETED] && !record[DiffState.CHANGED]) {
          return DiffState.UNCHANGED
        } else if (record[DiffState.ADDED] && !record[DiffState.DELETED] && !record[DiffState.CHANGED]) {
          return DiffState.ADDED
        } else if (record[DiffState.DELETED] && !record[DiffState.ADDED] && !record[DiffState.CHANGED]) {
          return DiffState.DELETED
        } else if (record[DiffState.CHANGED] && !record[DiffState.ADDED] && !record[DiffState.DELETED]) {
          return DiffState.CHANGED
        } else {
          return DiffState.CHANGED
        }
      }

      const totalModification = getTotalModification()

      return { text: getText(), diff: totalModification }
    }

    const prepTree = (items: TreeItem[]) => {
      return items.map(item => {
        if (item.children) {
          const children = prepTree(item.children)
          const { text, diff } = getModificationFromNodes(children)
          item.diffBadge = text
          item.diff = diff
          return item
        } else {
          const { text, diff } = getModificationFromNodes([item], true)
          item.diffBadge = text
          item.diff = diff
          return item
        }
      })
    }

    const kuiTreeItemToView = (item: TreeItem): TreeViewDataItem => {
      return Object.assign({}, item, {
        action:
          !item.children &&
          item.diff !== undefined &&
          item.diff !== DiffState.UNCHANGED &&
          item.diffBadge &&
          this.diffTag(item),
        checkProps: item.hasBadge && item.diffBadge ? { isRead: true, 'data-badge': item.diffBadge } : {},
        content: undefined,
        modifiedContent: undefined
      })
    }

    const prep = prepTree(kuiTreeItems)
    return prep.map(kuiTreeItem => {
      const treeViewDataItem = kuiTreeItemToView(kuiTreeItem)
      if (kuiTreeItem.children) {
        treeViewDataItem.children = this.kuiTreeItemsToView(kuiTreeItem.children)
      }
      return treeViewDataItem
    })
  }

  private tree() {
    const data = this.kuiTreeItemsToView(this.props.data)
    return (
      <TreeView
        data={data}
        activeItems={[this.state.activeItem]}
        onSelect={(_, treeViewItem) => {
          const item = treeViewItem as TreeItem
          if (item.onclickEvents) {
            console.error('throwing events', item)
            eventBus.emitCommandStart(item.onclickEvents.startEvent)
            eventBus.emitCommandComplete(item.onclickEvents.completeEvent)
          } else if (item.onclick) {
            console.error('executing command', item)
            this.props.tab.REPL.pexec(item.onclick, item.onclickOptions)
          }
          this.setState({ activeItem: item })
        }}
      />
    )
  }

  private events() {
    if (this.state.activeItem.eventArgs) {
      const { command, schema } = this.state.activeItem.eventArgs

      return (
        <Events
          tab={this.props.tab}
          command={command}
          schema={schema}
          involvedObjects={this.state.activeItem.extends}
        />
      )
    }
  }

  /**
   * NOTE: Patternfly TreeView hardcodes the badge content to be the number of nodes
   * This is a hack to set the badge content to be a customized one
   * We should remove this once this issue is fixed: https://github.com/IBM/kui/issues/6328
   *
   */
  private customizeBadgeContent() {
    try {
      const allBadges = document.querySelectorAll(
        `.repl-block[data-uuid="${this.props.execUUID}"][data-scrollback-uuid="${this.props.tab.uuid}"] .pf-c-tree-view__node-count .pf-c-badge`
      )
      allBadges.forEach(_ => {
        const badge = _ as HTMLElement
        const text = badge.getAttribute('data-badge')
        if (text) {
          badge.innerText = text
        }
      })
    } catch (err) {
      console.error('failed to customize the badge', err)
    }
  }

  public componentDidUpdate() {
    this.customizeBadgeContent()
  }

  public componentDidMount() {
    this.customizeBadgeContent()
  }

  public render() {
    return (
      <div className="kui--tree kui--full-height">
        <div className="kui--tree-nav-and-body kui--full-height kui--rows">{this.tree()}</div>
        {this.events()}
      </div>
    )
  }
}
