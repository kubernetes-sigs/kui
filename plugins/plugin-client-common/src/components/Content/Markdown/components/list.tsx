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
import { LiProps, OrderedListProps, UnorderedListProps } from 'react-markdown/lib/ast-to-react'

import { List, ListComponent, ListItem } from '@patternfly/react-core/dist/esm/components/List'

import {
  ProgressStepper,
  ProgressStepperProps,
  ProgressStep,
  ProgressStepCompatible,
  isProgressStepCompatible,
  liveStatusChannel
} from '../../ProgressStepper'

export function li(props: LiProps) {
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
}

export function list(props: OrderedListProps | UnorderedListProps) {
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
        <ProgressStepper layout={props.ordered ? 'horizontal' : 'vertical'} className="kui--markdown-major-paragraph">
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
