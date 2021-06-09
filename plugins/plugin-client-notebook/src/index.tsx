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

import {
  ContextWidgets,
  Icons,
  Kui,
  KuiProps,
  MeterWidgets,
  TextWithIconWidget,
  SpaceFiller
} from '@kui-shell/plugin-client-common'
import { version } from '@kui-shell/client/package.json'

/**
 * Format our body, with extra status stripe widgets
 *   - <CurrentGitBranch />
 *   - <ProxyOfflineIndicator />
 *
 */
export default function renderMain(props: KuiProps) {
  const kuiVersion = () => {
    return <TextWithIconWidget text={`Kui v${version}`} viewLevel="normal" title={`Kui version ${version}`} />
  }

  const githubIcon = () => {
    return (
      <a
        href="https://github.com/IBM/kui"
        target="#"
        title="Kui Github"
        className="kui--status-stripe-element-clickable kui--status-stripe-element"
      >
        <Icons icon="Github" className="somewhat-larger-text" />
      </a>
    )
  }

  return (
    <Kui
      productName="Kui"
      noHelp
      noSettings
      lightweightTables
      {...props}
      commandLine={
        props.commandLine || ['replay', '/kui/readme.json', '--close-current-tab', '--status-stripe', 'default']
      }
      loadingDone={() => undefined}
    >
      <ContextWidgets>{kuiVersion()}</ContextWidgets>
      <SpaceFiller />
      <MeterWidgets>{githubIcon()}</MeterWidgets>
    </Kui>
  )
}
