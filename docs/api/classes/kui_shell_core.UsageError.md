[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / UsageError

# Class: UsageError

[@kui-shell/core](../modules/kui_shell_core.md).UsageError

## Hierarchy

- `Error`

  ↳ **`UsageError`**

## Implements

- [`CodedError`](../interfaces/kui_shell_core.CodedError.md)
- `UsageErrorLike`

## Table of contents

### Constructors

- [constructor](kui_shell_core.UsageError.md#constructor)

### Properties

- [code](kui_shell_core.UsageError.md#code)
- [formattedMessage](kui_shell_core.UsageError.md#formattedmessage)
- [message](kui_shell_core.UsageError.md#message)
- [name](kui_shell_core.UsageError.md#name)
- [raw](kui_shell_core.UsageError.md#raw)
- [stack](kui_shell_core.UsageError.md#stack)
- [stackTraceLimit](kui_shell_core.UsageError.md#stacktracelimit)

### Methods

- [getUsageModel](kui_shell_core.UsageError.md#getusagemodel)
- [captureStackTrace](kui_shell_core.UsageError.md#capturestacktrace)
- [getFormattedMessage](kui_shell_core.UsageError.md#getformattedmessage)
- [isUsageError](kui_shell_core.UsageError.md#isusageerror)
- [prepareStackTrace](kui_shell_core.UsageError.md#preparestacktrace)

## Constructors

### constructor

• **new UsageError**(`message`, `extra?`)

#### Parameters

| Name      | Type           |
| :-------- | :------------- |
| `message` | `UsageLike`    |
| `extra?`  | `UsageOptions` |

#### Overrides

Error.constructor

#### Defined in

[packages/core/src/core/usage-error.ts:901](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage-error.ts#L901)

## Properties

### code

• **code**: `number`

#### Implementation of

[CodedError](../interfaces/kui_shell_core.CodedError.md).[code](../interfaces/kui_shell_core.CodedError.md#code)

#### Defined in

[packages/core/src/core/usage-error.ts:899](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage-error.ts#L899)

---

### formattedMessage

• **formattedMessage**: `Promise`<`HTMLElement`\>

#### Implementation of

UsageErrorLike.formattedMessage

#### Defined in

[packages/core/src/core/usage-error.ts:895](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage-error.ts#L895)

---

### message

• **message**: `string`

#### Implementation of

[CodedError](../interfaces/kui_shell_core.CodedError.md).[message](../interfaces/kui_shell_core.CodedError.md#message)

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: `string`

#### Implementation of

[CodedError](../interfaces/kui_shell_core.CodedError.md).[name](../interfaces/kui_shell_core.CodedError.md#name)

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

---

### raw

• **raw**: `UsageLike`

#### Implementation of

UsageErrorLike.raw

#### Defined in

[packages/core/src/core/usage-error.ts:897](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage-error.ts#L897)

---

### stack

• `Optional` **stack**: `string`

#### Implementation of

[CodedError](../interfaces/kui_shell_core.CodedError.md).[stack](../interfaces/kui_shell_core.CodedError.md#stack)

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:975

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:142

## Methods

### getUsageModel

▸ **getUsageModel**(): [`UsageModel`](../interfaces/kui_shell_core.UsageModel.md)

#### Returns

[`UsageModel`](../interfaces/kui_shell_core.UsageModel.md)

#### Defined in

[packages/core/src/core/usage-error.ts:917](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage-error.ts#L917)

---

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `targetObject`    | `Object`   |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:133

---

### getFormattedMessage

▸ `Static` **getFormattedMessage**(`err`): `Promise`<`HTMLElement`\>

#### Parameters

| Name  | Type             |
| :---- | :--------------- |
| `err` | `UsageErrorLike` |

#### Returns

`Promise`<`HTMLElement`\>

#### Defined in

[packages/core/src/core/usage-error.ts:921](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage-error.ts#L921)

---

### isUsageError

▸ `Static` **isUsageError**(`error`): error is UsageErrorLike

#### Parameters

| Name    | Type                                                                                                                                                           |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `error` | `Entity`<`void`, [`Row`](kui_shell_core.Row.md), [`ResourceWithMetadata`](../interfaces/kui_shell_core.ResourceWithMetadata.md)<`void`\>\> \| `UsageErrorLike` |

#### Returns

error is UsageErrorLike

#### Defined in

[packages/core/src/core/usage-error.ts:929](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage-error.ts#L929)

---

### prepareStackTrace

▸ `Static` `Optional` **prepareStackTrace**(`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

#### Parameters

| Name          | Type         |
| :------------ | :----------- |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:140
