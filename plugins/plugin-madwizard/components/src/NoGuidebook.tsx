/*
 * Copyright 2022 The Kubernetes Authors
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
import { Button, EmptyState, EmptyStateBody, EmptyStatePrimary, Flex, FlexItem, Title } from '@patternfly/react-core'

export default class Empty extends React.PureComponent<{ refresh(): void; gotit(): void }> {
  /** Run through all questions again */
  private resubmit() {
    return (
      <Flex>
        <FlexItem>
          <Button variant="secondary" onClick={this.props.gotit}>
            Got it!
          </Button>
        </FlexItem>
        <FlexItem>
          <Button variant="tertiary" onClick={this.props.refresh}>
            Walk through the constraints again
          </Button>
        </FlexItem>
      </Flex>
    )
  }

  public render() {
    return (
      <EmptyState variant="xs" className="sans-serif flex-fill madwizard--workload-comparo">
        <Title size="lg" headingLevel="h4">
          All constraints satisfied
        </Title>
        <EmptyStateBody>
          All application, compute, and storage constraints have been defined by your Draft Specification.
        </EmptyStateBody>
        <EmptyStatePrimary>{this.resubmit()}</EmptyStatePrimary>
      </EmptyState>
    )
  }
}
