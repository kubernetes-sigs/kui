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

import { StatusModelStatus } from '@kui-shell/core'
import { SupportedIcon } from '../../spi/Icons'

/**
 * Mapping of the icons and colorings we want to use to denote the
 * four classes of status
 *
 */
const icons: Record<StatusModelStatus, { icon: SupportedIcon; className: string }> = {
  success: { icon: 'Checkmark', className: 'green-text' },
  'in-progress': { icon: 'InProgress', className: 'grey-text' },
  warning: { icon: 'Warning', className: 'yellow-text' },
  error: { icon: 'Error', className: 'red-text' },
  unknown: { icon: 'Waiting', className: 'grey-text' }
}

export default icons
