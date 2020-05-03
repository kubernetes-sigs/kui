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
  CarbonIconType,
  Add20 as Add,
  Terminal32 as TerminalOnly,
  Notebook32 as TerminalPlusSidecar,
  Close20 as WindowClose,
  Maximize16 as WindowMaximize,
  Minimize16 as WindowMinimize,
  Camera20 as Screenshot,
  CameraAction20 as ScreenshotInProgress,
  SettingsAdjust20 as Settings,
  TrashCan16 as Trash,
  JumpLink16 as Up,
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
  CodeBranch,
  Error: ErrorIcon,
  Forward,
  Grid,
  Info,
  List,
  Network,
  NextPage,
  PreviousPage,
  Screenshot,
  ScreenshotInProgress,
  Server,
  Settings,
  Trash,
  TerminalOnly,
  TerminalPlusSidecar,
  Warning,
  WindowMaximize,
  WindowMinimize,
  WindowClose
}

export default function CarbonIcons(props: Props) {
  if (props.icon === 'Up') {
    return <Up {...props} className="kui--rotate-180" />
  } else {
    return React.createElement(icons[props.icon], props)
  }
}
