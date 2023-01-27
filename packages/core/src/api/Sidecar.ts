/*
 * Copyright 2023 The Kubernetes Authors
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

export { ToolbarText, ToolbarAlert, isSupportedToolbarTextType } from '../webapp/views/toolbar-text'

export {
  SidecarModeFilter as ModeFilter,
  ModeDeclaration,
  ModeRegistration,
  registerModeWhen,
  registerSidecarMode as registerMode,
  apply as addRelevantModes
} from '../webapp/views/registrar/modes'

export {
  Badge,
  BadgeSpec,
  BadgeRegistration,
  registerSidecarBadge as registerBadge,
  registrar as badgeRegistrar
} from '../webapp/views/registrar/badges'
