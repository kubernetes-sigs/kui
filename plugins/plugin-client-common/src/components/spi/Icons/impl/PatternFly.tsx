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
  AdjustIcon as Contrast,
  OutlinedDotCircleIcon as Waiting,
  EraserIcon as Clear,
  CameraIcon as Screenshot,
  CameraRetroIcon as ScreenshotInProgress,
  CheckCircleIcon as Checkmark,
  ChartBarIcon as ChartBar,
  CopyIcon as Copy,
  PlusIcon as Add,
  OutlinedWindowMaximizeIcon /* TerminalIcon */ as TerminalOnly,
  ColumnsIcon as TerminalPlusSidecar,
  TimesIcon /* WindowCloseIcon */ as WindowClose,
  EditIcon as Edit,
  InProgressIcon as InProgress,
  ExpandIcon as WindowMaximize,
  CompressIcon as WindowMinimize,
  QuestionCircleIcon /* ToolsIcon */ as Help,
  SlidersHIcon as Settings,
  TrashAltIcon as Trash,
  LevelUpAltIcon as Up,
  LinkIcon as Link,
  LockIcon as Lock,
  ArrowUpIcon as MoveUp,
  ArrowDownIcon as MoveDown,
  MapMarkerAltIcon as Location,
  ServerIcon as Server,
  EyeIcon as Eye,
  EyeSlashIcon as EyeSlash,
  AtIcon as At,
  ResourcesFullIcon as Current,
  CodeBranchIcon as CodeBranch,
  ArrowLeftIcon as Back,
  ArrowRightIcon as Forward,
  InfoCircleIcon as Info,
  ExclamationTriangleIcon as Warning,
  ExclamationCircleIcon as Oops,
  ListIcon as List,
  LightbulbIcon as Lightbulb,
  ThIcon as Grid,
  PaletteIcon as Theme,
  GithubIcon as Github,
  CaretLeftIcon as PreviousPage,
  CaretRightIcon as NextPage,
  NetworkWiredIcon as Network,
  PauseCircleIcon as Pause,
  RebootingIcon as Retry,
  HistoryIcon as Revert,
  SaveIcon as Save,
  SlidersHIcon as Sequence,
  SearchIcon as Search,
  BellIcon as Notification,
  PlayCircleIcon as Play
} from '@patternfly/react-icons'

import { Props } from '..'

const size20 = { fontSize: '1rem' }
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
    case 'ChartBar':
      return <ChartBar {...props} />
    case 'Checkmark':
      return <Checkmark {...props} />
    case 'CodeBranch':
      return <CodeBranch style={StatusStripe} {...props} />
    case 'Contrast':
      return <Contrast {...props} />
    case 'Copy':
      return <Copy {...props} />
    case 'Current':
      return <Current {...props} />
    case 'Edit':
      return <Edit {...props} />
    case 'Clear':
      return <Clear {...props} />
    case 'Error':
      return <Oops {...props} />
    case 'Eye':
      return <Eye {...props} />
    case 'EyeSlash':
      return <EyeSlash {...props} />
    case 'Forward':
      return <Forward style={Sidecar} {...props} />
    case 'Grid':
      return <Grid {...props} />
    case 'Github':
      return <Github {...props} />
    case 'Help':
      return <Help style={size20} {...props} />
    case 'Info':
      return <Info {...props} />
    case 'InProgress':
      return <InProgress {...props} />
    case 'List':
      return <List {...props} />
    case 'Link':
      return <Link {...props} />
    case 'Lightbulb':
      return <Lightbulb {...props} />
    case 'Location':
      return <Location {...props} />
    case 'Lock':
      return <Lock {...props} />
    case 'MoveUp':
      return <MoveUp {...props} />
    case 'MoveDown':
      return <MoveDown {...props} />
    case 'Pause':
      return <Pause {...props} />
    case 'Play':
      return <Play {...props} />
    case 'PreviousPage':
      return <PreviousPage style={Pagination} {...props} />
    case 'Retry':
      return <Retry {...props} />
    case 'Revert':
      return <Revert {...props} />
    case 'Save':
      return <Save {...props} />
    case 'Section':
      return <div {...props}>&sect;</div>
    case 'Network':
      return <Network {...props} />
    case 'NextPage':
      return <NextPage style={Pagination} {...props} />
    case 'Notification':
      return <Notification {...props} />
    case 'Server':
      return <Server {...props} />
    case 'Settings':
      return <Settings style={size20} {...props} />
    case 'Sequence':
      return <Sequence {...props} />
    case 'Screenshot':
      return <Screenshot {...props} />
    case 'ScreenshotInProgress':
      return <ScreenshotInProgress {...props} />
    case 'Split':
      return <TerminalPlusSidecar style={size20} {...props} />
    case 'Search':
      return <Search style={size20} {...props} />
    case 'Trash':
      return <Trash {...props} />
    case 'TerminalOnly':
      return <TerminalOnly style={size32} {...props} />
    case 'Theme':
      return <Theme {...props} />
    case 'Warning':
      return <Warning {...props} />
    case 'Up':
      return <Up {...props} />
    case 'Waiting':
      return <Waiting {...props} />
    case 'WindowClose':
      return <WindowClose style={Sidecar} {...props} />
    case 'WindowMaximize':
      return <WindowMaximize style={Sidecar} {...props} />
    case 'WindowMinimize':
      return <WindowMinimize style={Sidecar} {...props} />
  }

  // this bit of magic ensures exhaustiveness of the switch;
  // reference: https://stackoverflow.com/a/39419171
  return assertUnreachable(props.icon)
}
