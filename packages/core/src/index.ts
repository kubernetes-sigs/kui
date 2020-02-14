/*
 * Copyright 2019 IBM Corporation
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
  CommandRegistrar as Registrar
} from './models/command'
export { optionsToString as unparse } from './core/utility'
export {
  MetadataNamedResource,
  MixedResponse,
  RawResponse,
  ResourceModification,
  MetadataBearingByReference as ResourceByReference,
  MetadataBearingByReferenceWithContent as ResourceByReferenceWithContent,
  isMetadataBearingByReference as isResourceByReference
} from './models/entity'
export { isCommandHandlerWithEvents } from './models/command'
export { ExecOptions, withLanguage } from './models/execOptions'
export { Streamable } from './models/streamable'

// Editor registration
export { hasEditor, tryOpenWithEditor, EditorProvider, registerEditor } from './webapp/views/registrar/editors'

// Errors
export { CodedError } from './models/errors'
export { isUsageError, UsageError, UsageModel, UsageRow } from './core/usage-error'

// eventBus
export { default as eventBus, wireToStandardEvents } from './core/events'

// i18n
export { fromMap as i18nFromMap, default as i18n } from './util/i18n'

// content injection
export { injectCSS, injectScript, loadHTML } from './webapp/util/inject'

// models
export {
  hasDisplayName,
  MetadataBearing as ResourceWithMetadata,
  MetadataBearingWithContent as ResourceWithMetadataWithContent,
  isMetadataBearing as isResourceWithMetadata
} from './models/entity'
export { isWatchable, Watchable, Watcher, WatchPusher } from './core/jobs/watchable'
export { Abortable } from './core/jobs/job'
import { Tab } from './webapp/tab'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function History(tab: Tab) {
  const model = (await import('./models/history')).default
  return model
}

// pretty printing
export { prettyPrintTime } from './webapp/util/time'
export { default as stripAnsi } from './webapp/util/strip-ansi'
export { default as prettyPrintAnsi } from './webapp/util/pretty-print'
export async function AsciiFormatters() {
  const [{ formatUsage }, { preprocessTable, formatTable }] = await Promise.all([
    import(/* webpackMode: "lazy" */ './webapp/util/ascii-to-usage'),
    import(/* webpackMode: "lazy" */ './webapp/util/ascii-to-table')
  ])
  return { formatUsage, preprocessTable, formatTable }
}

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
export {
  getImpl as getReplImpl,
  exec as internalBeCarefulExec,
  pexec as internalBeCarefulPExec,
  setEvaluatorImpl
} from './repl/exec'

export { default as closeAllViews } from './webapp/views/close-all'

// Tabs
export { Tab, getTabFromTarget, getCurrentTab, getTabId, sameTab } from './webapp/tab'
export { default as TabState } from './models/tab-state'

// Themes
export { default as Theme } from './webapp/themes/Theme'
export { findByName as findThemeByName } from './webapp/themes/find'
export { getDefault as getDefaultTheme } from './webapp/themes/default'
export {
  switchTo as switchToTheme,
  getPersistedThemeChoice,
  resetToDefault as resetToDefaultTheme
} from './webapp/themes/persistence'

// CLI
export {
  getPrompt,
  getCurrentPrompt,
  getCurrentPromptLeft,
  getBlockOfPrompt,
  setUsingCustomPrompt,
  unsetUsingCustomPrompt
} from './webapp/prompt'
export {
  isMostRecentBlock,
  getCurrentBlock,
  getCurrentProcessingBlock,
  resetCount,
  setCustomCaret
} from './webapp/block'
export { Block } from './webapp/models/block'
export { setStatus, Status } from './webapp/status'
export { listen as internalBeCarefulListen } from './webapp/listen'
export { disableInputQueueing, pasteQueuedInput } from './webapp/queueing'
export { clearPendingTextSelection, setPendingTextSelection, clearTextSelection } from './webapp/text-selection'

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
export { isMultiModalResponse } from './models/mmr/is'
export {
  Content,
  hasContent,
  ScalarResource,
  ScalarContent,
  isScalarContent,
  CommandStringContent,
  isCommandStringContent,
  StringContent,
  isStringWithOptionalContentType,
  SupportedStringContent,
  isFunctionContent
} from './models/mmr/content-types'
export { ToolbarTextImpl as ToolbarText } from './webapp/views/toolbar-text'

// low-level UI
export { partial as partialInput, isUsingCustomPrompt } from './webapp/prompt'
export { scrollIntoView } from './webapp/scroll'
export { default as doCancel } from './webapp/cancel'
export { default as ElementMimic } from './util/element-mimic'
export { keys as KeyCodes, isCursorMovement } from './webapp/keys'
export {
  buttonExists as topTabButtonExists,
  addIcon as topTabAddIcon,
  removeIcon as topTabRemoveIcon
} from './webapp/views/top-tabs'

// Prompt
export { prompt } from './webapp/prompt-for-input'

// Plugins
export { commandsOffered as commandsOfferedByPlugin, userHome as pluginUserHome } from './api/plugins'

// Settings
export { inBottomInputMode, userDataDir, uiThemes } from './core/settings'

// Storage for user data
export { default as Store } from './models/store'

// SymbolTable
export { default as SymbolTable } from './core/symbol-table'

// Tables
export { Icon, TableStyle, Table, Row, Cell, isTable } from './webapp/models/table'

// Util
export { findFileWithViewer, findFile, isSpecialDirectory, addPath as augmentModuleLoadPath } from './core/find-file'
export { expandHomeDir } from './util/home'
export { flatten } from './core/utility'
export { promiseEach } from './util/async'
export { isHTML, isPromise } from './util/types'

// Electron
export { tellMain } from './webapp/electron-events'

// main
export { main } from './main/main'
export { default as boot } from './webapp/bootstrap/boot'

// View Components
export { KuiComponent } from './webapp/component/component'
export { findComponentProviders } from './webapp/component/registrar'
