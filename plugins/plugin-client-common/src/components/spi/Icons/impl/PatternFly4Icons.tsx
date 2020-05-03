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
  PlusIcon as Add,
  TerminalIcon as TerminalOnly,
  ColumnsIcon as TerminalPlusSidecar,
  WindowCloseIcon,
  ExpandArrowsAltIcon as WindowMaximizeIcon,
  CompressArrowsAltIcon as WindowMinimizeIcon,
  ToolsIcon as Settings,
  TrashAltIcon as Trash,
  LevelUpAltIcon as Up,
  ServerIcon as Server,
  AtIcon as At,
  CodeBranchIcon as CodeBranch,
  ArrowLeftIcon as Back,
  ArrowRightIcon as Forward,
  InfoCircleIcon as Info,
  WarningTriangleIcon as Warning,
  ExclamationTriangleIcon as ErrorIcon,
  ListIcon as List,
  ThIcon as Grid,
  CaretLeftIcon as PreviousPage,
  CaretRightIcon as NextPage,
  NetworkWiredIcon as Network
} from '@patternfly/react-icons'

import { Props } from '..'

const size20 = { fontSize: '0.875em' }
const size32 = { fontSize: '32px', padding: '5px' }
const Sidecar = { fontSize: '1.125em' }
const StatusStripe = Sidecar

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
    case 'Error':
      return <ErrorIcon {...props} />
    case 'Forward':
      return <Forward style={Sidecar} {...props} />
    case 'Grid':
      return <Grid {...props} />
    case 'Info':
      return <Info {...props} />
    case 'List':
      return <List {...props} />
    case 'PreviousPage':
      return <PreviousPage {...props} />
    case 'Network':
      return <Network {...props} />
    case 'NextPage':
      return <NextPage {...props} />
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
      return <WindowCloseIcon style={Sidecar} {...props} />
    case 'WindowMaximize':
      return <WindowMaximizeIcon style={Sidecar} {...props} />
    case 'WindowMinimize':
      return <WindowMinimizeIcon style={Sidecar} {...props} />
  }

  // this bit of magic ensures exhaustiveness of the switch;
  // reference: https://stackoverflow.com/a/39419171
  return assertUnreachable(props.icon)
}
