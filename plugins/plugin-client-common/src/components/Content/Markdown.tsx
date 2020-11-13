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
import { v4 as uuid } from 'uuid'
import { dirname, join, relative } from 'path'
import ReactMarkdown from 'react-markdown'
import { REPL, Tab as KuiTab } from '@kui-shell/core'
import {
  Link,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  OrderedList,
  UnorderedList,
  ListItem
} from 'carbon-components-react'

import CodeSnippet from '../spi/CodeSnippet'

import 'carbon-components/scss/components/link/_link.scss'
import '../../../web/scss/components/List/Carbon.scss'
import '../../../web/scss/components/StructuredList/Carbon.scss'

interface Props {
  source: string

  tab?: KuiTab
  repl?: REPL

  /** if we have the full path to the source file */
  fullpath?: string

  /** css class for top-level element */
  className?: string

  /** Do not linkify external links */
  noExternalLinks?: boolean

  /** If true, don't provide scrollability */
  nested?: boolean
}

export default class Markdown extends React.PureComponent<Props> {
  private readonly _uuid = uuid()

  private onCopy(value: string) {
    navigator.clipboard.writeText(value)
  }

  private anchorFrom(txt: string): string {
    return `${this._uuid}-${txt}`
  }

  public render() {
    return (
      <ReactMarkdown
        source={this.props.source}
        className={
          this.props.className ||
          'padding-content marked-content page-content' +
            (!this.props.nested ? ' scrollable scrollable-x scrollable-auto' : ' full-height')
        }
        renderers={{
          link: props => {
            const isLocal = !/^http/i.test(props.href)
            const target = !isLocal ? '_blank' : undefined
            const onClick = !isLocal
              ? (evt: React.MouseEvent) => evt.stopPropagation()
              : async (evt: React.MouseEvent) => {
                  evt.stopPropagation()
                  let file = props.href
                  if (props.href.startsWith('#kuiexec?command=')) {
                    const raw = props.href.match(/#kuiexec\?command=([^&]+)(&quiet)?/)
                    if (raw) {
                      const cmdline = decodeURIComponent(raw[1])
                      const echo = !raw[2]
                      return this.props.repl.pexec(cmdline, { echo })
                    }
                  } else if (props.href.charAt(0) === '#') {
                    const elt = this.props.tab.querySelector(
                      `[data-markdown-anchor="${this.anchorFrom(props.href.slice(1))}"]`
                    )
                    if (elt) {
                      return elt.scrollIntoView()
                    }
                  } else if (file) {
                    if (this.props.fullpath) {
                      const absoluteHref = join(dirname(this.props.fullpath), props.href)
                      const relativeToCWD = relative(process.cwd() || process.env.PWD, absoluteHref)
                      file = relativeToCWD
                    }

                    return this.props.repl.pexec(`open ${this.props.repl.encodeComponent(file)}`)
                  }
                }

            if (!props.href) {
              return <a className={this.props.className}>{props.children}</a>
            } else if (!isLocal && this.props.noExternalLinks) {
              return <span className={this.props.className}>{props.href}</span>
            } else {
              return <Link {...props} href={props.href} target={target} onClick={onClick} />
            }
          },
          code: props => (
            <div className="paragraph">
              <CodeSnippet value={props.value} onCopy={this.onCopy.bind(this, props.value)} />
            </div>
          ),
          heading: props => {
            const valueChild =
              props.children && props.children.length === 1
                ? props.children[0]
                : props.children.find(_ => _.props.value)
            const anchor =
              !valueChild || !valueChild.props || !valueChild.props.value
                ? undefined
                : this.anchorFrom(valueChild.props.value.toLowerCase().replace(/ /g, '-'))
            return React.createElement(
              `h${props.level}`,
              Object.assign({}, props, {
                'data-markdown-anchor': anchor,
                'data-is-href': valueChild && valueChild.props && valueChild.props.href
              }),
              props.children
            )
          },
          image: props => {
            const isLocal = !/^http/i.test(props.src)
            if (isLocal && this.props.fullpath) {
              const absoluteSrc = join(dirname(this.props.fullpath), props.src)
              const relativeToCWD = relative(process.cwd() || process.env.PWD, absoluteSrc)
              return <img src={relativeToCWD} />
            } else {
              return <img {...props} />
            }
          },
          list: props => {
            return React.createElement(
              props.ordered ? OrderedList : UnorderedList,
              { nested: props.depth > 0, className: props.className },
              props.children
            )
          },
          listItem: props => <ListItem className={props.className}>{props.children}</ListItem>,
          table: props => (
            <StructuredListWrapper className={props.className + ' kui--table-like'}>
              {props.children}
            </StructuredListWrapper>
          ),
          tableHead: props => <StructuredListHead className={props.className}>{props.children}</StructuredListHead>,
          tableBody: props => <StructuredListBody className={props.className}>{props.children}</StructuredListBody>,
          tableRow: props => (
            <StructuredListRow head={props.isHeader} className={props.className}>
              {props.children}
            </StructuredListRow>
          ),
          tableCell: props => (
            <StructuredListCell head={props.isHeader} className={props.className}>
              {props.children}
            </StructuredListCell>
          )
        }}
      />
    )
  }
}
