[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / HistoryModel

# Class: HistoryModel

[@kui-shell/core](../modules/kui_shell_core.md).HistoryModel

A tuple of History entries, one per Tab (as specified by its given uuid)

## Table of contents

### Constructors

- [constructor](kui_shell_core.HistoryModel.md#constructor)

### Properties

- [\_cursor](kui_shell_core.HistoryModel.md#_cursor)
- [\_lines](kui_shell_core.HistoryModel.md#_lines)
- [masterUUID](kui_shell_core.HistoryModel.md#masteruuid)

### Accessors

- [cursor](kui_shell_core.HistoryModel.md#cursor)

### Methods

- [add](kui_shell_core.HistoryModel.md#add)
- [find](kui_shell_core.HistoryModel.md#find)
- [findIndex](kui_shell_core.HistoryModel.md#findindex)
- [first](kui_shell_core.HistoryModel.md#first)
- [guardedChange](kui_shell_core.HistoryModel.md#guardedchange)
- [key](kui_shell_core.HistoryModel.md#key)
- [last](kui_shell_core.HistoryModel.md#last)
- [line](kui_shell_core.HistoryModel.md#line)
- [lineByIncr](kui_shell_core.HistoryModel.md#linebyincr)
- [next](kui_shell_core.HistoryModel.md#next)
- [previous](kui_shell_core.HistoryModel.md#previous)
- [restore](kui_shell_core.HistoryModel.md#restore)
- [save](kui_shell_core.HistoryModel.md#save)
- [slice](kui_shell_core.HistoryModel.md#slice)
- [update](kui_shell_core.HistoryModel.md#update)
- [wipe](kui_shell_core.HistoryModel.md#wipe)

## Constructors

### constructor

• **new HistoryModel**(`uuid`)

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `uuid` | `string` |

#### Defined in

[packages/core/src/models/history.ts:52](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L52)

## Properties

### \_cursor

• `Private` **\_cursor**: `number`

#### Defined in

[packages/core/src/models/history.ts:43](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L43)

---

### \_lines

• `Private` **\_lines**: [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)[]

#### Defined in

[packages/core/src/models/history.ts:42](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L42)

---

### masterUUID

▪ `Static` `Private` **masterUUID**: `string`

Facilitate copying master history to new Tabs

#### Defined in

[packages/core/src/models/history.ts:46](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L46)

## Accessors

### cursor

• `get` **cursor**(): `number`

#### Returns

`number`

#### Defined in

[packages/core/src/models/history.ts:98](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L98)

## Methods

### add

▸ **add**(`line`): `number`

add a line of repl history

#### Parameters

| Name   | Type                                                                           |
| :----- | :----------------------------------------------------------------------------- |
| `line` | `Pick`<[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md), `"raw"`\> |

#### Returns

`number`

#### Defined in

[packages/core/src/models/history.ts:147](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L147)

---

### find

▸ **find**(`filter`): [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

Search the history model

#### Parameters

| Name     | Type             | Description                                        |
| :------- | :--------------- | :------------------------------------------------- |
| `filter` | `FilterFunction` | a search string, search regexp, or search function |

#### Returns

[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

#### Defined in

[packages/core/src/models/history.ts:226](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L226)

---

### findIndex

▸ **findIndex**(`filter`, `startIdx?`): `number`

Search the history model

#### Parameters

| Name        | Type                                     | Description                                                                                    |
| :---------- | :--------------------------------------- | :--------------------------------------------------------------------------------------------- |
| `filter`    | `string` \| `RegExp` \| `FilterFunction` | a search string, search regexp, or search function                                             |
| `startIdx?` | `number`                                 | if undefined or negative, start from the end, otherwise, search backwards from the given index |

#### Returns

`number`

#### Defined in

[packages/core/src/models/history.ts:199](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L199)

---

### first

▸ **first**(): [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

return to the oldest entry

#### Returns

[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

#### Defined in

[packages/core/src/models/history.ts:180](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L180)

---

### guardedChange

▸ `Private` **guardedChange**(`incr`): `number`

change the cursor, protecting against under- and overflow

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `incr` | `number` |

#### Returns

`number`

#### Defined in

[packages/core/src/models/history.ts:103](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L103)

---

### key

▸ `Private` **key**(`uuid?`): `string`

The persistence key for this tab

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `uuid` | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/models/history.ts:85](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L85)

---

### last

▸ **last**(): [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

return to the newest entry

#### Returns

[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

#### Defined in

[packages/core/src/models/history.ts:186](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L186)

---

### line

▸ **line**(`idx`): [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

return the given line of history

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `idx` | `number` |

#### Returns

[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

#### Defined in

[packages/core/src/models/history.ts:90](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L90)

---

### lineByIncr

▸ **lineByIncr**(`incr`): [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `incr` | `number` |

#### Returns

[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

#### Defined in

[packages/core/src/models/history.ts:165](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L165)

---

### next

▸ **next**(): [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

go forward one entry

#### Returns

[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

#### Defined in

[packages/core/src/models/history.ts:175](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L175)

---

### previous

▸ **previous**(): [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

go back one entry

#### Returns

[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)

#### Defined in

[packages/core/src/models/history.ts:170](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L170)

---

### restore

▸ `Private` **restore**(`uuid?`): `any`

Low-level restore from persistent storage

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `uuid` | `string` |

#### Returns

`any`

#### Defined in

[packages/core/src/models/history.ts:124](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L124)

---

### save

▸ `Private` **save**(`lines?`, `uuid?`): `void`

Low-level save to persistent storage

#### Parameters

| Name    | Type                                                           |
| :------ | :------------------------------------------------------------- |
| `lines` | [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)[] |
| `uuid`  | `string`                                                       |

#### Returns

`void`

#### Defined in

[packages/core/src/models/history.ts:119](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L119)

---

### slice

▸ **slice**(`start`, `end?`): [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)[]

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `start` | `number` |
| `end?`  | `number` |

#### Returns

[`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)[]

#### Defined in

[packages/core/src/models/history.ts:94](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L94)

---

### update

▸ **update**(`cursor`, `updateFn`): `Promise`<`void`\>

update a line of repl history -- for async operations

#### Parameters

| Name       | Type                                                                                                   |
| :--------- | :----------------------------------------------------------------------------------------------------- |
| `cursor`   | `number`                                                                                               |
| `updateFn` | (`line`: [`HistoryLine`](../interfaces/kui_shell_core.HistoryLine.md)) => `void` \| `Promise`<`void`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/models/history.ts:159](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L159)

---

### wipe

▸ **wipe**(): `boolean`

Clear out all history

#### Returns

`boolean`

#### Defined in

[packages/core/src/models/history.ts:140](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/history.ts#L140)
