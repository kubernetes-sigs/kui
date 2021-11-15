[Kui API Documentation - v10.8.0](../README.md) / @kui-shell/plugin-client-common

# Module: @kui-shell/plugin-client-common

## Table of contents

### Classes

- [ContextWidgets](../classes/kui_shell_plugin_client_common.ContextWidgets.md)
- [CurrentWorkingDirectory](../classes/kui_shell_plugin_client_common.CurrentWorkingDirectory.md)
- [FancyPipeline](../classes/kui_shell_plugin_client_common.FancyPipeline.md)
- [HTMLDom](../classes/kui_shell_plugin_client_common.HTMLDom.md)
- [InputProvider](../classes/kui_shell_plugin_client_common.InputProvider.md)
- [Kui](../classes/kui_shell_plugin_client_common.Kui.md)
- [MeterWidgets](../classes/kui_shell_plugin_client_common.MeterWidgets.md)
- [Settings](../classes/kui_shell_plugin_client_common.Settings.md)
- [StatusStripe](../classes/kui_shell_plugin_client_common.StatusStripe.md)
- [StatusVisualizer](../classes/kui_shell_plugin_client_common.StatusVisualizer.md)
- [TabContainer](../classes/kui_shell_plugin_client_common.TabContainer.md)
- [TabContent](../classes/kui_shell_plugin_client_common.TabContent.md)
- [TabModel](../classes/kui_shell_plugin_client_common.TabModel.md)
- [TextWithIconWidget](../classes/kui_shell_plugin_client_common.TextWithIconWidget.md)

### Interfaces

- [DropDownAction](../interfaces/kui_shell_plugin_client_common.DropDownAction.md)
- [InputProviderState](../interfaces/kui_shell_plugin_client_common.InputProviderState.md)
- [TextWithIconWidgetOptions](../interfaces/kui_shell_plugin_client_common.TextWithIconWidgetOptions.md)
- [TextWithIconWidgetProps](../interfaces/kui_shell_plugin_client_common.TextWithIconWidgetProps.md)

### Type aliases

