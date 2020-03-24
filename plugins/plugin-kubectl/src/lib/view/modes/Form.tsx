/*
 * Copyright 2020 IBM Corporation
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

import * as React from 'react'
import { Form, TextInput } from 'carbon-components-react'

/** @return a ReactElement */
export default function SidecarForm({ map }: { map: Record<string, string> }) {
  return (
    <Form className="page-content padding-content scrollable kui--placeholder-primary">
      {Object.keys(map).map((key, idx) => (
        <TextInput readOnly key={idx} id={`kubectl-summary-${key}`} labelText={key} defaultValue={map[key]} />
      ))}
    </Form>
  )
}

/** @return a ReactProvider */
export function renderForm(map: Record<string, string>) {
  return {
    react: function SidecarFormProvider() {
      return <SidecarForm map={map} />
    }
  }
}
