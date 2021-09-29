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
import { StatusModel, aggregateStatusModelStatus } from '@kui-shell/core'

import { ProgressStepper, ProgressStep } from '../ProgressStepper'

import TileTitle from './TileTitle'

type Props = StatusModel & { className?: string }

/** Sort by increasing title */
function byTitle(a: { title: string }, b: { title: string }) {
  return a.title.localeCompare(b.title)
}

export default class StatusVisualizer extends React.PureComponent<Props> {
  private sections() {
    const sections = this.props.spec.sections.sort(byTitle)

    return (
      <ProgressStepper layout="horizontal" className="flex-fill">
        {[].concat(
          ...sections.map(section =>
            section.tiles.sort(byTitle).map(tile => (
              <ProgressStep
                key={`${section.title} ${tile.title}`}
                title={<TileTitle section={section} tile={tile} />}
                defaultStatus={aggregateStatusModelStatus(tile)}
              >
                {tile.description}
              </ProgressStep>
            ))
          )
        )}
      </ProgressStepper>
    )
  }

  public render() {
    return <div className="sans-serif flex-layout flex-fill flex-column all-pad">{this.sections()}</div>
  }
}
