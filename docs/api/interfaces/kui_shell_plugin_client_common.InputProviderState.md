[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / InputProviderState

# Interface: InputProviderState

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).InputProviderState

## Table of contents

### Properties

- [counter](kui_shell_plugin_client_common.InputProviderState.md#counter)
- [durationDom](kui_shell_plugin_client_common.InputProviderState.md#durationdom)
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

### counter

• `Optional` **counter**: `Timeout`

durationDom, used for counting up duration while Processing

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:189](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L189)

---

### durationDom

• `Optional` **durationDom**: `RefObject`<`HTMLSpanElement`\>

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:190](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L190)

---

### execUUID

• `Optional` **execUUID**: `string`

the execution ID for this prompt, if any

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:177](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L177)

---

### isReEdit

• `Optional` **isReEdit**: `boolean`

did user click to re-edit the input?

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:174](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L174)

---

### isearch

• `Optional` **isearch**: `default`

state of active reverse-i-search

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:183](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L183)

---

### model

• **model**: `BlockModel`

Copy from props; to help with getDerivedStateFromProps

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:165](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L165)

---

### multiline

• `Optional` **multiline**: `boolean`

is the input in multi-line mode? if true, use text area rather than in-line input

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:168](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L168)

---

### pasteMultiLineTexts

• `Optional` **pasteMultiLineTexts**: `string`

did user paste multiline texts

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:171](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L171)

---

### prompt

• `Optional` **prompt**: `InputElement`

DOM element for prompt; set via `ref` in render() below

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:180](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L180)

---

### tabCompletion

• `Optional` **tabCompletion**: `TabCompletionState`

state of tab completion

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:186](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L186)

---

### typeahead

• `Optional` **typeahead**: `string`

typeahead completion?

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:193](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L193)
