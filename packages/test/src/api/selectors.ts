export const CURRENT_TAB = 'tab.visible'
export const TAB_N = (N: number) => `tab:nth-child(${N})`
export const TAB_SELECTED_N = (N: number) => `${TAB_N(N)}.visible`

export const SIDECAR_BASE = `${CURRENT_TAB} sidecar`
export const SIDECAR_FULLSCREEN = `${CURRENT_TAB}.sidecar-full-screen sidecar.visible:not(.minimized)`
export const PROMPT_BLOCK = `${CURRENT_TAB} .repl .repl-block`
export const BOTTOM_PROMPT_BLOCK = `.kui--input-stripe .repl-block`
export const BOTTOM_PROMPT = `${BOTTOM_PROMPT_BLOCK} input`
export const OOPS = `${CURRENT_TAB} .repl .repl-block .oops`
export const SIDECAR = `${SIDECAR_BASE}.visible:not(.minimized)`
export const SIDECAR_WITH_FAILURE = `${SIDECAR_BASE}.visible.activation-success-false`
export const SIDECAR_HIDDEN = `${SIDECAR_BASE}:not(.visible)`
export const SIDECAR_ACTIVATION_TITLE = `${SIDECAR} .sidecar-header-name .entity-name-hash`
export const SIDECAR_TITLE = `${SIDECAR} .sidecar-header-name-content .entity-name`
export const SIDECAR_PACKAGE_NAME_TITLE = `${SIDECAR} .sidecar-bottom-stripe .package-prefix`
export const SIDECAR_POPUP_TITLE = SIDECAR_TITLE
export const SIDECAR_KIND = `${SIDECAR} .sidecar-bottom-stripe .sidecar-header-icon`
export const SIDECAR_CONTENT = `${SIDECAR} .sidecar-content`
export const SIDECAR_WEB_ACTION_URL = `${SIDECAR} .sidecar-header .entity-web-export-url.has-url`
export const SIDECAR_ACTION_SOURCE = `${SIDECAR_CONTENT} .action-content .action-source`
export const SIDECAR_PACKAGE_PARAMETERS = `${SIDECAR_CONTENT} .package-content .package-source`
export const SIDECAR_ACTIVATION_RESULT = `${SIDECAR_CONTENT} .activation-result`
export const SIDECAR_ACTIVATION_ID = `${SIDECAR} .sidecar-header .entity-name-hash`
export const SIDECAR_RULE_CANVAS = `${SIDECAR} .rule-components`
export const SIDECAR_RULE_CANVAS_NODES = `${SIDECAR_RULE_CANVAS} .sequence-component`
export const SIDECAR_SEQUENCE_CANVAS = `${SIDECAR} #wskflowSVG`
export const SIDECAR_SEQUENCE_CANVAS_NODES = `${SIDECAR_SEQUENCE_CANVAS} .node.action`
export const SIDECAR_SEQUENCE_CANVAS_NODE_N = (N: number) => `${SIDECAR_SEQUENCE_CANVAS_NODES}[data-task-index="${N}"]`
export const SIDECAR_LIMIT = (type: string) => `${SIDECAR} .sidecar-header .limits .limit[data-limit-type="${type}"]`
export const SIDECAR_BADGES = `${SIDECAR} .sidecar-header .badges`
export const SIDECAR_TOOLBAR = `${SIDECAR} .sidecar-bottom-stripe-toolbar`
export const SIDECAR_TOOLBAR_TEXT = (type: string) =>
  `${SIDECAR_TOOLBAR} .sidecar-toolbar-text[data-type="${type}"] .sidecar-toolbar-text-content`
export const SIDECAR_TOOLBAR_BUTTON = (mode: string) =>
  `${SIDECAR_TOOLBAR} .sidecar-bottom-stripe-mode-bits .sidecar-bottom-stripe-button[data-mode="${mode}"] [role="tab"]`
export const SIDECAR_CUSTOM_CONTENT = `${SIDECAR} .custom-content`

