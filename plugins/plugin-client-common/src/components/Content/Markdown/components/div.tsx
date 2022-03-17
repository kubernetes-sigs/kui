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
import { TextContent } from '@patternfly/react-core'

import SplitInjector from '../../../Views/Terminal/SplitInjector'
import SplitPosition from '../../../Views/Terminal/SplitPosition'

import { Props as MarkdownProps } from '..'
import _tabbed, { TabProps, isTabs } from './tabbed'
import { isImports, ImportProps } from '../remark-import'
import { PositionProps, isNormalSplit } from '../KuiFrontmatter'

import { isWizard } from './Wizard/rehype-wizard'
const Wizard = React.lazy(() => import('./Wizard'))

const ReactCommentary = React.lazy(() => import('../../Commentary').then(_ => ({ default: _.ReactCommentary })))

export default function div(mdprops: MarkdownProps, uuid: string) {
  const tabbed = _tabbed(uuid)

  return (
    props: React.HTMLAttributes<HTMLDivElement> & Partial<PositionProps> & Partial<ImportProps> & Partial<TabProps>
  ) => {
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
    } else if (isImports(props)) {
      // Don't render the content of imported documents. We will process these separately.
      return <React.Fragment />
    } else if (
      !position ||
      ((isNormalSplit(position) || position === 'wizard') && count === 0 && !maximized && !placeholder)
    ) {
      // don't create a split if a position wasn't indicated, or if
      // this is the first default-positioned section; if it is
      // maximized, we'll have to go through the injector path
      const node = isWizard(props) ? (
        <Wizard uuid={uuid} {...props} />
      ) : (
        <div data-is-maximized={maximized || undefined}>{props.children}</div>
      )
      if (!mdprops.tab || (hasActiveInput !== true && hasActiveInput !== false)) {
        return node
      } else {
        // modify the current split to have the desired properties
        return (
          <SplitInjector.Consumer>
            {injector => injector.modify(mdprops.tab.uuid, node, { hasActiveInput, inverseColors })}
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
                <TextContent>
                  <div className="padding-content marked-content page-content" data-is-nested>
                    {isWizard(props) ? (
                      <Wizard uuid={uuid} {...props} />
                    ) : (
                      props.children || (placeholder ? <span className="italic sub-text">{placeholder}</span> : '')
                    )}
                  </div>
                </TextContent>
              </ReactCommentary>
            )

            const positionForView = position === 'terminal' || position === 'wizard' ? 'default' : position

            setTimeout(() =>
              injector.inject(
                uuid,
                node,
                (positionForView + (isNormalSplit(positionForView) ? '' : '-strip')) as SplitPosition,
                count,
                { inverseColors, hasActiveInput, maximized }
              )
            )
            return <React.Fragment />
          }}
        </SplitInjector.Consumer>
      )
    }
  }
}
