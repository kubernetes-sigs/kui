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
import TurndownService from 'turndown'
import ReactMarkdown from 'react-markdown'
import { dirname, isAbsolute, join, relative } from 'path'
import { List, ListComponent, ListItem } from '@patternfly/react-core'
import { REPL, Tab as KuiTab, getPrimaryTabId } from '@kui-shell/core'

// GitHub Flavored Markdown plugin; see https://github.com/IBM/kui/issues/6563
import gfm from 'remark-gfm'

import CodeSnippet from '../spi/CodeSnippet'
const SimpleEditor = React.lazy(() => import('./Editor/SimpleEditor'))

interface Props {
  source: string
  contentType?: 'text/html' | 'application/markdown'

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

  /** @return markdown source, as string in application/markdown format */
  private source() {
    if (this.props.contentType === 'text/html') {
      return new TurndownService().turndown(this.props.source)
    } else {
      return this.props.source
    }
  }

  private handleImage(
    src: string,
    props: { width?: number | string; height?: number | string; align?: React.CSSProperties['float'] },
    key?: string
  ) {
    const isLocal = !/^http/i.test(src)
    if (isLocal && this.props.fullpath) {
      const absoluteSrc = isAbsolute(src) ? src : join(dirname(this.props.fullpath), src)
      src = absoluteSrc
    }

    const style = props ? { float: props.align } : undefined
    return <img key={key} src={src} height={props.height} width={props.width} style={style} data-float={props.align} />
  }

  public render() {
    return (
      <ReactMarkdown
        plugins={[gfm]}
        source={this.source()}
        className={
          this.props.className ||
          'padding-content marked-content page-content' +
            (!this.props.nested ? ' scrollable scrollable-x scrollable-auto' : ' full-height')
        }
        renderers={{
          html: props => {
            if (/<img/.test(props.value)) {
              const images = props.value.split(/<img/).filter(_ => _)
              const imageTags = images
                .map((value, idx) => {
                  const srcMatch = value.match(/src="?([^"\s]+)"?/)
                  const heightMatch = value.match(/height="?(\d+)"?/)
                  const widthMatch = value.match(/width="?(\d+%?)"?/)
                  const alignMatch = value.match(/align="?([^"\s]+)"?/)
                  if (srcMatch) {
                    return this.handleImage(
                      srcMatch[1],
                      {
                        height: heightMatch && heightMatch[1],
                        width: widthMatch && widthMatch[1],
                        align: alignMatch && alignMatch[1]
                      },
                      idx
                    )
                  }
                })
                .filter(_ => _)
              return <React.Fragment>{imageTags}</React.Fragment>
            }

            // Render the raw string for all other raw html tags
            return <span>{props.value}</span>
          },

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
              return <a className="bx--link" {...props} target={target} onClick={onClick} />
            }
          },
          code: props => {
            if (this.props.nested) {
              return (
                <div className="paragraph">
                  <CodeSnippet value={props.value} onCopy={this.onCopy.bind(this, props.value)} />
                </div>
              )
            } else {
              return (
                <div className="paragraph">
                  <code className="kui--code--editor">
                    <SimpleEditor
                      tabUUID={getPrimaryTabId(this.props.tab)}
                      content={props.value as string}
                      contentType={props.language}
                      fontSize={12}
                      simple
                      minHeight={0}
                      readonly
                    />
                  </code>
                </div>
              )
            }
          },
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
            return this.handleImage(props.src, props) || <img {...props} />
          },
          list: props => {
            return <List component={props.ordered ? ListComponent.ol : ListComponent.ul}>{props.children}</List>
          },
          listItem: props => <ListItem className={props.className}>{props.children}</ListItem>,
          table: props => (
            <table className={props.className + ' kui--table-like kui--structured-list'}>{props.children}</table>
          ),
          tableHead: props => (
            <thead className={props.className + ' kui--structured-list-thead'}>{props.children}</thead>
          ),
          tableBody: props => (
            <tbody className={props.className + ' kui--structured-list-tbody'}>{props.children}</tbody>
          ),
          tableRow: props => <tr {...props} />,
          tableCell: props => React.createElement(props.isHeader ? 'th' : 'td', props)
        }}
      />
    )
  }
}
