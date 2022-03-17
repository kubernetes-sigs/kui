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

const PatternFly = React.lazy(() => import('./impl/PatternFly'))

export type SupportedIcon =
  | 'Add'
  | 'At'
  | 'Back'
  | 'ChartBar'
  | 'Checkmark'
  | 'CodeBranch'
  | 'Contrast'
  | 'Copy'
  | 'Current'
  | 'Edit'
  | 'Clear'
  | 'Error'
  | 'Eye'
  | 'EyeSlash'
  | 'Forward'
  | 'Grid'
  | 'Github'
  | 'Guidebook'
  | 'Hamburger'
  | 'Help'
  | 'Info'
  | 'InProgress'
  | 'List'
  | 'Link'
  | 'Lightbulb'
  | 'Location'
  | 'MoveUp'
  | 'MoveDown'
  | 'Network'
  | 'NextPage'
  | 'Notification'
  | 'Pause'
  | 'Play'
  | 'PreviousPage'
  | 'Retry'
  | 'Revert'
  | 'Save'
  | 'Section'
  | 'Screenshot'
  | 'ScreenshotInProgress'
  | 'Search'
  | 'Server'
  | 'Settings'
  | 'Sequence'
  | 'Split'
  | 'Trash'
  | 'Terminal'
  | 'TerminalOnly'
  | 'Theme'
  | 'Unknown'
  | 'Up'
  | 'Warning'
  | 'Waiting'
  | 'WindowMaximize'
  | 'WindowMinimize'
  | 'WindowClose'

export interface Props extends Record<string, any> {
  icon: SupportedIcon
  className?: string
}

export default function iconImpl(props: Props): React.ReactElement {
  return <PatternFly {...props} />
}
