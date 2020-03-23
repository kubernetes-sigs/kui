/*
 * Copyright 2019 IBM Corporation
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

import { ResourceWithMetadata } from '@kui-shell/core'

/** version attribute */
export interface WithVersion<Content = void> extends ResourceWithMetadata<Content> {
  version: string
}

/** has a version attribute? */
export function hasVersion(resource: ResourceWithMetadata): resource is WithVersion {
  return typeof (resource as WithVersion).version === 'string'
}

export default WithVersion
