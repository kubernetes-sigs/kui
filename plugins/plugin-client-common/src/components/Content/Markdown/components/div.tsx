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

const ReactCommentary = React.lazy(() => import('../../Commentary').then(_ => ({ default: _.ReactCommentary })))

export default function div(uuid: string) {
  return (props: React.HTMLAttributes<HTMLDivElement>) => {
    const splitTarget = props['data-kui-split']
    if (!splitTarget || splitTarget === 'default') {
      return <div {...props} />
    } else {
      // then we have a section that targets a given split position
      return (
        <SplitInjector.Consumer>
          {inject => {
            const node = (
              <ReactCommentary>
                <TextContent>
                  <div className="padding-content marked-content page-content" data-is-nested>
                    {props.children}
                  </div>
                </TextContent>
              </ReactCommentary>
            )

            setTimeout(() => inject(uuid, node, (splitTarget + '-strip') as SplitPosition))
            return <React.Fragment />
          }}
        </SplitInjector.Consumer>
      )
    }
  }
}
