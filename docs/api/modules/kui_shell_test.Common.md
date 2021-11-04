[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/test](kui_shell_test.md) / Common

# Namespace: Common

[@kui-shell/test](kui_shell_test.md).Common

## Table of contents

### Interfaces

- [BeforeOptions](../interfaces/kui_shell_test.Common.BeforeOptions.md)
- [ISuite](../interfaces/kui_shell_test.Common.ISuite.md)

### Variables

- [expectedVersion](kui_shell_test.Common.md#expectedversion)

### Functions

- [after](kui_shell_test.Common.md#after)
- [before](kui_shell_test.Common.md#before)
- [dockerDescribe](kui_shell_test.Common.md#dockerdescribe)
- [localDescribe](kui_shell_test.Common.md#localdescribe)
- [localIt](kui_shell_test.Common.md#localit)
- [oops](kui_shell_test.Common.md#oops)
- [pDescribe](kui_shell_test.Common.md#pdescribe)
- [pit](kui_shell_test.Common.md#pit)
- [proxyDescribe](kui_shell_test.Common.md#proxydescribe)
- [proxyIt](kui_shell_test.Common.md#proxyit)
- [refresh](kui_shell_test.Common.md#refresh)
- [remoteIt](kui_shell_test.Common.md#remoteit)
- [restart](kui_shell_test.Common.md#restart)
- [setDebugMode](kui_shell_test.Common.md#setdebugmode)

## Variables

### expectedVersion

• **expectedVersion**: `string` = `version`

non-headless targets in travis use the clients/default version

#### Defined in

[packages/test/src/api/common.ts:577](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L577)

## Functions

### after

▸ `Const` **after**(`ctx`, `f?`): `HookFunction`

This is the method that will be called when a test completes

#### Parameters

| Name  | Type                                                      |
| :---- | :-------------------------------------------------------- |
| `ctx` | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |
| `f?`  | () => `void`                                              |

#### Returns

`HookFunction`

#### Defined in

[packages/test/src/api/common.ts:387](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L387)

---

### before

▸ `Const` **before**(`ctx`, `options?`): `HookFunction`

This is the method that will be called before a test begins

#### Parameters

| Name       | Type                                                                    |
| :--------- | :---------------------------------------------------------------------- |
| `ctx`      | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md)               |
| `options?` | [`BeforeOptions`](../interfaces/kui_shell_test.Common.BeforeOptions.md) |

#### Returns

`HookFunction`

#### Defined in

[packages/test/src/api/common.ts:288](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L288)

---

### dockerDescribe

▸ `Const` **dockerDescribe**(`msg`, `suite`): `Suite`

only execute the test suite in an environment that has docker

#### Parameters

| Name    | Type         |
| :------ | :----------- |
| `msg`   | `string`     |
| `suite` | () => `void` |

#### Returns

`Suite`

#### Defined in

[packages/test/src/api/common.ts:544](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L544)

---

### localDescribe

▸ `Const` **localDescribe**(`msg`, `suite`): `Suite`

only execute the test suite in local

#### Parameters

| Name    | Type         |
| :------ | :----------- |
| `msg`   | `string`     |
| `suite` | () => `void` |

#### Returns

`Suite`

#### Defined in

[packages/test/src/api/common.ts:539](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L539)

---

### localIt

▸ `Const` **localIt**(`msg`, `func`): `Test`

only execute the test in local

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `msg`  | `string` |
| `func` | `Func`   |

#### Returns

`Test`

#### Defined in

[packages/test/src/api/common.ts:534](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L534)

---

### oops

▸ `Const` **oops**(`ctx`, `wait?`): (`err`: `Error`) => `Promise`<`unknown`\>

#### Parameters

| Name   | Type                                                      | Default value |
| :----- | :-------------------------------------------------------- | :------------ |
| `ctx`  | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) | `undefined`   |
| `wait` | `boolean`                                                 | `false`       |

#### Returns

`fn`

▸ (`err`): `Promise`<`unknown`\>

##### Parameters

| Name  | Type    |
| :---- | :------ |
| `err` | `Error` |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/test/src/api/common.ts:430](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L430)

---

### pDescribe

▸ `Const` **pDescribe**(`msg`, `suite`): `Suite`

only execute the test suite in electron or proxy+browser clients

#### Parameters

| Name    | Type         |
| :------ | :----------- |
| `msg`   | `string`     |
| `suite` | () => `void` |

#### Returns

`Suite`

#### Defined in

[packages/test/src/api/common.ts:562](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L562)

---

### pit

▸ `Const` **pit**(`msg`, `func`): `Test`

only execute the test in electron or proxy+browser client

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `msg`  | `string` |
| `func` | `Func`   |

#### Returns

`Test`

#### Defined in

[packages/test/src/api/common.ts:572](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L572)

---

### proxyDescribe

▸ `Const` **proxyDescribe**(`msg`, `suite`): `Suite`

only execute the test suite in proxy+browser clients

#### Parameters

| Name    | Type         |
| :------ | :----------- |
| `msg`   | `string`     |
| `suite` | () => `void` |

#### Returns

`Suite`

#### Defined in

[packages/test/src/api/common.ts:557](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L557)

---

### proxyIt

▸ `Const` **proxyIt**(`msg`, `func`): `Test`

only execute the test in proxy+browser client

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `msg`  | `string` |
| `func` | `Func`   |

#### Returns

`Test`

#### Defined in

[packages/test/src/api/common.ts:567](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L567)

---

### refresh

▸ `Const` **refresh**(`ctx`, `wait?`, `clean?`): `Promise`<`void`\>

reload the app

#### Parameters

| Name    | Type                                                      | Default value |
| :------ | :-------------------------------------------------------- | :------------ |
| `ctx`   | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) | `undefined`   |
| `wait`  | `boolean`                                                 | `true`        |
| `clean` | `boolean`                                                 | `false`       |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/common.ts:253](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L253)

---

### remoteIt

▸ `Const` **remoteIt**(`msg`, `func`): `Test`

only execute the test in non-proxy browser

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `msg`  | `string` |
| `func` | `Func`   |

#### Returns

`Test`

#### Defined in

[packages/test/src/api/common.ts:552](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L552)

---

### restart

▸ `Const` **restart**(`ctx`): `Promise`<`void`\>

restart the app

#### Parameters

| Name  | Type                                                      |
| :---- | :-------------------------------------------------------- |
| `ctx` | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/common.ts:234](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L234)

---

### setDebugMode

▸ **setDebugMode**(): `void`

#### Returns

`void`

#### Defined in

[packages/test/src/api/common.ts:585](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/common.ts#L585)
