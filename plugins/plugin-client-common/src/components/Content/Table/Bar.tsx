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

interface Props {
  left: number
  width: number
  className?: string
  wrapperClassName?: string
  title?: string

  widthOverlay?: number
  titleOverlay?: string

  onClick?: (evt: React.MouseEvent) => void
}

/** @return frac formatted as "xx.y%" */
function str(frac: number) {
  return (frac * 100).toFixed(10).toString() + '%'
}

export default class Bar extends React.PureComponent<Props> {
  public render() {
    const left = str(this.props.left)
    const width = str(this.props.width || 1 - (this.props.left || 0))
    const widthOverlay = this.props.widthOverlay ? str(this.props.widthOverlay) : undefined

    return (
      <div className={'kui--bar-wrapper ' + (this.props.wrapperClassName || '')}>
        <div
          className={
            'kui--bar ' +
            (this.props.className || 'kui--bar-default-color') +
            (this.props.onClick ? ' clickable' : '') +
            (this.props.left === undefined || this.props.width === undefined
              ? ' kui--sequence-diagram-in-progress'
              : '')
          }
          title={this.props.title}
          data-left={left}
          data-width={width}
          onClick={this.props.onClick}
          style={{
            left: left,
            width: width
          }}
        />

        {/* overlay, make sure this comes last:  */}
        {this.props.widthOverlay && (
          <div
            className="kui--bar kui--bar-overlay"
            title={this.props.titleOverlay}
            style={{ left: left, width: widthOverlay }}
          />
        )}
      </div>
    )
  }
}
