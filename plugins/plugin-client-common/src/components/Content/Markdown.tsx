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

import React from 'react'
import { v4 as uuid } from 'uuid'
import TurndownService from 'turndown'
import { HeadingProps, OrderedListProps, UnorderedListProps } from 'react-markdown/lib/ast-to-react'
import { dirname, isAbsolute, join, relative } from 'path'
import { Text, TextContent, TextVariants, List, ListComponent, ListItem } from '@patternfly/react-core'
import { maybeKuiLink, REPL, Tab as KuiTab, getPrimaryTabId, pexecInCurrentTab } from '@kui-shell/core'
import {
  ProgressStepper,
  ProgressStepperProps,
  ProgressStep,
  ProgressStepCompatible,
  isProgressStepCompatible,
  liveStatusChannel
} from './ProgressStepper'

import { Options } from 'react-markdown'
const ReactMarkdown = React.lazy(() => import('react-markdown'))

// GitHub Flavored Markdown plugin; see https://github.com/IBM/kui/issues/6563
import gfm from 'remark-gfm'

// react-markdown v6+ now require use of these to support html
import rehypeRaw from 'rehype-raw'
// import _rehypeSanitize, { Options as RHSOptions } from 'rehype-sanitize'
// const rhsOptions: RHSOptions = { attributes: { '*': ['className'] } }
// const rehypeSanitize: Options['rehypePlugins'][0] = [_rehypeSanitize, rhsOptions]
const rehypePlugins: Options['rehypePlugins'] = [rehypeRaw /*, rehypeSanitize */]

const Tooltip = React.lazy(() => import('../spi/Tooltip'))
const CodeSnippet = React.lazy(() => import('../spi/CodeSnippet'))
const SimpleEditor = React.lazy(() => import('./Editor/SimpleEditor'))
const LinkStatus = React.lazy(() => import('./LinkStatus'))
const Hint = React.lazy(() => import('../spi/Hint'))

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

  /** Base HTTP Url? */
  baseUrl?: string

  onRender?: () => void
}

function decodeURI(uri: string) {
  try {
    return decodeURIComponent(uri)
  } catch (err) {
    return uri
  }
}

export default class Markdown extends React.PureComponent<Props> {
  private readonly _uuid = uuid()

  private allContentIsRemote(): boolean {
    return typeof this.props.baseUrl === 'string'
  }

  private anchorFrom(txt: string): string {
    return `${this._uuid}-${txt}`
  }

  /** @return markdown source, as string in application/markdown format */
  private source() {
    if (this.props.contentType === 'text/html') {
      const { gfm } = require('turndown-plugin-gfm')
      const td = new TurndownService()
      td.use(gfm)
      return td.turndown(this.props.source)
    } else {
      return this.props.source
    }
  }

  private list(props: OrderedListProps | UnorderedListProps) {
    if (Array.isArray(props.children) && props.children.length > 0) {
      const lastIncompatibleIdx = props.children.findIndex(_ => {
        if (_ === '\n') {
          // react-markdown v7 seems to add newlines between list items. weird
          return false // compatible
        } else if (typeof _ === 'object' && isProgressStepCompatible(_['props'])) {
          // this is a true ProgressStep, created in the <a> handler below
          return false // compatible
        } else {
          return true // incompatible with ProgressStepper component
        }
      })
      if (lastIncompatibleIdx === -1) {
        return (
          <ProgressStepper layout={props.ordered ? 'horizontal' : 'vertical'}>
            {props.children as ProgressStepperProps['children']}
          </ProgressStepper>
        )
      } else if (lastIncompatibleIdx >= 0) {
        return (
          <React.Fragment>
            <ProgressStepper layout={props.ordered ? 'horizontal' : 'vertical'}>
              {props.children.slice(0, lastIncompatibleIdx) as ProgressStepperProps['children']}
            </ProgressStepper>
            <List isBordered component={props.ordered ? ListComponent.ol : ListComponent.ul}>
              {props.children.slice(lastIncompatibleIdx)}
            </List>
          </React.Fragment>
        )
      }
    }
    return (
      <List isBordered component={props.ordered ? ListComponent.ol : ListComponent.ul}>
        {props.children}
      </List>
    )
  }

  private heading(props: HeadingProps) {
    /* const valueChild =
      props.children && props.children.length === 1
      ? props.children[0]
      : props.children.find(_ => _.props.value)
    const anchor =
      !valueChild || !valueChild.props || !valueChild.props.value
      ? undefined
      : this.anchorFrom(valueChild.props.value.toLowerCase().replace(/ /g, '-'))
    return (
        <Text
      component={TextVariants['h' + props.level]}
      {...props}
      data-markdown-anchor={anchor}
      data-is-href={valueChild && valueChild.props && valueChild.props.href}
        />
        ) */
    return <Text component={TextVariants['h' + props.level]}>{props.children}</Text>
  }

  private handleImage(
    src: string,
    props: { width?: number | string; height?: number | string; align?: React.CSSProperties['float'] },
    key?: string
  ) {
    const isHttp = /^http/i.test(src)
    const isLocal = !isHttp && !this.allContentIsRemote()
    if (isLocal) {
      const absoluteSrc = isAbsolute(src)
        ? src
        : join(this.props.fullpath ? dirname(this.props.fullpath) : this.props.baseUrl || process.cwd(), src)
      src = absoluteSrc
    } else if (!isHttp && this.props.baseUrl) {
      // then this is a relative path against
      src = `${this.props.baseUrl}${!/\/$/.test(this.props.baseUrl) ? '/' : ''}${src}`
    }

    const style = props ? { float: props.align } : undefined
    return <img key={key} src={src} height={props.height} width={props.width} style={style} data-float={props.align} />
  }

