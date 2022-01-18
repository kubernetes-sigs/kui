[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / InputProviderState

# Interface: InputProviderState

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).InputProviderState

## Table of contents

### Properties

- [execUUID](kui_shell_plugin_client_common.InputProviderState.md#execuuid)
- [isReEdit](kui_shell_plugin_client_common.InputProviderState.md#isreedit)
- [isearch](kui_shell_plugin_client_common.InputProviderState.md#isearch)
- [model](kui_shell_plugin_client_common.InputProviderState.md#model)
- [multiline](kui_shell_plugin_client_common.InputProviderState.md#multiline)
- [pasteMultiLineTexts](kui_shell_plugin_client_common.InputProviderState.md#pastemultilinetexts)
- [prompt](kui_shell_plugin_client_common.InputProviderState.md#prompt)
- [tabCompletion](kui_shell_plugin_client_common.InputProviderState.md#tabcompletion)
- [typeahead](kui_shell_plugin_client_common.InputProviderState.md#typeahead)

## Properties

### execUUID

• `Optional` **execUUID**: `string`

the execution ID for this prompt, if any

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:176](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L176)

---

### isReEdit

• `Optional` **isReEdit**: `boolean`

did user click to re-edit the input?

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:173](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L173)

---

### isearch

• `Optional` **isearch**: `default`

state of active reverse-i-search

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:182](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L182)

---

### model

• **model**: `BlockModel`

Copy from props; to help with getDerivedStateFromProps

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:164](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L164)

---

### multiline

• `Optional` **multiline**: `boolean`

is the input in multi-line mode? if true, use text area rather than in-line input

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:167](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L167)

---

### pasteMultiLineTexts

• `Optional` **pasteMultiLineTexts**: `string`

did user paste multiline texts

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:170](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L170)

---

### prompt

• `Optional` **prompt**: `InputElement`

DOM element for prompt; set via `ref` in render() below

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:179](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L179)

---

### tabCompletion

• `Optional` **tabCompletion**: `TabCompletionState`

state of tab completion

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:185](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L185)

---

### typeahead

• `Optional` **typeahead**: `string`

typeahead completion?

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:188](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L188)
