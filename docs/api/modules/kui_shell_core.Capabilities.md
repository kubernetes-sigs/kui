[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](kui_shell_core.md) / Capabilities

# Namespace: Capabilities

[@kui-shell/core](kui_shell_core.md).Capabilities

## Table of contents

### Type aliases

- [CapabilityRegistration](kui_shell_core.Capabilities.md#capabilityregistration)

### Functions

- [assertHasProxy](kui_shell_core.Capabilities.md#asserthasproxy)
- [assertInSandbox](kui_shell_core.Capabilities.md#assertinsandbox)
- [assertLocalAccess](kui_shell_core.Capabilities.md#assertlocalaccess)
- [getAuthValue](kui_shell_core.Capabilities.md#getauthvalue)
- [getValidCredentials](kui_shell_core.Capabilities.md#getvalidcredentials)
- [hasProxy](kui_shell_core.Capabilities.md#hasproxy)
- [inBrowser](kui_shell_core.Capabilities.md#inbrowser)
- [inElectron](kui_shell_core.Capabilities.md#inelectron)
- [inProxy](kui_shell_core.Capabilities.md#inproxy)
- [inSandbox](kui_shell_core.Capabilities.md#insandbox)
- [isHeadless](kui_shell_core.Capabilities.md#isheadless)
- [setHasAuth](kui_shell_core.Capabilities.md#sethasauth)

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

[packages/core/src/core/capabilities.ts:105](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L105)

---

### assertInSandbox

▸ **assertInSandbox**(): `void`

Yes, we are running in a sandbox

#### Returns

`void`

#### Defined in

[packages/core/src/core/capabilities.ts:121](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L121)

---

### assertLocalAccess

▸ `Const` **assertLocalAccess**(): `void`

Assert that we have local access, even if the default behavior
would indicate otherwise

#### Returns

`void`

#### Defined in

[packages/core/src/core/capabilities.ts:192](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L192)

---

### getAuthValue

▸ `Const` **getAuthValue**(`provider`, `key`): `any`

Retrieve the value for the given key for the auth model of the given provider

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `provider` | `string` |
| `key`      | `string` |

#### Returns

`any`

#### Defined in

[packages/core/src/core/capabilities.ts:153](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L153)

---

### getValidCredentials

▸ `Const` **getValidCredentials**(): `CredentialsMap`

Return a map of all valid credentials

#### Returns

`CredentialsMap`

#### Defined in

[packages/core/src/core/capabilities.ts:162](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L162)

---

### hasProxy

▸ `Const` **hasProxy**(): `boolean`

Is Kui supported by a remote proxy?

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:99](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L99)

---

### inBrowser

▸ `Const` **inBrowser**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:82](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L82)

---

### inElectron

▸ `Const` **inElectron**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:81](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L81)

---

### inProxy

▸ `Const` **inProxy**(): `boolean`

Are we the Kui proxy?

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:113](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L113)

---

### inSandbox

▸ **inSandbox**(): `boolean`

Are we running in a sandbox?

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:129](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L129)

---

### isHeadless

▸ `Const` **isHeadless**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/core/capabilities.ts:80](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L80)

---

### setHasAuth

▸ `Const` **setHasAuth**(`provider`, `creds`): `void`

Yes, we have valid credentials to interface with the given
provider

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `provider` | `string` |
| `creds`    | `object` |

#### Returns

`void`

#### Defined in

[packages/core/src/core/capabilities.ts:138](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/capabilities.ts#L138)
