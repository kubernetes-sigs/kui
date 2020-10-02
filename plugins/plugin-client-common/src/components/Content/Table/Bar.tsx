/*
 * Copyright 2020 IBM Corporation
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
import '../../../../web/scss/components/Table/Bar.scss'

interface Props {
  left: string
  width: string
  className?: string
  wrapperClassName?: string
  title?: string

  widthOverlay?: string
  titleOverlay?: string

  onClick?: (evt: React.MouseEvent) => void
}

export default class Bar extends React.PureComponent<Props> {
  public render() {
    return (
      <div className={'kui--bar-wrapper ' + (this.props.wrapperClassName || '')}>
        <div
          className={
            'kui--bar ' + (this.props.className || 'kui--bar-default-color') + (this.props.onClick ? ' clickable' : '')
          }
          title={this.props.title}
          data-left={this.props.left}
          data-width={this.props.width}
          onClick={this.props.onClick}
          style={{
            left: this.props.left,
            width: this.props.width
          }}
        />

        {/* overlay, make sure this comes last:  */}
        {this.props.widthOverlay && (
          <div
            className="kui--bar kui--bar-overlay"
            title={this.props.titleOverlay}
            style={{ left: this.props.left, width: this.props.widthOverlay }}
          />
        )}
      </div>
    )
  }
}
