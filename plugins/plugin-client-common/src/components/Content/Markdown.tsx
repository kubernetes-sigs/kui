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
import {
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
  TextVariants,
  List,
  ListComponent,
  ListItem
} from '@patternfly/react-core'
import { maybeKuiLink, REPL, Tab as KuiTab, getPrimaryTabId, pexecInCurrentTab } from '@kui-shell/core'
import {
  ProgressStepper,
  ProgressStepperProps,
  ProgressStep,
  ProgressStepCompatible,
  isProgressStepCompatible,
  liveStatusChannel
} from './ProgressStepper'

import { Components, Options } from 'react-markdown'
const ReactMarkdown = React.lazy(() => import('react-markdown'))

const Card = React.lazy(() => import('../spi/Card'))
const ExpandableSection = React.lazy(() => import('../spi/ExpandableSection'))

// GitHub Flavored Markdown plugin; see https://github.com/IBM/kui/issues/6563
import gfm from 'remark-gfm'

import emojis from 'remark-emoji'
import frontmatter from 'remark-frontmatter'

import tip, { hackTipIndentation } from './remark-tip'
import tabbed, { hackTabIndentation } from './remark-tabbed'

// react-markdown v6+ now require use of these to support html
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
const rehypePlugins: Options['rehypePlugins'] = [tabbed, tip, rehypeRaw, rehypeSlug]

const Hint = React.lazy(() => import('../spi/Hint'))
const Tooltip = React.lazy(() => import('../spi/Tooltip'))
const LinkStatus = React.lazy(() => import('./LinkStatus'))
const SimpleEditor = React.lazy(() => import('./Editor/SimpleEditor'))
const Input = React.lazy(() => import('../Views/Terminal/Block/Inputv2'))

interface Props {
  source: string
  contentType?: 'text/html' | 'application/markdown'

