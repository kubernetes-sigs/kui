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
import {
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription
} from '@patternfly/react-core/dist/esm/components/DescriptionList'

import Props from '../model'

import '../../../../../web/scss/components/DescriptionList/PatternFly.scss'

function columnModifier(maxWidth: number) {
  if (maxWidth > 40) {
    return {
      default: '1Col' as const,
      lg: '2Col' as const,
      xl: '2Col' as const
    }
  } else {
    return {
      default: '1Col' as const,
      lg: '2Col' as const,
      xl: '3Col' as const
    }
  }
}

export default function PatternFlyDescriptionList(props: Omit<Props, 'as'>) {
  const maxWidth = props.groups.reduce(
    (max, group) => Math.max(max, group.term.length, group.description.toString().length),
    0
  )

  return (
    <DescriptionList
      isAutoColumnWidths
      className={[props.className, 'kui--description-list', 'flex-fill'].join(' ')}
      columnModifier={columnModifier(maxWidth)}
    >
      {props.groups.map((group, idx) => (
        <DescriptionListGroup key={idx} className="kui--description-list-group">
          <DescriptionListTerm className="kui--description-list-term" data-term={group.term}>
            {group.term}
          </DescriptionListTerm>
          <DescriptionListDescription className="kui--description-list-description">
            {group.description}
          </DescriptionListDescription>
        </DescriptionListGroup>
      ))}
    </DescriptionList>
  )
}
