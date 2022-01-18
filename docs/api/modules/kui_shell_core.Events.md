[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](kui_shell_core.md) / Events

# Namespace: Events

[@kui-shell/core](kui_shell_core.md).Events

## Table of contents

### Interfaces

- [NewTabRequestEvent](../interfaces/kui_shell_core.Events.NewTabRequestEvent.md)

### Type aliases

- [SnapshotRequestEvent](kui_shell_core.Events.md#snapshotrequestevent)
- [StatusStripeChangeEvent](kui_shell_core.Events.md#statusstripechangeevent)
- [TabLayoutChangeEvent](kui_shell_core.Events.md#tablayoutchangeevent)

### Variables

- [eventBus](kui_shell_core.Events.md#eventbus)
- [eventChannelUnsafe](kui_shell_core.Events.md#eventchannelunsafe)

### Functions

- [unwireToStandardEvents](kui_shell_core.Events.md#unwiretostandardevents)
- [unwireToTabEvents](kui_shell_core.Events.md#unwiretotabevents)
- [wireToStandardEvents](kui_shell_core.Events.md#wiretostandardevents)
- [wireToTabEvents](kui_shell_core.Events.md#wiretotabevents)

## Type aliases

### SnapshotRequestEvent

Ƭ **SnapshotRequestEvent**: `Object`

#### Type declaration

| Name        | Type                             | Description             |
| :---------- | :------------------------------- | :---------------------- |
| `execUUID?` | `string`                         | Capture just one block? |
| `cb?`       | (`snapshot`: `Buffer`) => `void` | -                       |

#### Defined in

[packages/core/src/core/events.ts:39](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L39)

---

### StatusStripeChangeEvent

Ƭ **StatusStripeChangeEvent**: `Object`

#### Type declaration

| Name       | Type                                             |
| :--------- | :----------------------------------------------- |
| `message?` | `string`                                         |
| `type`     | `"default"` \| `"blue"` \| `"yellow"` \| `"red"` |

#### Defined in

[packages/core/src/core/events.ts:34](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L34)

---

### TabLayoutChangeEvent

Ƭ **TabLayoutChangeEvent**: `Object`

#### Type declaration

| Name                  | Type      |
| :-------------------- | :-------- |
| `isSidecarNowHidden`  | `boolean` |
| `isWidthConstrained?` | `boolean` |

#### Defined in

[packages/core/src/core/events.ts:46](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L46)

## Variables

### eventBus

• **eventBus**: `EventBus`

#### Defined in

[packages/core/src/core/events.ts:406](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L406)

---

### eventChannelUnsafe

• **eventChannelUnsafe**: `EventEmitter`

#### Defined in

[packages/core/src/core/events.ts:29](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L29)

## Functions

### unwireToStandardEvents

▸ **unwireToStandardEvents**(`listener`): `void`

Unhook

#### Parameters

| Name       | Type                                                                         |
| :--------- | :--------------------------------------------------------------------------- |
| `listener` | (`tab?`: `number` \| [`Tab`](../interfaces/kui_shell_core.Tab.md)) => `void` |

#### Returns

`void`

#### Defined in

[packages/core/src/core/events.ts:443](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L443)

---

### unwireToTabEvents

▸ **unwireToTabEvents**(`listener`): `void`

Unhook

#### Parameters

| Name       | Type                                                                         |
| :--------- | :--------------------------------------------------------------------------- |
| `listener` | (`tab?`: `number` \| [`Tab`](../interfaces/kui_shell_core.Tab.md)) => `void` |

#### Returns

`void`

#### Defined in

[packages/core/src/core/events.ts:422](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L422)

---

### wireToStandardEvents

▸ **wireToStandardEvents**(`listener`): `void`

Hook an event listener up to the family of standard user
interaction events.

#### Parameters

| Name       | Type                                                                         |
| :--------- | :--------------------------------------------------------------------------- |
| `listener` | (`tab?`: `number` \| [`Tab`](../interfaces/kui_shell_core.Tab.md)) => `void` |

#### Returns

`void`

#### Defined in

[packages/core/src/core/events.ts:433](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L433)

---

### wireToTabEvents

▸ **wireToTabEvents**(`listener`): `void`

Hook an event listener up to tab events.

#### Parameters

| Name       | Type                                                                         |
| :--------- | :--------------------------------------------------------------------------- |
| `listener` | (`tab?`: `number` \| [`Tab`](../interfaces/kui_shell_core.Tab.md)) => `void` |

#### Returns

`void`

#### Defined in

[packages/core/src/core/events.ts:412](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L412)
