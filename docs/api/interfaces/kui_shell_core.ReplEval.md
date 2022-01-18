[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / ReplEval

# Interface: ReplEval

[@kui-shell/core](../modules/kui_shell_core.md).ReplEval

Apply the given evaluator to the given arguments

## Implemented by

- [`DirectReplEval`](../classes/kui_shell_core.DirectReplEval.md)

## Table of contents

### Properties

- [name](kui_shell_core.ReplEval.md#name)

### Methods

- [apply](kui_shell_core.ReplEval.md#apply)

## Properties

### name

• **name**: `string`

#### Defined in

[packages/core/src/repl/types.ts:40](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/types.ts#L40)

## Methods

### apply

▸ **apply**<`T`, `O`\>(`commandUntrimmed`, `execOptions`, `evaluator`, `args`): `T` \| `Promise`<`T`\>

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |
| `O`  | extends [`ParsedOptions`](kui_shell_core.ParsedOptions.md)            |

#### Parameters

| Name               | Type                                                  |
| :----------------- | :---------------------------------------------------- |
| `commandUntrimmed` | `string`                                              |
| `execOptions`      | [`ExecOptions`](kui_shell_core.ExecOptions.md)        |
| `evaluator`        | [`Evaluator`](kui_shell_core.Evaluator.md)<`T`, `O`\> |
| `args`             | [`Arguments`](kui_shell_core.Arguments.md)<`O`\>      |

#### Returns

`T` \| `Promise`<`T`\>

#### Defined in

[packages/core/src/repl/types.ts:41](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/types.ts#L41)
