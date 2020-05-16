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

import { Kui, KuiProps, ContextWidgets, MeterWidgets } from '@kui-shell/plugin-client-common'

import { CurrentGitBranch } from '@kui-shell/plugin-git'
import { CurrentContext, CurrentNamespace } from '@kui-shell/plugin-kubectl/components'
// import { ClusterUtilization } from '@kui-shell/plugin-kubectl/view-utilization'
import { ProxyOfflineIndicator } from '@kui-shell/plugin-proxy-support'

import { productName } from '@kui-shell/client/config.d/name.json'

/**
 * Format our body, with extra status stripe widgets
 *   - <CurrentGitBranch />
 *   - <ProxyOfflineIndicator />
 *
 */
export default function renderMain(props: KuiProps) {
  return (
    <Kui productName={productName} {...props}>
      <ContextWidgets>
        <CurrentGitBranch className="kui--hide-in-narrower-windows" />
        <CurrentContext />
        <CurrentNamespace />
      </ContextWidgets>

      <MeterWidgets>
        {/* <ClusterUtilization /> */}
        <ProxyOfflineIndicator />
      </MeterWidgets>
    </Kui>
  )
}
