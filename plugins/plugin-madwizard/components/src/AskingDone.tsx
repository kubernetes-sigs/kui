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

import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  EmptyStateSecondaryActions,
  Title
} from '@patternfly/react-core'

import BanIcon from '@patternfly/react-icons/dist/esm/icons/ban-icon'
import HomeIcon from '@patternfly/react-icons/dist/esm/icons/home-icon'
import SpinnerIcon from '@patternfly/react-icons/dist/esm/icons/spinner-icon'
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon'
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon'

type Props = {
  status: 'success' | 'cancelled' | 'error' | 'q&a' | 'running'
  onClickCancel(): void
  onClickHome(): void
}

export default class AskingDone extends React.PureComponent<Props> {
  public render() {
    const inProgress = this.props.status === 'running'
    const icon = inProgress
      ? SpinnerIcon
      : this.props.status === 'success'
      ? CheckCircleIcon
      : this.props.status === 'cancelled'
      ? BanIcon
      : ExclamationTriangleIcon
    const iconClass = inProgress
      ? 'kui--spin-animation yellow-text'
      : this.props.status === 'success'
      ? 'green-text'
      : this.props.status === 'error'
      ? 'red-text'
      : ''
    const title = inProgress
      ? 'Executing tasks'
      : this.props.status === 'success'
      ? 'Success!'
      : this.props.status === 'cancelled'
      ? 'Cancelled'
      : 'Failed'
    const body = inProgress
      ? 'All questions have now been resolved, and execution of the remaining tasks is now underway'
      : this.props.status === 'success'
      ? 'All tasks in the guidebook were executed successfully'
      : this.props.status === 'cancelled'
      ? 'Guidebook execution was cancelled'
      : 'Guidebook execution has failed'
    const buttonText = inProgress ? 'Cancel' : this.props.status === 'success' ? 'Repeat this Run' : 'Retry this Run'

    const onClick = this.props.status === 'running' ? this.props.onClickCancel : this.props.onClickHome

    return (
      <EmptyState variant="xs" className="sans-serif flex-fill kui--madwizard-ask-ui">
        <EmptyStateIcon icon={icon} className={iconClass} />
        <Title size="lg" headingLevel="h4">
          {title}
        </Title>

        <EmptyStateBody>{body}</EmptyStateBody>

        <EmptyStatePrimary>
          <Button onClick={onClick}>{buttonText}</Button>
        </EmptyStatePrimary>

        {onClick !== this.props.onClickHome && (
          <EmptyStateSecondaryActions>
            <Button className="larger-text" variant="link" icon={<HomeIcon />} onClick={this.props.onClickHome} />
          </EmptyStateSecondaryActions>
        )}
      </EmptyState>
    )
  }
}