export const SIDECAR_MODE_BUTTONS = `${SIDECAR} .sidecar-bottom-stripe-mode-bits .sidecar-bottom-stripe-button` // all mode buttons in the bottom stripe
export const SIDECAR_MODE_BUTTON = (mode: string) => `${SIDECAR_MODE_BUTTONS}[data-mode="${mode}"]` // specific mode button in the bottom stripe
export const SIDECAR_MODE_BUTTON_SELECTED = (mode: string) =>
  `${SIDECAR_MODE_BUTTON(mode)}.bx--tabs__nav-item--selected`

// left nav sidecar
export const SIDECAR_MODE_BUTTONS_V2 = `${SIDECAR} .bx--side-nav__menu .bx--side-nav__link` // all mode buttons in the left nav
export const SIDECAR_MODE_BUTTON_V2 = (mode: string) => `${SIDECAR_MODE_BUTTONS_V2}[data-mode="${mode}"]` // specific mode button in the left nav
export const SIDECAR_MODE_BUTTON_SELECTED_V2 = (mode: string) =>
  `${SIDECAR_MODE_BUTTON_V2(mode)}.bx--side-nav__link--current`

export const SIDECAR_BACK_BUTTON = `${SIDECAR} .sidecar-bottom-stripe-back-button` // back button in the bottom stripe
export const SIDECAR_MAXIMIZE_BUTTON = `${SIDECAR} .toggle-sidecar-maximization-button` // maximize button in the bottom stripe
export const SIDECAR_CLOSE_BUTTON = `${SIDECAR} .sidecar-bottom-stripe-close` // close button in the bottom stripe
export const SIDECAR_RESUME_FROM_CLOSE_BUTTON = `${SIDECAR_BASE} .sidecar-bottom-stripe-close` // resume button in minimized mode
export const SIDECAR_FULLY_CLOSE_BUTTON = `${SIDECAR} .sidecar-bottom-stripe-quit` // fully close button in the bottom stripe
export const PROCESSING_PROMPT_BLOCK = `${PROMPT_BLOCK}.repl-active`
export const CURRENT_PROMPT_BLOCK = `${PROMPT_BLOCK}.repl-active`
export const PROMPT_BLOCK_N = (N: number) => `${PROMPT_BLOCK}[data-input-count="${N}"]`
export const PROCESSING_N = (N: number) => `${PROMPT_BLOCK_N(N)}.processing`
export const CURRENT_PROMPT = `${CURRENT_PROMPT_BLOCK} input`
export const PROMPT_N = (N: number) => `${PROMPT_BLOCK_N(N)} input`
export const OUTPUT_N = (N: number) => `${PROMPT_BLOCK_N(N)} .repl-result`
export const OUTPUT_N_STREAMING = (N: number) => `${PROMPT_BLOCK_N(N)} [data-stream]`
export const PROMPT_BLOCK_LAST = `${PROMPT_BLOCK}:nth-last-child(2)`
export const PROMPT_BLOCK_FINAL = `${PROMPT_BLOCK}:nth-last-child(1)`
export const PROMPT_FINAL = `${PROMPT_BLOCK_FINAL} input`
export const OUTPUT_LAST = `${PROMPT_BLOCK_LAST} .repl-result`
export const LIST_RESULTS_N = (N: number) => `${PROMPT_BLOCK_N(N)} .repl-result tbody tr`
export const LIST_RESULTS_BY_NAME_N = (N: number) => `${LIST_RESULTS_N(N)} .entity-name`
export const LIST_RESULT_BY_N_FOR_NAME = (N: number, name: string) => `${LIST_RESULTS_N(N)}[data-name="${name}"]`
export const TABLE_HEADER_CELL = (cellKey: string) => `thead tr th[data-key="${cellKey}"]`
export const TABLE_CELL = (rowKey: string, cellKey: string) => `tbody [data-name="${rowKey}"] [data-key="${cellKey}"]`
export const BY_NAME = (name: string) => `tbody [data-name="${name}"]`
export const LIST_RESULT_BY_N_AND_NAME = (N: number, name: string) =>
  `${LIST_RESULT_BY_N_FOR_NAME(N, name)} .entity-name`
export const OK_N = (N: number) => `${PROMPT_BLOCK_N(N)} .repl-output .ok`
export const xtermRows = (N: number) => `${PROMPT_BLOCK_N(N)} .xterm-container .xterm-rows`
