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

import KuiContext from '../../Client/context'
import Carbon from './impl/Carbon'
import PatternFly from './impl/PatternFly'

export type SupportedIcon =
  | 'Add'
  | 'At'
  | 'Back'
  | 'Checkmark'
  | 'CodeBranch'
  | 'Edit'
  | 'Error'
  | 'Forward'
  | 'Grid'
  | 'Info'
  | 'List'
  | 'Location'
  | 'Network'
  | 'NextPage'
  | 'Notification'
  | 'Pause'
  | 'Play'
  | 'Retry'
  | 'PreviousPage'
  | 'Screenshot'
  | 'ScreenshotInProgress'
  | 'Server'
  | 'Settings'
  | 'Sequence'
  | 'Split'
  | 'Trash'
  | 'TerminalOnly'
  | 'TerminalPlusSidecar'
  | 'TerminalPlusWatcher'
  | 'TerminalSidecarWatcher'
  | 'Up'
  | 'Warning'
  | 'WindowMaximize'
  | 'WindowMinimize'
  | 'WindowClose'

export interface Props extends Record<string, any> {
  icon: SupportedIcon
  className?: string
}

export default function iconImpl(props: Props): React.ReactElement {
  if (props.icon === 'TerminalPlusWatcher' || props.icon === 'TerminalSidecarWatcher') {
    return <Carbon {...props} />
  }
  return (
    <KuiContext.Consumer>
      {config => (config.components === 'patternfly' ? <PatternFly {...props} /> : <Carbon {...props} />)}
    </KuiContext.Consumer>
  )
}
