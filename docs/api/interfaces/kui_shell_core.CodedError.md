[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / CodedError

# Interface: CodedError<Code\>

[@kui-shell/core](../modules/kui_shell_core.md).CodedError

## Type parameters

| Name   | Type     |
| :----- | :------- |
| `Code` | `number` |

## Hierarchy

- `Error`

  ↳ **`CodedError`**

## Implemented by

- [`UsageError`](../classes/kui_shell_core.UsageError.md)

## Table of contents

### Properties

- [body](kui_shell_core.CodedError.md#body)
- [code](kui_shell_core.CodedError.md#code)
- [hide](kui_shell_core.CodedError.md#hide)
- [message](kui_shell_core.CodedError.md#message)
- [name](kui_shell_core.CodedError.md#name)
- [partialMatches](kui_shell_core.CodedError.md#partialmatches)
- [stack](kui_shell_core.CodedError.md#stack)
- [statusCode](kui_shell_core.CodedError.md#statuscode)

## Properties

### body

• `Optional` **body**: `string` \| `Record`<`string`, `any`\>

#### Defined in

[packages/core/src/models/errors.ts:25](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/errors.ts#L25)

---

### code

• `Optional` **code**: `Code`

#### Defined in

[packages/core/src/models/errors.ts:21](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/errors.ts#L21)

---

### hide

• `Optional` **hide**: `boolean`

#### Defined in

[packages/core/src/models/errors.ts:20](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/errors.ts#L20)

---

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

### partialMatches

• `Optional` **partialMatches**: [`UsageRow`](kui_shell_core.UsageRow.md)[]

#### Defined in

[packages/core/src/models/errors.ts:23](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/errors.ts#L23)

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:975

---

### statusCode

• `Optional` **statusCode**: `number`

#### Defined in

[packages/core/src/models/errors.ts:22](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/errors.ts#L22)
