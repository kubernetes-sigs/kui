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
import { Label } from '@patternfly/react-core/dist/esm/components/Label'
import { LabelGroup } from '@patternfly/react-core/dist/esm/components/LabelGroup'

import BaseProps from '../model'

import Tooltip from '../../Tooltip'

import '../../../../../web/scss/components/DescriptionList/PatternFlyLabelList.scss'

type Props = Omit<BaseProps, 'as'>
type State = {
  className: string
}

export default class PatternFlyDescriptionList extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props)
    this.state = {
      className: [
        this.props.className,
        'kui--description-list',
        'kui--label-list',
        'flex-fill',
        'padding-content'
      ].join(' ')
    }
  }

  private readonly _onClick = (evt: React.MouseEvent<HTMLSpanElement>) => {
    const key = evt.currentTarget.getAttribute('data-term')
    const value = evt.currentTarget.getAttribute('data-description')
    navigator.clipboard.writeText(`${key}=${value}`)
  }

  public render() {
    return (
      <div className={this.state.className}>
        <LabelGroup className="kui--description-list-group" numLabels={10}>
          {this.props.groups.map((group, idx) => (
            <Tooltip key={idx} content="Click to copy" position="bottom">
              <Label
                className="kui--description-list-term"
                data-term={group.term}
                data-description={group.description}
                onClick={this._onClick}
              >
                <div>
                  <span className="kui--description-list-label-key">{group.term}</span>
                  <span className="slightly-deemphasize">=</span>
                  <span className="map-value">{group.description}</span>
                </div>
              </Label>
            </Tooltip>
          ))}
        </LabelGroup>
      </div>
    )
  }
}
