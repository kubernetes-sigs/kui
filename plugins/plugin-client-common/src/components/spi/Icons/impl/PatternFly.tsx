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

import {
  CameraIcon as Screenshot,
  CameraRetroIcon as ScreenshotInProgress,
  CheckCircleIcon as Checkmark,
  PlusIcon as Add,
  OutlinedWindowMaximizeIcon /* TerminalIcon */ as TerminalOnly,
  ColumnsIcon as TerminalPlusSidecar,
  TimesIcon /* WindowCloseIcon */ as WindowClose,
  ExpandIcon as WindowMaximize,
  CompressIcon as WindowMinimize,
  QuestionCircleIcon /* ToolsIcon */ as Settings,
  TrashAltIcon as Trash,
  LevelUpAltIcon as Up,
  ServerIcon as Server,
  AtIcon as At,
  CodeBranchIcon as CodeBranch,
  ArrowLeftIcon as Back,
  ArrowRightIcon as Forward,
  InfoCircleIcon as Info,
  ExclamationTriangleIcon as Warning,
  BombIcon as Oops,
  ListIcon as List,
  ThIcon as Grid,
  CaretLeftIcon as PreviousPage,
  CaretRightIcon as NextPage,
  NetworkWiredIcon as Network,
  PauseCircleIcon as Pause,
  RebootingIcon as Retry,
  PlayCircleIcon as Play
} from '@patternfly/react-icons'

import { Props } from '..'

const size20 = { fontSize: '0.875em' }
const size32 = { fontSize: '32px', padding: '3px' }
const Sidecar = { fontSize: '1.125em' }
const StatusStripe = Sidecar
const Pagination = { fontSize: '1.5em' }

/** helper to ensure exhaustiveness of the switch statement below */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertUnreachable(x: never): never {
  throw new Error('Did not expect to get here')
}

export default function PatternFly4Icons(props: Props) {
  switch (props.icon) {
    case 'At':
      return <At style={StatusStripe} {...props} />
    case 'Add':
      return <Add style={size20} {...props} />
    case 'Back':
      return <Back style={Sidecar} {...props} />
    case 'CodeBranch':
      return <CodeBranch style={StatusStripe} {...props} />
    case 'Checkmark':
      return <Checkmark {...props} />
    case 'Error':
      return <Oops {...props} />
    case 'Forward':
      return <Forward style={Sidecar} {...props} />
    case 'Grid':
      return <Grid {...props} />
    case 'Info':
      return <Info {...props} />
    case 'List':
      return <List {...props} />
    case 'Pause':
      return <Pause {...props} />
    case 'Play':
      return <Play {...props} />
    case 'Retry':
      return <Retry {...props} />
    case 'PreviousPage':
      return <PreviousPage style={Pagination} {...props} />
    case 'Network':
      return <Network {...props} />
    case 'NextPage':
      return <NextPage style={Pagination} {...props} />
    case 'Server':
      return <Server {...props} />
    case 'Settings':
      return <Settings {...props} />
    case 'Screenshot':
      return <Screenshot {...props} />
    case 'ScreenshotInProgress':
      return <ScreenshotInProgress {...props} />
    case 'Trash':
      return <Trash {...props} />
    case 'TerminalOnly':
      return <TerminalOnly style={size32} {...props} />
    case 'TerminalPlusSidecar':
      return <TerminalPlusSidecar style={size32} {...props} />
    case 'Warning':
      return <Warning {...props} />
    case 'Up':
      return <Up {...props} />
    case 'WindowClose':
      return <WindowClose style={Sidecar} {...props} />
    case 'WindowMaximize':
      return <WindowMaximize style={Sidecar} {...props} />
    case 'WindowMinimize':
      return <WindowMinimize style={Sidecar} {...props} />

    // there's no icon for `TerminalPlusWatcher` and
    // `TerminalSidecarWatcher` in Patternfly, so we use carbon
    // icons for now
    case 'TerminalPlusWatcher':
      return <div />
    case 'TerminalSidecarWatcher':
      return <div />
  }

  // this bit of magic ensures exhaustiveness of the switch;
  // reference: https://stackoverflow.com/a/39419171
  return assertUnreachable(props.icon)
}
