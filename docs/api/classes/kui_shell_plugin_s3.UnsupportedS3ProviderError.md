[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-s3](../modules/kui_shell_plugin_s3.md) / UnsupportedS3ProviderError

# Class: UnsupportedS3ProviderError

[@kui-shell/plugin-s3](../modules/kui_shell_plugin_s3.md).UnsupportedS3ProviderError

## Hierarchy

- `Error`

  ↳ **`UnsupportedS3ProviderError`**

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_s3.UnsupportedS3ProviderError.md#constructor)

### Properties

- [message](kui_shell_plugin_s3.UnsupportedS3ProviderError.md#message)
- [name](kui_shell_plugin_s3.UnsupportedS3ProviderError.md#name)
- [stack](kui_shell_plugin_s3.UnsupportedS3ProviderError.md#stack)
- [stackTraceLimit](kui_shell_plugin_s3.UnsupportedS3ProviderError.md#stacktracelimit)

### Methods

- [captureStackTrace](kui_shell_plugin_s3.UnsupportedS3ProviderError.md#capturestacktrace)
- [prepareStackTrace](kui_shell_plugin_s3.UnsupportedS3ProviderError.md#preparestacktrace)

## Constructors

### constructor

• **new UnsupportedS3ProviderError**(`message?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:979

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

---

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

---

### stack

• `Optional` **stack**: `string`

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
