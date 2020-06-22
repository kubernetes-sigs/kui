/*
 * Copyright 2019-20 IBM Corporation
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

// Capabilities
export {
  hasProxy,
  getValidCredentials,
  inBrowser,
  inElectron,
  isHeadless,
  inSandbox,
  assertInSandbox,
  assertLocalAccess,
  assertHasProxy,
  setHasAuth,
  getAuthValue
} from './core/capabilities'
export { CapabilityRegistration } from './models/plugin'

// Commands
export {
  CommandOptions,
  CommandLine,
  Evaluator,
  ExecType,
  KResponse,
  ParsedOptions,
  EvaluatorArgs as Arguments,
  Event,
  ViewTransformer,
  CommandRegistrar as Registrar
} from './models/command'
export { optionsToString as unparse } from './core/utility'
export {
  ScalarResponse,
  MetadataNamedResource,
  MixedResponse,
  isMixedResponse,
  RawResponse,
  //  ResourceModification,
  MetadataBearingByReference as ResourceByReference,
  MetadataBearingByReferenceWithContent as ResourceByReferenceWithContent,
  isMetadataBearingByReference as isResourceByReference
} from './models/entity'
export { isCommandHandlerWithEvents } from './models/command'
export { ExecOptions, withLanguage } from './models/execOptions'
export { Streamable, Stream } from './models/streamable'

// Errors
export { isCodedError, CodedError } from './models/errors'
export { isUsageError, UsageError, UsageModel, UsageRow } from './core/usage-error'

// TODO remove these soon; see plugin-client-common/src/components/Scalar/index.ts
export { isMessageWithUsageModel, isMessageWithCode } from './core/usage-error'

// eventChannelUnsafe
export { default as eventChannelUnsafe, wireToStandardEvents, eventBus } from './core/events'

// i18n
export { fromMap as i18nFromMap, default as i18n } from './util/i18n'

// models
export {
  hasDisplayName,
  isMarkdownResponse,
  ReactResponse,
  isReactResponse,
  MetadataBearing as ResourceWithMetadata,
  MetadataBearingWithContent as ResourceWithMetadataWithContent,
  isMetadataBearing as isResourceWithMetadata
} from './models/entity'
export { isWatchable, Watchable, Watcher, WatchPusher } from './core/jobs/watchable'
export { Abortable, FlowControllable } from './core/jobs/job'
import { Tab } from './webapp/tab'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function History(tab: Tab) {
  const model = (await import('./models/history')).default
  return model
}
export { HistoryModel } from './models/history'

// pretty printing
export { prettyPrintTime } from './webapp/util/time'

// registrars
export {
  SidecarModeFilter as ModeFilter,
  ModeRegistration,
  registerModeWhen,
  registerSidecarMode as registerMode,
  apply as addRelevantModes
} from './webapp/views/registrar/modes'
export {
  Badge,
  BadgeSpec,
  BadgeRegistration,
  registerSidecarBadge as registerBadge,
  registrar as badgeRegistrar
} from './webapp/views/registrar/badges'
export { PluginRegistration, PreloadRegistration, PreloadRegistrar } from './models/plugin'

// REPL utils
export { default as REPL } from './models/repl'
export { split, _split, Split } from './repl/split'
export { ReplEval, DirectReplEval } from './repl/types'
export { default as encodeComponent } from './repl/encode'
export { exec as internalBeCarefulExec, pexec as internalBeCarefulPExec, setEvaluatorImpl, doEval } from './repl/exec'
export { CommandStartEvent, CommandCompleteEvent } from './repl/events'

// Tabs
export { Tab, getCurrentTab, pexecInCurrentTab, getTabId, getPrimaryTabId, sameTab } from './webapp/tab'
export { default as TabState } from './models/tab-state'

// Themes
export { default as Theme, ThemeProperties } from './webapp/themes/Theme'
export { findByName as findThemeByName } from './webapp/themes/find'
export { getDefault as getDefaultTheme } from './webapp/themes/default'
export {
  switchTo as switchToTheme,
  getPersistedThemeChoice,
  resetToDefault as resetToDefaultTheme
} from './webapp/themes/persistence'

// CLI
export { Block } from './webapp/models/block'
export { disableInputQueueing } from './webapp/queueing'

// generic UI
export { isPopup } from './webapp/popup-core'
export { removeAllDomChildren as empty } from './webapp/util/dom'
export { default as Presentation } from './webapp/views/presentation'
export {
  ModeOrButton as Mode,
  Button,
  isButton,
  isViewButton,
  Mode as MultiModalMode,
  MultiModalResponse
} from './models/mmr/types'
export { Editable, EditableSpec, SaveError } from './models/editable'
export {
  Breadcrumb,
  NavResponse,
  isNavResponse,
  Link,
  isLink,
  isLinkWithHref,
  isLinkWithCommand,
  Menu
} from './models/NavResponse'
export { isMultiModalResponse } from './models/mmr/is'
export {
  Content,
  hasContent,
  ScalarResource,
  ScalarContent,
  isScalarContent,
  ReactProvider,
  isReactProvider,
  ToolbarProps,
  CommandStringContent,
  isCommandStringContent,
  StringContent,
  isStringWithOptionalContentType,
  isSupportedContentType,
  SupportedStringContent,
  isFunctionContent,
  FunctionThatProducesContent
} from './models/mmr/content-types'
export { ToolbarText, ToolbarAlert, isSupportedToolbarTextType } from './webapp/views/toolbar-text'

// low-level UI
export { default as doCancel } from './webapp/cancel'
export { default as ElementMimic } from './util/element-mimic'
export { keys as KeyCodes, isCursorMovement } from './webapp/keys'

// Plugins
export { commandsOffered as commandsOfferedByPlugin, userHome as pluginUserHome } from './api/plugins'

// Settings
export { userDataDir, uiThemes } from './core/settings'

// Storage for user data
export { default as Store } from './models/store'

// SymbolTable
export { default as SymbolTable } from './core/symbol-table'

// Tables
export { default as CellShould } from './models/CellShould'
export { Icon, TableStyle, Table, Row, Cell, isTable } from './webapp/models/table'
export {
  default as RadioTable,
  isRadioTable,
  RadioTableRow,
  RadioTableCell,
  radioTableHintsAsCss,
  radioTableCellToString,
  cellShouldHaveBadge
} from './models/RadioTable'

// Util
export { findFileWithViewer, findFile, isSpecialDirectory } from './core/find-file'
export { expandHomeDir } from './util/home'
export { flatten } from './core/utility'
export { promiseEach } from './util/async'
export { isHTML, isPromise } from './util/types'

// Electron
export { tellMain } from './webapp/electron-events'

// main
export { main } from './main/main'
export { default as boot, bootIntoSandbox } from './webapp/bootstrap/boot'

// Sessions
export { initializeSession } from './session/init'

// Tab Completion

export {
  registerEnumerator as registerTabCompletionEnumerator,
  TabCompletionSpec,
  CompletionResponse,
  isStringResponse,
  applyEnumerator as findCompletions
} from './repl/tab-completion'

export { default as teeToFile } from './util/tee'
