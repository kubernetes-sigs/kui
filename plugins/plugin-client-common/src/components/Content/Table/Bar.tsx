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

interface Props {
  left: number
  className?: string
  wrapperClassName?: string

  title?: string
  width: number

  overheads?: { title: string; width: number; offset: number }[]

  onClick?: (evt: React.MouseEvent) => void
}

/** @return frac formatted as "xx.y%" */
function str(frac: number) {
  return (frac * 100).toFixed(10).toString() + '%'
}

export default class Bar extends React.PureComponent<Props> {
  public render() {
    const totalOverheads = (this.props.overheads || []).reduce((left, { width }) => left + width, 0)
    const leftIncludingOverheads = this.props.left === undefined ? 0 : this.props.left + totalOverheads
    const left = str(leftIncludingOverheads)
    const width = str(this.props.width ? this.props.width - totalOverheads : 1 - (leftIncludingOverheads || 0))

    const className =
      'kui--bar ' +
      (this.props.className || 'kui--bar-default-color') +
      (this.props.onClick ? ' clickable' : '') +
      (this.props.left === undefined || this.props.width === undefined ? ' kui--sequence-diagram-in-progress' : '')

    return (
      <div className={'kui--bar-wrapper ' + (this.props.wrapperClassName || '')}>
        <div
          className={className}
          data-left={left}
          data-width={width}
          style={{ left, width }}
          title={this.props.title}
          onClick={this.props.onClick}
        />

        {/* "overlays", make sure this comes last:  */}
        {this.props.overheads.map(({ title, width, offset }, idx) => (
          <div
            key={idx}
            title={title}
            data-overlay={idx}
            style={{ marginLeft: str(offset), width: str(width) }}
            className={'kui--bar' + (this.props.onClick ? ' clickable' : '')}
          />
        ))}
      </div>
    )
  }
}
