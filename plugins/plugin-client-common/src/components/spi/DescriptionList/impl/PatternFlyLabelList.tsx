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
import { LabelGroup, Label } from '@patternfly/react-core'

import Props from '../model'

import '../../../../../web/scss/components/DescriptionList/PatternFlyLabelList.scss'

export default function PatternFlyDescriptionList(props: Omit<Props, 'as'>) {
  return (
    <div
      className={[props.className, 'kui--description-list', 'kui--label-list', 'flex-fill', 'padding-content'].join(
        ' '
      )}
    >
      <LabelGroup className="kui--description-list-group" numLabels={10}>
        {props.groups.map((group, idx) => (
          <Label key={idx} className="kui--description-list-term" data-term={group.term}>
            <span className="kui--description-list-label-key">{group.term}</span>
            <strong className="slightly-deemphasize small-left-pad small-right-pad">|</strong>
            <span className="map-value">{group.description}</span>
          </Label>
        ))}
      </LabelGroup>
    </div>
  )
}
