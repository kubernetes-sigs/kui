/*
 * Copyright 2021 IBM Corporation
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
import Props from '../model'

import Markdown from '../../../Content/Markdown'
import { Tooltip } from '@patternfly/react-core'

import '../../../../../web/scss/components/Tooltip/PatternFly.scss'

export default function PatternFlyTooltip(props: Props): React.ReactElement {
  const isMarkdown = !!props.markdown || undefined

  return (
    <Tooltip
      entryDelay={200}
      className="kui--tooltip"
      reference={props.reference}
      data-is-markdown={isMarkdown}
      isContentLeftAligned={isMarkdown}
      position={props.position || 'auto'}
      content={
        props.reference ? props.children : props.markdown ? <Markdown nested source={props.markdown} /> : props.content
      }
    >
      {!props.reference && <React.Fragment>{props.children}</React.Fragment>}
    </Tooltip>
  )
}
