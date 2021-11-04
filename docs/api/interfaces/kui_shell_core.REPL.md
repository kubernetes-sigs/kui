[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / REPL

# Interface: REPL

[@kui-shell/core](../modules/kui_shell_core.md).REPL

## Table of contents

### Methods

- [click](kui_shell_core.REPL.md#click)
- [encodeComponent](kui_shell_core.REPL.md#encodecomponent)
- [pexec](kui_shell_core.REPL.md#pexec)
- [qexec](kui_shell_core.REPL.md#qexec)
- [reexec](kui_shell_core.REPL.md#reexec)
- [rexec](kui_shell_core.REPL.md#rexec)
- [split](kui_shell_core.REPL.md#split)

## Methods

### click

▸ **click**(`command`, `evt`): `Promise`<`void`\>

Execute a command in response to an in-view click in a sidecar
view. This is helpful if you wish to participate in the view
nesting logic, e.g. where clicking on a link in a sidecar allows
the user to return to the previous view. In contrast, `pexec`
calls will _not_ participate in view stacking.

#### Parameters

| Name      | Type                                   |
| :-------- | :------------------------------------- |
| `command` | `string` \| () => `Promise`<`string`\> |
| `evt`     | `MouseEvent`                           |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/models/repl.ts:58](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/repl.ts#L58)

---

### encodeComponent

▸ **encodeComponent**(`component`, `quote?`): `string`

Prepare a string to be part of a `command` argument to the \*exec
functions, quoting and escaping as necessary.

#### Parameters

| Name        | Type                              |
| :---------- | :-------------------------------- |
| `component` | `string` \| `number` \| `boolean` |
| `quote?`    | `string`                          |

#### Returns

`string`

#### Defined in

[packages/core/src/models/repl.ts:71](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/repl.ts#L71)

---

### pexec

▸ **pexec**<`T`\>(`command`, `execOptions?`): `Promise`<`T`\>

Programmatic eval. Useful to execute one command from another,
e.g. as the result of a click handler --- where you would like
the REPL interaction to appear on the console.

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |

#### Parameters

| Name           | Type                                           |
| :------------- | :--------------------------------------------- |
| `command`      | `string`                                       |
| `execOptions?` | [`ExecOptions`](kui_shell_core.ExecOptions.md) |

#### Returns

`Promise`<`T`\>

#### Defined in

[packages/core/src/models/repl.ts:48](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/repl.ts#L48)

---

### qexec

▸ **qexec**<`T`\>(`command`, `block?`, `contextChangeOK?`, `execOptions?`, `nextBlock?`): `Promise`<`T`\>

Quiet eval. Useful to execute one command from another, without
emitting output to the console.

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |

#### Parameters

| Name               | Type                                           |
| :----------------- | :--------------------------------------------- |
| `command`          | `string`                                       |
| `block?`           | `boolean` \| `HTMLElement`                     |
| `contextChangeOK?` | `boolean`                                      |
| `execOptions?`     | [`ExecOptions`](kui_shell_core.ExecOptions.md) |
| `nextBlock?`       | `HTMLElement`                                  |

#### Returns

`Promise`<`T`\>

#### Defined in

[packages/core/src/models/repl.ts:27](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/repl.ts#L27)

---

### reexec

▸ **reexec**<`T`\>(`command`, `execOptions`): `Promise`<`T`\>

Evaluate a command and place the result in the current active view for the given tab

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |

#### Parameters

| Name          | Type                                                                      |
| :------------ | :------------------------------------------------------------------------ |
| `command`     | `string`                                                                  |
| `execOptions` | [`ExecOptionsWithUUID`](../modules/kui_shell_core.md#execoptionswithuuid) |

#### Returns

`Promise`<`T`\>

#### Defined in

[packages/core/src/models/repl.ts:64](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/repl.ts#L64)

---

### rexec

▸ **rexec**<`Raw`\>(`command`, `execOptions?`): `Promise`<[`RawResponse`](kui_shell_core.RawResponse.md)<`Raw`\>\>

Raw eval. Useful to execute one command from another, where you
want the original model back, not the view-oriented model.

#### Type parameters

| Name  | Type              |
| :---- | :---------------- |
| `Raw` | extends `unknown` |

#### Parameters

| Name           | Type                                           |
| :------------- | :--------------------------------------------- |
| `command`      | `string`                                       |
| `execOptions?` | [`ExecOptions`](kui_shell_core.ExecOptions.md) |

#### Returns

`Promise`<[`RawResponse`](kui_shell_core.RawResponse.md)<`Raw`\>\>

#### Defined in

[packages/core/src/models/repl.ts:40](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/repl.ts#L40)

---

### split

▸ **split**(`str`, `removeOuterQuotes?`, `removeInlineOuterQuotes?`): `string`[]

Split the given string into an argv

#### Parameters

| Name                       | Type      |
| :------------------------- | :-------- |
| `str`                      | `string`  |
| `removeOuterQuotes?`       | `boolean` |
| `removeInlineOuterQuotes?` | `boolean` |

#### Returns

`string`[]

#### Defined in

[packages/core/src/models/repl.ts:80](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/repl.ts#L80)
