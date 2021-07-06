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
import { Arguments } from '@kui-shell/core'

type Props = Pick<Arguments['pipeStages'], 'prefix' | 'stages' | 'redirect' | 'redirector'> & Pick<Arguments, 'REPL'>

export default class FancyPipeline extends React.PureComponent<Props> {
  private linebreak() {
    return <span className="kui--line-break">&nbsp;</span>
  }

  private pipe(c: string) {
    return <strong className="pre-wrap left-pad sub-text">{c} </strong>
  }

  /**
   * Pretty-print the command line with `pipeStages`
   * e.g. somePrefix -- foo | bar > baz
   */
  public render() {
    const { prefix, stages, redirect, redirector, REPL } = this.props

    return (
      <span className="repl-input-element flex-fill">
        {/* somePrefix -- */}
        {prefix && (
          <React.Fragment>
            <span className="pre-wrap">{prefix} -- </span>
            {(stages.length > 0 || redirect) && (
              <React.Fragment>
                {this.linebreak()}
                {this.pipe('\u00a0')}
              </React.Fragment>
            )}
          </React.Fragment>
        )}

        {/* bar | baz */}
        {stages.map((pipePart, pidx, parts) => (
          <React.Fragment key={pidx}>
            {pidx > 0 && this.pipe('|')}
            {pipePart.map((word, widx) =>
              widx === 0 ? (
                <span key={widx} className="color-base0D">
                  {word}
                </span>
              ) : (
                ` ${word}`
              )
            )}
            {pidx < parts.length - 1 && this.linebreak()}
          </React.Fragment>
        ))}
        {redirect && (
          <React.Fragment>
            {this.linebreak()}
            {this.pipe(redirector)}
            <span className="clickable" onClick={() => REPL.pexec(`ls ${redirect}`)}>
              {redirect}
            </span>
          </React.Fragment>
        )}
      </span>
    )
  }
}
