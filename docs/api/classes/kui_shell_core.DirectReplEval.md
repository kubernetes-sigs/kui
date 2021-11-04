[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / DirectReplEval

# Class: DirectReplEval

[@kui-shell/core](../modules/kui_shell_core.md).DirectReplEval

Directly apply the given evaluator to the given arguments. This is
the default evaluator implementation.

## Implements

- [`ReplEval`](../interfaces/kui_shell_core.ReplEval.md)

## Table of contents

### Constructors

- [constructor](kui_shell_core.DirectReplEval.md#constructor)

### Properties

- [name](kui_shell_core.DirectReplEval.md#name)

### Methods

- [apply](kui_shell_core.DirectReplEval.md#apply)

## Constructors

### constructor

• **new DirectReplEval**()

## Properties

### name

• **name**: `string` = `'DirectReplEval'`

#### Implementation of

[ReplEval](../interfaces/kui_shell_core.ReplEval.md).[name](../interfaces/kui_shell_core.ReplEval.md#name)

#### Defined in

[packages/core/src/repl/types.ts:55](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/repl/types.ts#L55)

## Methods

### apply

▸ **apply**<`T`, `O`\>(`commandUntrimmed`, `execOptions`, `evaluator`, `args`): `T` \| `Promise`<`T`\>

#### Type parameters

| Name | Type                                                                     |
| :--- | :----------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\>    |
| `O`  | extends [`ParsedOptions`](../interfaces/kui_shell_core.ParsedOptions.md) |

#### Parameters

| Name               | Type                                                                |
| :----------------- | :------------------------------------------------------------------ |
| `commandUntrimmed` | `string`                                                            |
| `execOptions`      | [`ExecOptions`](../interfaces/kui_shell_core.ExecOptions.md)        |
| `evaluator`        | [`Evaluator`](../interfaces/kui_shell_core.Evaluator.md)<`T`, `O`\> |
| `args`             | [`Arguments`](../interfaces/kui_shell_core.Arguments.md)<`O`\>      |

#### Returns

`T` \| `Promise`<`T`\>

#### Implementation of

[ReplEval](../interfaces/kui_shell_core.ReplEval.md).[apply](../interfaces/kui_shell_core.ReplEval.md#apply)

#### Defined in

[packages/core/src/repl/types.ts:57](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/repl/types.ts#L57)
