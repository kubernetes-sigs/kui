[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / TabState

# Class: TabState

[@kui-shell/core](../modules/kui_shell_core.md).TabState

State that we want to keep per tab

## Table of contents

### Constructors

- [constructor](kui_shell_core.TabState.md#constructor)

### Properties

- [\_state](kui_shell_core.TabState.md#_state)
- [captures](kui_shell_core.TabState.md#captures)
- [closed](kui_shell_core.TabState.md#closed)
- [ready](kui_shell_core.TabState.md#ready)
- [restores](kui_shell_core.TabState.md#restores)
- [switchTos](kui_shell_core.TabState.md#switchtos)
- [uuid](kui_shell_core.TabState.md#uuid)

### Accessors

- [desiredStatusStripeDecoration](kui_shell_core.TabState.md#desiredstatusstripedecoration)
- [state](kui_shell_core.TabState.md#state)

### Methods

- [capture](kui_shell_core.TabState.md#capture)
- [checkExistence](kui_shell_core.TabState.md#checkexistence)
- [cloneWithUUID](kui_shell_core.TabState.md#clonewithuuid)
- [getState](kui_shell_core.TabState.md#getstate)
- [register](kui_shell_core.TabState.md#register)
- [restore](kui_shell_core.TabState.md#restore)
- [setState](kui_shell_core.TabState.md#setstate)
- [switchTo](kui_shell_core.TabState.md#switchto)
- [updateStatusStripe](kui_shell_core.TabState.md#updatestatusstripe)

## Constructors

### constructor

• **new TabState**(`uuid`, `_desiredStatusStripeDecoration?`, `_parent?`)

#### Parameters

| Name                             | Type                                                                                     |
| :------------------------------- | :--------------------------------------------------------------------------------------- |
| `uuid`                           | `string`                                                                                 |
| `_desiredStatusStripeDecoration` | [`StatusStripeChangeEvent`](../modules/kui_shell_core.Events.md#statusstripechangeevent) |
| `_parent?`                       | [`TabState`](kui_shell_core.TabState.md)                                                 |

#### Defined in

[packages/core/src/models/tab-state.ts:68](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L68)

## Properties

### \_state

• `Private` **\_state**: `Record`<`string`, `Record`<`string`, `any`\>\> = `{}`

state map
outer key is `TabStateRegistrar.name`, inner key is `TabStateRegistrar.apiVersion`
e.g. { 'plugins/plugin-core': {'v1': {'cwd': '/'}}}

#### Defined in

[packages/core/src/models/tab-state.ts:57](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L57)

---

### captures

• `Private` **captures**: `CaptureFn`[] = `[]`

functions to capture the states of tab

#### Defined in

[packages/core/src/models/tab-state.ts:60](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L60)

---

### closed

• **closed**: `boolean`

is the tab closed?

#### Defined in

[packages/core/src/models/tab-state.ts:51](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L51)

---

### ready

• **ready**: `boolean` = `false`

is the tab ready for command execution?

#### Defined in

[packages/core/src/models/tab-state.ts:48](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L48)

---

### restores

• `Private` **restores**: `RestoreFn`[] = `[]`

functions to restore the states of the tab

#### Defined in

[packages/core/src/models/tab-state.ts:63](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L63)

---

### switchTos

• `Private` **switchTos**: `SwitchToFn`[] = `[]`

functions to capture this tab state and restore another tab state

#### Defined in

[packages/core/src/models/tab-state.ts:66](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L66)

---

### uuid

• `Readonly` **uuid**: `string`

## Accessors

### desiredStatusStripeDecoration

• `get` **desiredStatusStripeDecoration**(): [`StatusStripeChangeEvent`](../modules/kui_shell_core.Events.md#statusstripechangeevent)

#### Returns

[`StatusStripeChangeEvent`](../modules/kui_shell_core.Events.md#statusstripechangeevent)

#### Defined in

[packages/core/src/models/tab-state.ts:154](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L154)

• `set` **desiredStatusStripeDecoration**(`decor`): `void`

#### Parameters

| Name    | Type                                                                                     |
| :------ | :--------------------------------------------------------------------------------------- |
| `decor` | [`StatusStripeChangeEvent`](../modules/kui_shell_core.Events.md#statusstripechangeevent) |

#### Returns

`void`

#### Defined in

[packages/core/src/models/tab-state.ts:158](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L158)

---

### state

• `get` **state**(): `Record`<`string`, `Record`<`string`, `any`\>\>

#### Returns

`Record`<`string`, `Record`<`string`, `any`\>\>

#### Defined in

[packages/core/src/models/tab-state.ts:78](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L78)

## Methods

### capture

▸ **capture**(): `void`

Capture contextual global state

#### Returns

`void`

#### Defined in

[packages/core/src/models/tab-state.ts:124](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L124)

---

### checkExistence

▸ `Private` **checkExistence**(`name`, `apiVersion`): `boolean`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `name`       | `string` |
| `apiVersion` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/core/src/models/tab-state.ts:82](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L82)

---

### cloneWithUUID

▸ **cloneWithUUID**(`uuid`): [`TabState`](kui_shell_core.TabState.md)

Clone the captured state

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `uuid` | `string` |

#### Returns

[`TabState`](kui_shell_core.TabState.md)

#### Defined in

[packages/core/src/models/tab-state.ts:137](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L137)

---

### getState

▸ **getState**(`name`, `apiVersion`, `key`): `any`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `name`       | `string` |
| `apiVersion` | `string` |
| `key`        | `string` |

#### Returns

`any`

#### Defined in

[packages/core/src/models/tab-state.ts:107](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L107)

---

### register

▸ **register**(`name`, `apiVersion`, `capture`, `restore`, `switchTo`): `void`

#### Parameters

| Name         | Type         |
| :----------- | :----------- |
| `name`       | `string`     |
| `apiVersion` | `string`     |
| `capture`    | `CaptureFn`  |
| `restore`    | `RestoreFn`  |
| `switchTo`   | `SwitchToFn` |

#### Returns

`void`

#### Defined in

[packages/core/src/models/tab-state.ts:92](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L92)

---

### restore

▸ **restore**(): `Promise`<`void`\>

Restore tab state

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/models/tab-state.ts:171](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L171)

---

### setState

▸ **setState**(`name`, `apiVersion`, `key`, `value`): `Promise`<`void`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `name`       | `string` |
| `apiVersion` | `string` |
| `key`        | `string` |
| `value`      | `any`    |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/models/tab-state.ts:117](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L117)

---

### switchTo

▸ **switchTo**(`nextTabState`): `Promise`<`void`\>

Capture contextual global state and then restore `nextTabState`

#### Parameters

| Name           | Type                                     |
| :------------- | :--------------------------------------- |
| `nextTabState` | [`TabState`](kui_shell_core.TabState.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/models/tab-state.ts:129](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L129)

---

### updateStatusStripe

▸ **updateStatusStripe**(): `void`

Enforce our desired status stripe decorations

#### Returns

`void`

#### Defined in

[packages/core/src/models/tab-state.ts:146](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/tab-state.ts#L146)
