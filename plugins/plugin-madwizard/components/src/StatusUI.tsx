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
import { Graph } from 'madwizard'
import { Icons, SupportedIcon } from '@kui-shell/plugin-client-common'

export function statusToClassName(status: Graph.Status) {
  return [`pf-m-${status}`]
}

const icons: Record<Graph.Status, { icon?: SupportedIcon | ''; className?: string }> = {
  info: { icon: 'Info' },
  minor: { icon: '' },
  blank: { icon: '' },
  success: { icon: 'Checkmark' },
  warning: { icon: 'Warning', className: 'yellow-text' },
  error: { icon: 'Error', className: 'red-text' },
  unknown: { icon: 'Unknown', className: 'yellow-text' },
  current: { icon: 'Current' },
  pending: { icon: undefined },
  'in-progress': { icon: 'InProgress', className: 'kui--spin-animation yellow-text' }
}

export function statusToIcon(status: Graph.Status) {
  const { icon, className } = icons[status]
  return icon && <Icons icon={icon} className={className} />
}
