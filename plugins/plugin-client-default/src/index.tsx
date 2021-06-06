/*
 * Copyright 2020 The Kubernetes Authors
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

import { i18n, inBrowser, isPopup } from '@kui-shell/core'
import {
  Kui,
  KuiProps,
  ContextWidgets,
  MeterWidgets,
  CurrentWorkingDirectory,
  SpaceFiller
} from '@kui-shell/plugin-client-common'

import { CurrentGitBranch } from '@kui-shell/plugin-git'
import { CurrentContext, CurrentNamespace } from '@kui-shell/plugin-kubectl/components'
// import { ClusterUtilization } from '@kui-shell/plugin-kubectl/view-utilization'
import { ProxyOfflineIndicator } from '@kui-shell/plugin-proxy-support'
import { Screenshot, Search, UpdateChecker } from '@kui-shell/plugin-electron-components'
// import { GridWidget as OpenWhiskGridWidget } from '@kui-shell/plugin-openwhisk'

import { productName } from '@kui-shell/client/config.d/name.json'

const strings = i18n('plugin-client-default')

/**
 * We will set this bit when the user dismisses the Welcome to Kui
 * tab, so as to avoid opening it again and bothering that user for
 * every new Kui window.
 *
 */
const welcomeBit = 'plugin-client-default.welcome-was-dismissed'

/**
 * Format our body, with extra status stripe widgets
 *   - <CurrentGitBranch />
 *   - <ProxyOfflineIndicator />
 *
 */
export default function renderMain(props: KuiProps) {
  const title = strings('Welcome to Kui')

  return (
    <Kui
      productName={productName}
      splitTerminals
      lightweightTables
      {...props}
      toplevel={!inBrowser() && <Search />}
      commandLine={
        props.commandLine ||
        (!isPopup() && [
          'tab',
          'new',
          '-s',
          '/kui/welcome.json',
          '-q', // qexec
          '--bg', // open in background
          '--title',
          title,
          '--status-stripe-type',
          'blue',
          '--status-stripe-message',
          title,
          '--if',
          `kuiconfig not set ${welcomeBit}`,
          '--onClose',
          `kuiconfig set ${welcomeBit}`
        ])
      }
    >
      <ContextWidgets>
        {!isPopup() && <CurrentWorkingDirectory />}
        <CurrentGitBranch className="kui--hide-in-narrower-windows" />
        <CurrentContext />
        <CurrentNamespace />
      </ContextWidgets>

      {!isPopup() && <SpaceFiller />}

      <MeterWidgets className="kui--hide-in-narrower-windows">
        {/* <ClusterUtilization /> */}
        {/* !isPopup() && <OpenWhiskGridWidget /> */}
        {inBrowser() && <ProxyOfflineIndicator />}
        {!isPopup() && !inBrowser() && <UpdateChecker />}
      </MeterWidgets>

      <MeterWidgets>
        <Screenshot />
      </MeterWidgets>
    </Kui>
  )
}
