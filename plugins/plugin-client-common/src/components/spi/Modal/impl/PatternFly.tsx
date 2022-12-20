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
import Props from '../model'

import { Modal } from '@patternfly/react-core/dist/esm/components/Modal'
import { Button } from '@patternfly/react-core/dist/esm/components/Button'

export default function PatternFlyModal(props: Props): React.ReactElement {
  return (
    <Modal
      id={props.id}
      isOpen={props.isOpen}
      title={props.title}
      titleIconVariant={props.titleIconVariant}
      variant="small"
      onClose={props.onClose}
      actions={[
        <Button key="confirm" variant="primary" className="kui--modal-btn--primary" onClick={props.onSubmit}>
          {props.primaryButtonText}
        </Button>,
        <Button key="cancel" variant="link" className="kui--modal-btn--secondary" onClick={props.onClose}>
          {props.secondaryButtonText}
        </Button>
      ]}
    >
      {props.children}
    </Modal>
  )
}
