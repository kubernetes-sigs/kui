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

/* eslint-disable react/prop-types, react/display-name */

import React from 'react'
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core'

import Card from '../../../spi/Card'

export default function tabbed(props) {
  // isSecondary={parseInt(props.depth, 10) > 0}
  return (
    <Tabs className="kui--markdown-tabs paragraph" defaultActiveKey={0}>
      {(props.children || []).map((_, idx) => (
        <Tab
          className="kui--markdown-tab"
          data-title={_.props.title}
          key={idx}
          eventKey={idx}
          title={<TabTitleText>{_.props.title}</TabTitleText>}
        >
          <Card className="kui--markdown-tab-card">{_.props && _.props.children}</Card>
        </Tab>
      ))}
    </Tabs>
  )
}
