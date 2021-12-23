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

import { ReactMarkdownProps } from 'react-markdown/lib/ast-to-react'

const ExpandableSection = React.lazy(() => import('../../../spi/ExpandableSection'))

export function tipProps(expanded: boolean) {
  return { isWidthLimited: true, expanded }
}

export function tip(props: React.DetailsHTMLAttributes<HTMLElement>) {
  return (
    <ExpandableSection
      className="kui--markdown-tip kui--markdown-major-paragraph"
      showMore={props.title}
      {...tipProps(props.open)}
    >
      {props.children}
    </ExpandableSection>
  )
}

/**
 * This feeds off the AST node created by `remark-collapse` to provide
 * Expandable Sections. Unfortunately, that npm does not have any
 * typings.
 */
export function details(props: React.DetailsHTMLAttributes<HTMLElement> & ReactMarkdownProps) {
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
}
