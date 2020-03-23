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

export interface WithCluster<Content = void> extends ResourceWithMetadata<Content> {
  spec: {
    cluster: string
  }
}

export function hasCluster<Content = void>(
  resource: WithCluster<Content> | ResourceWithMetadata
): resource is WithCluster<Content> {
  const withCluster = resource as WithCluster<Content>
  return withCluster.spec && typeof withCluster.spec.cluster === 'string'
}

export default WithCluster