  tab?: KuiTab
  tabUUID?: string
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
      return hackTipIndentation(hackTabIndentation(this.props.source))
    }
  }

  private list(props: OrderedListProps | UnorderedListProps) {
    if (Array.isArray(props.children) && props.children.length > 0) {
      // react-markdown v7 seems to add newlines between list items. weird
      const children = props.children.filter(_ => _ !== '\n')

      const lastIncompatibleIdx = children.findIndex(_ => {
        if (typeof _ === 'object' && isProgressStepCompatible(_['props'])) {
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
            {lastIncompatibleIdx > 0 && (
              <ProgressStepper layout={props.ordered ? 'horizontal' : 'vertical'}>
                {props.children.slice(0, lastIncompatibleIdx) as ProgressStepperProps['children']}
              </ProgressStepper>
            )}
            <List start={props['start']} component={props.ordered ? ListComponent.ol : ListComponent.ul}>
              {props.children.slice(lastIncompatibleIdx)}
            </List>
          </React.Fragment>
        )
      }
    }
    return (
      <List start={props['start']} component={props.ordered ? ListComponent.ol : ListComponent.ul}>
        {props.children}
      </List>
    )
  }

  private _heading(props: HeadingProps) {
    const valueChild =
      props.children && props.children.length === 1
        ? props.children[0]
        : props.children.find(_ => typeof _ === 'string')
    const anchor =
      !valueChild || typeof valueChild !== 'string'
        ? undefined
        : this.anchorFrom(valueChild.toLowerCase().replace(/ /g, '-'))
    return (
      <Text id={props.id} component={TextVariants['h' + props.level]} data-markdown-anchor={anchor}>
        {props.children}
      </Text>
    )
  }

  private readonly heading = this._heading.bind(this)

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

  private tipProps(expanded: boolean) {
    return { isWidthLimited: true, expanded }
  }

  private readonly components: Components = {
    /** remark-collapse support; this is Expandable Sections */
    details: props => {
      const summaryIdx = props.children
        ? props.children.findIndex(_ => typeof _ === 'object' && _['type'] === 'summary')
        : -1
      if (summaryIdx < 0) {
        return <ExpandableSection {...this.tipProps(props.open)}>{props.children}</ExpandableSection>
      }
      const _summary = props.children[summaryIdx]
      const summary =
        _summary !== undefined && React.isValidElement(_summary) && Array.isArray(_summary.props.children)
          ? _summary.props.children.toString()
          : undefined
      return (
        <ExpandableSection showMore={summary} {...this.tipProps(false)}>
          {props.children && props.children.slice(summaryIdx + 1)}
        </ExpandableSection>
      )
    },
    a: props => {
      const isKuiCommand = props.href.startsWith('#kuiexec?command=')
      const isLocal = !/^http/i.test(props.href)
      const target = !isLocal ? '_blank' : undefined
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
                const tab = this.props.tab
                if (tab) {
                  const elt = tab.querySelector(`[data-markdown-anchor="${this.anchorFrom(props.href.slice(1))}"]`)
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
          : props.href.charAt(0) === '#'
          ? `### In-Page Link\n#### ${props.href}\n\n\`Element will scroll into view\``
          : `### External Link\n#### ${props.href}\n\n\`Link will open in a separate window\``

        const kuiLink = maybeKuiLink(props.href)

        if (kuiLink) {
          props.children.push(<LinkStatus key="link-status" link={kuiLink} />)
        }

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

      const tabUUID = this.props.tabUUID || (this.props.tab ? getPrimaryTabId(this.props.tab) : undefined)

      // react-markdown v6+ places the language in the className
      const match = /language-(\w+)/.exec(props.className || '')
      const language = match ? match[1] : undefined

      if (this.props.nested) {
        return <Input value={String(props.children).trim()} language={language} tabUUID={tabUUID} />
      } else {
        return (
          <div className="paragraph">
            <code className="kui--code--editor">
              <SimpleEditor
                tabUUID={tabUUID}
                content={String(props.children).trim()}
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
    thead: props => <thead className={props.className + ' kui--structured-list-thead'}>{props.children}</thead>,
    tbody: props => <tbody className={props.className + ' kui--structured-list-tbody'}>{props.children}</tbody>
    /* tr: props => <tr>{props.children}</tr>, // TODO ignoring columnAlignment
       td: props => <td>{props.children}</td>,
       th: props => <th style={props.style}>{props.children}</th> */
  }

  public render() {
    if (this.props.onRender) {
      this.props.onRender()
    }

    // avoid typing issues
    const components = Object.assign(
      {
        tip: props => {
          return (
            <ExpandableSection
              className="kui--markdown-tip kui--markdown-major-paragraph"
              showMore={props.title}
              {...this.tipProps(props.open)}
            >
              {props.children}
            </ExpandableSection>
          )
        },
        tabbed: props => {
          // the combination of <Tabs isBox> and <Card boxShadow>
          // gives the tab content adefined border
          return (
            <Tabs isBox variant="light300" className="kui--markdown-tabs" defaultActiveKey={0}>
              {props.children.map((_, idx) => (
                <Tab
                  className="kui--markdown-tab"
                  data-title={_.props.title}
                  key={idx}
                  eventKey={idx}
                  title={<TabTitleText>{_.props.title}</TabTitleText>}
                >
                  <Card boxShadow className="kui--markdown-tab-card">
                    {_.props && _.props.children}
                  </Card>
                </Tab>
              ))}
            </Tabs>
          )
        }
      },
      this.components
    )

    return (
      <React.Suspense fallback={<div />}>
        <TextContent>
          <ReactMarkdown
            components={components}
            rehypePlugins={rehypePlugins}
            plugins={[gfm, [frontmatter, ['yaml', 'toml']], [emojis, { emoticon: true }]]}
            data-is-nested={this.props.nested || undefined}
            className={
              this.props.className ||
              'padding-content marked-content page-content' +
                (!this.props.nested ? ' scrollable scrollable-x scrollable-auto' : '')
            }
          >
            {this.source()}
          </ReactMarkdown>
        </TextContent>
      </React.Suspense>
    )
  }
}
