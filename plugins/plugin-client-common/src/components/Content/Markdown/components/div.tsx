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
import { Choices, Parser } from 'madwizard'

import SplitInjector from '../../../Views/Terminal/SplitInjector'
import SplitPosition from '../../../Views/Terminal/SplitPosition'

import _tabbed, { TabProps, isTabs } from './tabbed'
import { Props as MarkdownProps } from '..'
import { PositionProps, isNormalSplit } from '../KuiFrontmatter'

const Wizard = React.lazy(() => import('./Wizard'))

const ReactCommentary = React.lazy(() => import('../../Commentary').then(_ => ({ default: _.ReactCommentary })))

export default function divWrapper(mdprops: MarkdownProps, uuid: string, choices: Choices.ChoiceState) {
  const tabbed = _tabbed(uuid, choices)

  return function div(props: React.HTMLAttributes<HTMLDivElement> & Partial<PositionProps> & Partial<TabProps>) {
    const maximized = props['data-kui-maximized'] === 'true'
    const position = props['data-kui-split']
    const placeholder = props['data-kui-placeholder']
    const count = props['data-kui-split-count'] ? parseInt(props['data-kui-split-count'], 10) : undefined

    // Important! Default to `undefined` so that we pick up the
    // *default* behavior from the Terminal component
    const hasActiveInput = position === 'terminal' || undefined
    const inverseColors = props['data-kui-inverse-colors'] === 'true' || undefined

    if (isTabs(props)) {
      return tabbed(props)
    } else if (
      !position ||
      ((isNormalSplit(position) || position === 'wizard') && count === 0 && !maximized && !placeholder)
    ) {
      // don't create a split if a position wasn't indicated, or if
      // this is the first default-positioned section; if it is
      // maximized, we'll have to go through the injector path
      const node = Parser.isWizard(props) ? (
        <Wizard uuid={uuid} {...props} choices={choices} />
      ) : (
        <div data-is-maximized={maximized || undefined}>{props.children}</div>
      )
      if (!maximized && (!mdprops.tab || (hasActiveInput !== true && hasActiveInput !== false))) {
        return node
      } else {
        // modify the current split to have the desired properties
        return (
          <SplitInjector.Consumer>
            {injector => injector.modify(mdprops.tab.uuid, node, { hasActiveInput, inverseColors, maximized })}
          </SplitInjector.Consumer>
        )
      }
    } else {
      // then we have a section that targets a given split position
      return (
        <SplitInjector.Consumer>
          {injector => {
            const node = (
              <ReactCommentary>
                <div className="padding-content marked-content page-content" data-is-nested>
                  {Parser.isWizard(props) ? (
                    <Wizard uuid={uuid} {...props} choices={choices} />
                  ) : (
                    props.children || (placeholder ? <span className="italic sub-text">{placeholder}</span> : '')
                  )}
                </div>
              </ReactCommentary>
            )

            const positionForView = position === 'terminal' || position === 'wizard' ? 'default' : position

            setTimeout(() =>
              injector.inject([
                {
                  uuid,
                  node,
                  position: (positionForView + (isNormalSplit(positionForView) ? '' : '-strip')) as SplitPosition,
                  count,
                  opts: { inverseColors, hasActiveInput, maximized }
                }
              ])
            )
            return <React.Fragment />
          }}
        </SplitInjector.Consumer>
      )
    }
  }
}