  public render() {
    if (this.props.onRender) {
      this.props.onRender()
    }

    return (
      <React.Suspense fallback={<div />}>
        <TextContent>
          <ReactMarkdown
            plugins={[gfm]}
            rehypePlugins={rehypePlugins}
            data-is-nested={this.props.nested || undefined}
            className={
              this.props.className ||
              'padding-content marked-content page-content' +
                (!this.props.nested ? ' scrollable scrollable-x scrollable-auto' : '')
            }
            components={{
              a: props => {
                const isKuiCommand = props.href.startsWith('#kuiexec?command=')
                const isLocal = !/^http/i.test(props.href)
                const target = !isLocal ? '_blank' : undefined
                console.error('!!!!!!!!!AAA', props, isKuiCommand)
                const onClick =
                  !isLocal && !isKuiCommand
                    ? (evt: React.MouseEvent) => evt.stopPropagation()
                    : async (evt: React.MouseEvent) => {
                        evt.stopPropagation()
                        let file = props.href
                        if (isKuiCommand) {
                          const raw = props.href.match(/#kuiexec\?command=([^&]+)(&quiet)?/)
                          if (raw) {
                            const cmdline = decodeURI(raw[1])
                            const echo = !raw[2]
                            if (this.props.repl) {
                              return this.props.repl.pexec(cmdline, { echo })
                            } else {
                              pexecInCurrentTab(cmdline, undefined, !echo)
                            }
                          }
                        } else if (props.href.charAt(0) === '#') {
                          if (this.props.tab) {
                            const elt = this.props.tab.querySelector(
                              `[data-markdown-anchor="${this.anchorFrom(props.href.slice(1))}"]`
                            )
                            if (elt) {
                              return elt.scrollIntoView()
                            }
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
                  const isKuiBlockLink = props.href.startsWith('#kui-link-')
                  const tip = isKuiCommand
                    ? `### Command Execution\n#### ${decodeURI(props.href.slice(props.href.indexOf('=') + 1)).replace(
                        '&quiet',
                        ''
                      )}\n\n\`Link will execute a command\``
                    : isKuiBlockLink
                    ? `### Block Link\n\n\`Link will scroll the block into view\``
                    : `### External Link\n#### ${props.href}\n\n\`Link will open in a separate window\``

                  const kuiLink = maybeKuiLink(props.href)

                  if (kuiLink) {
                    props.children.push(<LinkStatus key="link-status" link={kuiLink} />)
                  }
                  console.error('!!!!!!!!!', props.href, isKuiCommand, isKuiBlockLink, kuiLink)

                  return (
                    <Tooltip markdown={tip}>
                      <a
                        title={props.title}
                        href={isKuiCommand ? '#' : props.href}
                        target={target}
                        onClick={onClick}
                        className={kuiLink ? 'kui--link-status' : ''}
                      >
                        {props.children}
                      </a>
                    </Tooltip>
                  )
                }
              },
              blockquote: props => {
                // avoid <p>: invalid dom nesting of p inside of p
                return (
                  <span className="paragraph">
                    <Hint>{props.children}</Hint>
                  </span>
                )
              },
              code: props => {
                if (props.inline) {
                  return <code className={props.className}>{props.children}</code>
                }

                const match = /language-(\w+)/.exec(props.className || '')
                const language = match ? match[1] : undefined

                if (this.props.nested) {
                  return (
                    <div className="paragraph">
                      <CodeSnippet value={String(props.children)} language={language} />
                    </div>
                  )
                } else {
                  return (
                    <div className="paragraph">
                      <code className="kui--code--editor">
                        <SimpleEditor
                          tabUUID={getPrimaryTabId(this.props.tab)}
                          content={String(props.children)}
                          contentType={language}
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
              p: props => <Text component={TextVariants.p} {...props} />,
              h1: this.heading,
              h2: this.heading,
              h3: this.heading,
              h4: this.heading,
              h5: this.heading,
              h6: this.heading,
              img: props => this.handleImage(props.src, props) || <img {...props} />,
              ol: this.list,
              ul: this.list,
              li: props => {
                if (isProgressStepCompatible(props)) {
                  return (
                    <ProgressStep
                      className={props.className}
                      title={props.children[0]}
                      liveStatusChannel={liveStatusChannel(props)}
                      defaultStatus={(props as ProgressStepCompatible).children[2].props.children[0]}
                    >
                      {props.children.slice(3)}
                    </ProgressStep>
                  )
                } else {
                  return <ListItem className={props.className}>{props.children}</ListItem>
                }
              },
              table: props => (
                <table className={props.className + ' kui--table-like kui--structured-list'}>{props.children}</table>
              ),
              thead: props => (
                <thead className={props.className + ' kui--structured-list-thead'}>{props.children}</thead>
              ),
              tbody: props => (
                <tbody className={props.className + ' kui--structured-list-tbody'}>{props.children}</tbody>
              )
              /* tr: props => <tr>{props.children}</tr>, // TODO ignoring columnAlignment
              td: props => <td>{props.children}</td>,
              th: props => <th style={props.style}>{props.children}</th> */
            }}
          >
            {this.source()}
          </ReactMarkdown>
        </TextContent>
      </React.Suspense>
    )
  }
}
