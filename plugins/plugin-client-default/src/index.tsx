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

import { i18n, inBrowser } from '@kui-shell/core'
import {
  Kui,
  KuiProps,
  ContextWidgets,
  MeterWidgets,
  CurrentWorkingDirectory,
  SpaceFiller
} from '@kui-shell/plugin-client-common'

import { CurrentGitBranch } from '@kui-shell/plugin-git'
import { S3Mounts } from '@kui-shell/plugin-s3/components'
import { ProxyOfflineIndicator } from '@kui-shell/plugin-proxy-support'
import { CurrentContext, CurrentNamespace } from '@kui-shell/plugin-kubectl/components'
import { Screenshot, Search, UpdateChecker } from '@kui-shell/plugin-electron-components'

import { productName } from '@kui-shell/client/config.d/name.json'

const strings = i18n('plugin-client-default')

/**
 * We will set this bit when the user dismisses the Welcome to Kui
 * tab, so as to avoid opening it again and bothering that user for
 * every new Kui window.
 *
 */
const welcomeBit = 'plugin-client-default.welcome-was-dismissed'

/** Are we executing the given command? */
function isExecuting(props: KuiProps, ...cmds: string[]) {
  return props.commandLine && cmds.includes(props.commandLine[0])
}

/**
 * Format our body, with extra status stripe widgets
 *   - <CurrentGitBranch />
 *   - <ProxyOfflineIndicator />
 *
 */
export default function renderMain(props: KuiProps) {
  const title = strings('Welcome to Kui')

  // Important: don't use popup for commands that need tabs,
  // e.g. replaying notebooks, since `replay` currently needs tabs,
  // and the Popup client doesn't offer that feature
  const avoidPopupCommands = ['browse']
  const doNotUsePopupClientVariant = isExecuting(props, ...avoidPopupCommands)
  const isPopup = !(!props.isPopup || doNotUsePopupClientVariant)

  const quietExecCommand =
    props.quietExecCommand !== undefined
      ? props.quietExecCommand
      : props.isPopup && doNotUsePopupClientVariant
      ? false
      : undefined

  return (
    <Kui
      productName={productName}
      lightweightTables
      {...props}
      isPopup={isPopup}
      quietExecCommand={quietExecCommand}
      toplevel={!inBrowser() && <Search />}
      commandLine={
        props.commandLine ||
        (!isPopup && [
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
        {!isPopup && <CurrentWorkingDirectory />}
        <CurrentGitBranch className="kui--hide-in-narrower-windows" />
        <CurrentContext />
        <CurrentNamespace />
        <S3Mounts />
      </ContextWidgets>

      {!isPopup && <SpaceFiller />}

      <MeterWidgets className="kui--hide-in-narrower-windows">
        {/* <ClusterUtilization /> */}
        {/* !isPopup && <OpenWhiskGridWidget /> */}
        {inBrowser() && <ProxyOfflineIndicator />}
        {!isPopup && !inBrowser() && <UpdateChecker />}
      </MeterWidgets>

      <MeterWidgets>
        <Screenshot />
      </MeterWidgets>
    </Kui>
  )
}
