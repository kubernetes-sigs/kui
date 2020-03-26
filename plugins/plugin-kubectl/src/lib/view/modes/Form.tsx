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

import { FormMap } from './table-to-map'
import { KubeResource } from '../../model/resource'

import '@kui-shell/plugin-client-common/web/css/static/Form.scss'
import 'carbon-components/scss/components/form/_form.scss'

/** @return a ReactElement */
export default function SidecarForm({
  nested,
  map,
  className
}: {
  nested?: boolean
  map: FormMap
  className?: string
}) {
  return (
    <Form className={nested ? className : `padding-content scrollable ${className || ''}`}>
      {Object.keys(map).map((key, idx) => {
        const vvalue = map[key]
        const value =
          (typeof vvalue === 'number' ? vvalue.toLocaleString() : typeof vvalue !== 'object' ? vvalue : vvalue.label) ||
          ''

        const colspan = Math.max(Math.ceil(key.length / 9), Math.ceil(value.length / 6))
        const style = { gridColumn: `span ${colspan}` }
        const className = typeof vvalue !== 'object' ? undefined : 'kui--form-item--for-label'

        return (
          <div key={idx} style={style} className={className}>
            <TextInput readOnly id={`kubectl-summary-${key}`} labelText={key} defaultValue={value} />
          </div>
        )
      })}
    </Form>
  )
}

export function FormWithLabels(props: { map: FormMap; resource: KubeResource }) {
  const labelMap: FormMap = {}
  if (props.resource.metadata && props.resource.metadata.labels) {
    for (const key in props.resource.metadata.labels) {
      labelMap[`${key} label`] = { label: props.resource.metadata.labels[key] }
    }
  }

  return (
    <div className="padding-content scrollable">
      <SidecarForm nested map={props.map} />
      <SidecarForm nested map={labelMap} className="top-pad" />
    </div>
  )
}

export function renderFormWithLabels(map: FormMap, resource: KubeResource) {
  return {
    react: function SidecarFormWithLabelsProvider() {
      return <FormWithLabels map={map} resource={resource} />
    }
  }
}

/** @return a ReactProvider */
export function renderForm(map: FormMap) {
  return {
    react: function SidecarFormProvider() {
      return <SidecarForm map={map} />
    }
  }
}
