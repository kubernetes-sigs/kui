[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](kui_shell_core.md) / Capabilities

# Namespace: Capabilities

[@kui-shell/core](kui_shell_core.md).Capabilities

## Table of contents

### Type aliases

- [CapabilityRegistration](kui_shell_core.Capabilities.md#capabilityregistration)

### Functions

- [assertHasProxy](kui_shell_core.Capabilities.md#asserthasproxy)
- [assertLocalAccess](kui_shell_core.Capabilities.md#assertlocalaccess)
- [hasProxy](kui_shell_core.Capabilities.md#hasproxy)
- [inBrowser](kui_shell_core.Capabilities.md#inbrowser)
- [inElectron](kui_shell_core.Capabilities.md#inelectron)
- [inProxy](kui_shell_core.Capabilities.md#inproxy)
- [isHeadless](kui_shell_core.Capabilities.md#isheadless)

## Type aliases

### CapabilityRegistration

Ƭ **CapabilityRegistration**: (`registrar`: [`PreloadRegistrar`](../interfaces/kui_shell_core.PreloadRegistrar.md)) => `void` \| `Promise`<`void`\>

#### Type declaration

▸ (`registrar`): `void` \| `Promise`<`void`\>

##### Parameters

| Name        | Type                                                                   |
| :---------- | :--------------------------------------------------------------------- |
| `registrar` | [`PreloadRegistrar`](../interfaces/kui_shell_core.PreloadRegistrar.md) |

##### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[packages/core/src/models/plugin.ts:43](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/plugin.ts#L43)

## Functions

### assertHasProxy

▸ `Const` **assertHasProxy**(): `void`

Assert that Kui is supported by a remote proxy

#### Returns

`void`

#### Defined in

[packages/core/src/core/capabilities.ts:96](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L96)

---

### assertLocalAccess

▸ `Const` **assertLocalAccess**(): `void`

Assert that we have local access, even if the default behavior
would indicate otherwise

#### Returns

`void`

#### Defined in

[packages/core/src/core/capabilities.ts:121](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L121)

---

### hasProxy

▸ `Const` **hasProxy**(): `boolean`

Is Kui supported by a remote proxy?

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:90](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L90)

---

### inBrowser

▸ `Const` **inBrowser**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:73](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L73)

---

### inElectron

▸ `Const` **inElectron**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:72](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L72)

---

### inProxy

▸ `Const` **inProxy**(): `boolean`

Are we the Kui proxy?

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:104](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L104)

---

### isHeadless

▸ `Const` **isHeadless**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:71](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L71)
