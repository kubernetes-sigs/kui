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
import { Components } from 'react-markdown'
import { dirname, join, relative } from 'path'
import { TextContent, Tab, Tabs, TabTitleText, Text, TextVariants } from '@patternfly/react-core'
import { maybeKuiLink, KResponse, REPL, getPrimaryTabId, pexecInCurrentTab } from '@kui-shell/core'

// don't make this lazy if you want code blocks to be sequentially
// numbered (see codeIdx)
// const Card = React.lazy(() => import('../spi/Card'))
import Card from '../../../spi/Card'

const Hint = React.lazy(() => import('../../../spi/Hint'))
const Tooltip = React.lazy(() => import('../../../spi/Tooltip'))
const LinkStatus = React.lazy(() => import('../../LinkStatus'))
const SimpleEditor = React.lazy(() => import('../../Editor/SimpleEditor'))
const ExpandableSection = React.lazy(() => import('../../../spi/ExpandableSection'))
const ReactCommentary = React.lazy(() => import('../../Commentary').then(_ => ({ default: _.ReactCommentary })))

import Input from '../../../Views/Terminal/Block/Inputv2'
// const Input = React.lazy(() => import('../Views/Terminal/Block/Inputv2'))

import _img from './img'
import { list, listItem } from './list'
import _heading, { anchorFrom } from './heading'

import { Props } from '../../Markdown'
import { tryFrontmatter, codeWithResponseFrontmatter } from '../frontmatter'

import SplitInjector from '../../../Views/Terminal/SplitInjector'
import SplitPosition from '../../../Views/Terminal/SplitPosition'

function tipProps(expanded: boolean) {
  return { isWidthLimited: true, expanded }
}

type Args = {
  mdprops: Props
  repl: REPL
  uuid: string
  spliceInCodeExecution: (replacement: string, startOffset: number, endOffset: number, codeIdx: number) => void
  codeHasBeenExecuted: (codeIdx: number) => boolean
}

function typedComponents(codeIdx: () => number, args: Args): Components {
  const { mdprops, repl, uuid, spliceInCodeExecution, codeHasBeenExecuted } = args

  const img = _img(mdprops)
  const heading = _heading(uuid)

  const spliceCodeWithResponseFrontmatter = (
    response: KResponse,
    body: string,
    language: string,
    sliceStart: number,
    sliceEnd: number,
    codeIdx: number
  ) => spliceInCodeExecution(codeWithResponseFrontmatter(body, language, response), sliceStart, sliceEnd, codeIdx)

  return {
    /** remark-collapse support; this is Expandable Sections */
    details: props => {
      const summaryIdx = props.children
        ? props.children.findIndex(_ => typeof _ === 'object' && _['type'] === 'summary')
        : -1
      if (summaryIdx < 0) {
        return <ExpandableSection {...tipProps(props.open)}>{props.children}</ExpandableSection>
      }
      const _summary = props.children[summaryIdx]
      const summary =
        _summary !== undefined && React.isValidElement(_summary) && Array.isArray(_summary.props.children)
          ? _summary.props.children.toString()
          : undefined
      return (
        <ExpandableSection showMore={summary} {...tipProps(false)}>
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
                  if (repl) {
                    return repl.pexec(cmdline, { echo })
                  } else {
                    pexecInCurrentTab(cmdline, undefined, !echo)
                  }
                }
              } else if (props.href.charAt(0) === '#') {
                const tab = mdprops.tab
                if (tab) {
                  const elt = tab.querySelector(`[data-markdown-anchor="${anchorFrom(uuid, props.href.slice(1))}"]`)
                  if (elt) {
                    return elt.scrollIntoView()
                  }
                }
              } else if (file) {
                if (mdprops.fullpath) {
                  const absoluteHref = join(dirname(mdprops.fullpath), props.href)
                  const relativeToCWD = relative(process.cwd() || process.env.PWD, absoluteHref)
                  file = relativeToCWD
                }

                return repl.pexec(`open ${repl.encodeComponent(file)}`)
              }
            }

      if (!props.href) {
        return <a className={mdprops.className}>{props.children}</a>
      } else if (!isLocal && mdprops.noExternalLinks) {
        return <span className={mdprops.className}>{props.href}</span>
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

      const code = String(props.children).trim()
      const fm = tryFrontmatter(code)
      const { body, attributes } = fm

      const tabUUID = mdprops.tab ? getPrimaryTabId(mdprops.tab) : undefined

      // react-markdown v6+ places the language in the className
      const match = /language-(\w+)/.exec(props.className || '')
      const language = match ? match[1] : undefined

      if (mdprops.nested) {
        // onContentChange={body => this.splice(codeWithResponseFrontmatter(body, attributes.response), props.node.position.start.offset, props.node.position.end.offset)}
        const sliceStart = props.node.position.start.offset
        const sliceEnd = props.node.position.end.offset

        const myCodeIdx = codeIdx()
        const executed = codeHasBeenExecuted(myCodeIdx)

        return (
          <Input
            key="fixed"
            readonly={false}
            className="kui--code-block-in-markdown"
            tab={mdprops.tab}
            value={body}
            language={language}
            response={attributes.response}
            hasBeenExecuted={executed}
            arg1={body}
            arg2={language}
            arg3={sliceStart}
            arg4={sliceEnd}
            arg5={myCodeIdx}
            onResponse={spliceCodeWithResponseFrontmatter}
            data-code-index={myCodeIdx}
          />
        )
      } else {
        return (
          <div className="paragraph">
            <code className="kui--code--editor">
              <SimpleEditor
                tabUUID={tabUUID}
                content={body}
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
    div: props => {
      const splitTarget = props['data-kui-split']
      if (!splitTarget || splitTarget === 'default') {
        return <div {...props} />
      } else {
        // then we have a section that targets a given split position
        return (
          <SplitInjector.Consumer>
            {inject => {
              const node = (
                <React.Suspense fallback={<div />}>
                  <ReactCommentary>
                    <TextContent>
                      <div className="padding-content marked-content page-content" data-is-nested>
                        {props.children}
                      </div>
                    </TextContent>
                  </ReactCommentary>
                </React.Suspense>
              )

              setTimeout(() => inject(uuid, node, (splitTarget + '-strip') as SplitPosition))
              return <React.Fragment />
            }}
          </SplitInjector.Consumer>
        )
      }
    },
    p: props => <Text component={TextVariants.p} {...props} />,
    h1: heading,
    h2: heading,
    h3: heading,
    h4: heading,
    h5: heading,
    h6: heading,
    img,
    ol: list,
    ul: list,
    li: listItem,
    table: props => (
      <table className={props.className + ' kui--table-like kui--structured-list'}>{props.children}</table>
    ),
    thead: props => <thead className={props.className + ' kui--structured-list-thead'}>{props.children}</thead>,
    tbody: props => <tbody className={props.className + ' kui--structured-list-tbody'}>{props.children}</tbody>
  }
}

/** avoid typing issues... */
function components(args: Args) {
  // hack until we do this correctly with an AST visitor
  let codeIdx = 0
  const allocCodeIdx = () => codeIdx++

  const components = Object.assign(
    {
      tip: props => {
        return (
          <ExpandableSection
            className="kui--markdown-tip kui--markdown-major-paragraph"
            showMore={props.title}
            {...tipProps(props.open)}
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
    typedComponents(allocCodeIdx, args)
  )

  return function mkComponents() {
    codeIdx = 0
    return components
  }
}

export default components
