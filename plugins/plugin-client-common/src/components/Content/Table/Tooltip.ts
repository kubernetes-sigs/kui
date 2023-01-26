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

import { i18n } from '@kui-shell/core/mdist/api/i18n'
const strings = i18n('plugin-client-common')

/** @return markdown-formatted tooltip content */
export default function tooltipContent(title: string, name: string, status?: string) {
  const showMoreDetail = strings('Click to show more detail')

  return `### ${title}
#### ${name}

${status ? 'Status: ' + status : ''}

\`${showMoreDetail}\``
}

export const tooltipProps = {
  position: 'bottom-start' as const
}
