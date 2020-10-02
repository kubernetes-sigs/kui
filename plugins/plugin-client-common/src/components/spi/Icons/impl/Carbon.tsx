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

import React from 'react'

import {
  CarbonIconType,
  Add20 as Add,
  Terminal32 as TerminalOnly,
  Notebook32 as TerminalPlusSidecar,
  Thumbnail_132 as TerminalPlusWatcher,
  Template32 as TerminalSidecarWatcher,
  Close20 as WindowClose,
  Copy16 as Copy,
  Maximize16 as WindowMaximize,
  Minimize16 as WindowMinimize,
  Camera20 as Screenshot,
  CameraAction20 as ScreenshotInProgress,
  CheckmarkFilled16 as Checkmark,
  Help20 as Help,
  SettingsAdjust20 as Settings,
  TrashCan16 as Trash,
  JumpLink16 as Up,
  ArrowUp16 as MoveUp,
  ArrowDown16 as MoveDown,
  Location16 as Location,
  VirtualMachine16 as Server,
  At16 as At,
  Branch16 as CodeBranch,
  ArrowLeft16 as Back,
  ArrowRight16 as Forward,
  InformationFilled16 as Info,
  WarningAltFilled16 as Warning,
  ErrorFilled16 as ErrorIcon,
  Grid16 as Grid,
  List16 as List,
  PauseOutlineFilled16 as Pause,
  PlayFilled16 as Play,
  Renew16 as Retry,
  Legend16 as Sequence,
  ChartBar16 as ChartBar,
  Edit16 as Edit,
  NotificationNew20 as Notification,
  SplitScreen20 as Split,
  CaretRight20 as NextPage,
  CaretLeft20 as PreviousPage,
  FlashOffFilled20 as Network
} from '@carbon/icons-react'

import { Props, SupportedIcon } from '..'

/** we will handle Up specially below */
const icons: Record<Exclude<SupportedIcon, 'Up'>, CarbonIconType> = {
  At,
  Add,
  Back,
  ChartBar,
  Checkmark,
  CodeBranch,
  Copy,
  Edit,
  Error: ErrorIcon,
  Forward,
  Grid,
  Help,
  Info,
  List,
  MoveUp,
  MoveDown,
  Location,
  Network,
  NextPage,
  Notification,
  Pause,
  Play,
  Retry,
  PreviousPage,
  Screenshot,
  ScreenshotInProgress,
  Server,
  Settings,
  Sequence,
  Split,
  Trash,
  TerminalOnly,
  TerminalPlusSidecar,
  TerminalPlusWatcher,
  TerminalSidecarWatcher,
  Warning,
  WindowMaximize,
  WindowMinimize,
  WindowClose
}

export default function CarbonIcons(props: Props) {
  if (props.icon === 'Up') {
    return <Up {...props} className="kui--rotate-180" />
  } else if (props.icon === 'TerminalSidecarWatcher') {
    return <TerminalSidecarWatcher {...props} className="kui--rotate-180-then-flip" />
  } else {
    return React.createElement(icons[props.icon], props)
  }
}
