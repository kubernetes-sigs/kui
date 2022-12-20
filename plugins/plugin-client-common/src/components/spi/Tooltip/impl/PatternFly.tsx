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
import { Tooltip } from '@patternfly/react-core/dist/esm/components/Tooltip'

import Props, { isMarkdownProps, isReferenceProps } from '../model'

const Markdown = React.lazy(() => import('../../../Content/Markdown'))

import '../../../../../web/scss/components/Tooltip/PatternFly.scss'

function isMarkdownContent(str: string) {
  return !/^\w+$/.test(str)
}

export default function PatternFlyTooltip(props: Props): React.ReactElement {
  const isMarkdown = isMarkdownProps(props)
  const isReference = isReferenceProps(props)

  if (!isReference && ((isMarkdown && !props.markdown) || (!isMarkdown && !props.content))) {
    // no content to display!
    return <React.Fragment>{props.children}</React.Fragment>
  }

  return (
    <Tooltip
      className="kui--tooltip"
      enableFlip={props.enableFlip}
      maxWidth={props.maxWidth}
      isContentLeftAligned={isMarkdown}
      position={props.position || 'auto'}
      distance={10}
      entryDelay={props.entryDelay || 200}
      data-is-markdown={isMarkdown || undefined}
      reference={isReference && props.reference}
      content={
        isReference ? (
          props.children
        ) : isMarkdown ? (
          !isMarkdownContent(props.markdown) ? (
            props.markdown
          ) : (
            <React.Suspense fallback={<div />}>
              <Markdown nested executableCodeBlocks={false} source={props.markdown} />
            </React.Suspense>
          )
        ) : (
          props.content
        )
      }
    >
      {!isReference && <React.Fragment>{props.children}</React.Fragment>}
    </Tooltip>
  )
}