- [InputProviderProps](kui_shell_plugin_client_common.md#inputproviderprops)
- [KuiProps](kui_shell_plugin_client_common.md#kuiprops)
- [SplitPosition](kui_shell_plugin_client_common.md#splitposition)
- [ViewLevel](kui_shell_plugin_client_common.md#viewlevel)

### Properties

- [KuiContext](kui_shell_plugin_client_common.md#kuicontext)

### Variables

- [Alert](kui_shell_plugin_client_common.md#alert)
- [Ansi](kui_shell_plugin_client_common.md#ansi)
- [Button](kui_shell_plugin_client_common.md#button)
- [Card](kui_shell_plugin_client_common.md#card)
- [DropDown](kui_shell_plugin_client_common.md#dropdown)
- [Icons](kui_shell_plugin_client_common.md#icons)
- [LeftNavSidecar](kui_shell_plugin_client_common.md#leftnavsidecar)
- [Markdown](kui_shell_plugin_client_common.md#markdown)
- [Popover](kui_shell_plugin_client_common.md#popover)
- [Select](kui_shell_plugin_client_common.md#select)
- [Tag](kui_shell_plugin_client_common.md#tag)
- [TagWidget](kui_shell_plugin_client_common.md#tagwidget)
- [TopNavSidecar](kui_shell_plugin_client_common.md#topnavsidecar)

### Functions

- [DropdownWidget](kui_shell_plugin_client_common.md#dropdownwidget)
- [Loading](kui_shell_plugin_client_common.md#loading)
- [SpaceFiller](kui_shell_plugin_client_common.md#spacefiller)
- [Tooltip](kui_shell_plugin_client_common.md#tooltip)
- [allocateTabUUID](kui_shell_plugin_client_common.md#allocatetabuuid)
- [defaultOnKeyDown](kui_shell_plugin_client_common.md#defaultonkeydown)
- [defaultOnKeyPress](kui_shell_plugin_client_common.md#defaultonkeypress)
- [defaultOnKeyUp](kui_shell_plugin_client_common.md#defaultonkeyup)
- [inDebugMode](kui_shell_plugin_client_common.md#indebugmode)

## Type aliases

### InputProviderProps

Ƭ **InputProviderProps**: `InputOptions` & `InputProps` & `BlockViewTraits`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:161](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L161)

---

### KuiProps

Ƭ **KuiProps**: `Partial`<`KuiConfiguration`\> & `CommonClientProps` & { `bottomInput?`: `true` \| `React.ReactNode` ; `initialTabTitle?`: `string` ; `noBootstrap?`: `boolean` ; `quietExecCommand?`: `boolean` ; `toplevel?`: `React.ReactNode` \| `React.ReactNode`[] }

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:43](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L43)

---

### SplitPosition

Ƭ **SplitPosition**: `NewSplitRequest`[`"options"`][``"position"``]

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/SplitPosition.ts:19](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/SplitPosition.ts#L19)

---

### ViewLevel

Ƭ **ViewLevel**: `"loading"` \| `"removed"` \| `"hidden"` \| `"normal"` \| `"obscured"` \| `"ok"` \| `"warn"` \| `"error"` \| `"info"`

variants of how the information should be presented

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:24](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L24)

## Properties

### KuiContext

• **KuiContext**: `Context`<`KuiConfiguration`\>

## Variables

### Alert

• **Alert**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:65](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L65)

---

### Ansi

• **Ansi**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:55](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L55)

---

### Button

• **Button**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:66](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L66)

---

### Card

• **Card**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:67](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L67)

---

### DropDown

• **DropDown**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:72](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L72)

---

### Icons

• **Icons**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:71](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L71)

---

### LeftNavSidecar

• **LeftNavSidecar**: `LazyExoticComponent`<typeof `default`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:62](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L62)

---

### Markdown

• **Markdown**: `LazyExoticComponent`<typeof `default`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:57](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L57)

---

### Popover

• **Popover**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:68](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L68)

---

### Select

• **Select**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:69](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L69)

---

### Tag

• **Tag**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:70](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L70)

---

### TagWidget

• **TagWidget**: `LazyExoticComponent`<`fn`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:49](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L49)

---

### TopNavSidecar

• **TopNavSidecar**: `LazyExoticComponent`<typeof `default`\>

#### Defined in

[plugins/plugin-client-common/src/index.ts:61](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L61)

## Functions

### DropdownWidget

▸ **DropdownWidget**(`props`): `Element`

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `props` | `Props` |

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/DropdownWidget.tsx:33](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/StatusStripe/DropdownWidget.tsx#L33)

---

### Loading

▸ **Loading**(`props`): `React.ReactElement`

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `props` | `default` |

#### Returns

`React.ReactElement`

#### Defined in

[plugins/plugin-client-common/src/components/spi/Loading/index.tsx:22](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/spi/Loading/index.tsx#L22)

---

### SpaceFiller

▸ **SpaceFiller**(): `Element`

This components can be used as a space filler in your StatusStripe.

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/SpaceFiller.tsx:23](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/StatusStripe/SpaceFiller.tsx#L23)

---

### Tooltip

▸ **Tooltip**(`props`): `React.ReactElement`

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `props` | `Props` |

#### Returns

`React.ReactElement`

#### Defined in

[plugins/plugin-client-common/src/components/spi/Tooltip/index.tsx:24](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/spi/Tooltip/index.tsx#L24)

---

### allocateTabUUID

▸ **allocateTabUUID**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:21](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L21)

---

### defaultOnKeyDown

▸ **defaultOnKeyDown**(`event`): `void`

#### Parameters

| Name    | Type            |
| :------ | :-------------- |
| `event` | `KeyboardEvent` |

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/OnKeyDown.ts:98](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/OnKeyDown.ts#L98)

---

### defaultOnKeyPress

▸ **defaultOnKeyPress**(`event`): `Promise`<`void`\>

#### Parameters

| Name    | Type            |
| :------ | :-------------- |
| `event` | `KeyboardEvent` |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/OnKeyPress.ts:21](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/OnKeyPress.ts#L21)

---

### defaultOnKeyUp

▸ **defaultOnKeyUp**(`evt`): `Promise`<`void`\>

Listen for ctrl+R

#### Parameters

| Name  | Type                        |
| :---- | :-------------------------- |
| `evt` | `KeyboardEvent`<`Element`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/ActiveISearch.tsx:181](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/ActiveISearch.tsx#L181)

---

### inDebugMode

▸ **inDebugMode**(): `string` \| `true`

#### Returns

`string` \| `true`

#### Defined in

[plugins/plugin-client-common/src/index.ts:88](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/index.ts#L88)
