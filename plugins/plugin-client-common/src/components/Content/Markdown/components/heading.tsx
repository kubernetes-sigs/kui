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
import { HeadingProps } from 'react-markdown/lib/ast-to-react'
import { Text, TextVariants } from '@patternfly/react-core/dist/esm/components/Text'

export function anchorFrom(uuid: string, txt: string): string {
  return `${uuid}-${txt}`
}

export default function heading(uuid: string) {
  return function Heading(props: HeadingProps) {
    const valueChild = props.children
      ? props.children.length === 1
        ? props.children[0]
        : props.children.find(_ => typeof _ === 'string')
      : '' // empty heading e.g. just "#" on its own line

    const anchor =
      !valueChild || typeof valueChild !== 'string'
        ? undefined
        : anchorFrom(uuid, valueChild.toLowerCase().replace(/ /g, '-'))

    return (
      <Text id={props.id} component={TextVariants['h' + props.level]} data-markdown-anchor={anchor}>
        {props.children}
      </Text>
    )
  }
}
