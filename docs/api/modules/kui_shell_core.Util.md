[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](kui_shell_core.md) / Util

# Namespace: Util

[@kui-shell/core](kui_shell_core.md).Util

## Table of contents

### Functions

- [cwd](kui_shell_core.Util.md#cwd)
- [expandHomeDir](kui_shell_core.Util.md#expandhomedir)
- [fallbackCWD](kui_shell_core.Util.md#fallbackcwd)
- [findFile](kui_shell_core.Util.md#findfile)
- [flatten](kui_shell_core.Util.md#flatten)
- [isHTML](kui_shell_core.Util.md#ishtml)
- [isPromise](kui_shell_core.Util.md#ispromise)
- [prettyPrintBytes](kui_shell_core.Util.md#prettyprintbytes)
- [prettyPrintTime](kui_shell_core.Util.md#prettyprinttime)
- [promiseEach](kui_shell_core.Util.md#promiseeach)

## Functions

### cwd

▸ `Const` **cwd**(): `string`

#### Returns

`string`

#### Defined in

[packages/core/src/util/home.ts:49](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/home.ts#L49)

---

### expandHomeDir

▸ `Const` **expandHomeDir**(`path`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/util/home.ts:24](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/home.ts#L24)

---

### fallbackCWD

▸ **fallbackCWD**(`cwd?`): `string`

In case of error, e.g. removed CWD, this is our fallback plan

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `cwd?` | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/util/home.ts:41](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/home.ts#L41)

---

### findFile

▸ `Const` **findFile**(`filepath`, `keepRelative?`): `string`

Resolve @ and ~ files

#### Parameters

| Name                        | Type      | Description    |
| :-------------------------- | :-------- | :------------- |
| `filepath`                  | `string`  | -              |
| `keepRelative`              | `Object`  | don't expand ~ |
| `keepRelative.keepRelative` | `boolean` | -              |
| `keepRelative.safe`         | `boolean` | -              |

#### Returns

`string`

#### Defined in

[packages/core/src/core/find-file.ts:119](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/find-file.ts#L119)

---

### flatten

▸ **flatten**<`T`\>(`arrays`): `T`[]

flatten an array of arrays

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name     | Type    |
| :------- | :------ |
| `arrays` | `T`[][] |

#### Returns

`T`[]

#### Defined in

[packages/core/src/core/utility.ts:72](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/utility.ts#L72)

---

### isHTML

▸ **isHTML**(`message`): message is HTMLElement

#### Parameters

| Name      | Type                                                                                                                                                                                       |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | `Node` \| `Entity`<`void`, [`Row`](../classes/kui_shell_core.Row.md), [`ResourceWithMetadata`](../interfaces/kui_shell_core.ResourceWithMetadata.md)<`void`\>\> \| `MessageWithUsageModel` |

#### Returns

message is HTMLElement

#### Defined in

[packages/core/src/util/types.ts:21](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/types.ts#L21)

---

### isPromise

▸ **isPromise**<`T`, `U`\>(`content`): content is Promise<T\>

#### Type parameters

| Name |
| :--- |
| `T`  |
| `U`  |

#### Parameters

| Name      | Type                   |
| :-------- | :--------------------- |
| `content` | `U` \| `Promise`<`T`\> |

#### Returns

content is Promise<T\>

#### Defined in

[packages/core/src/util/types.ts:25](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/types.ts#L25)

---

### prettyPrintBytes

▸ **prettyPrintBytes**(`_bytes`): `string`

#### Parameters

| Name     | Type                 |
| :------- | :------------------- |
| `_bytes` | `string` \| `number` |

#### Returns

`string`

pretty-printed bytes

#### Defined in

[packages/core/src/webapp/util/bytes.ts:18](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/util/bytes.ts#L18)

---

### prettyPrintTime

▸ `Const` **prettyPrintTime**(`timestamp`, `fmt?`, `previousTimestamp?`, `execOptions?`): `HTMLElement`

Pretty print a timestamp

#### Parameters

| Name                 | Type                                             | Default value |
| :------------------- | :----------------------------------------------- | :------------ |
| `timestamp`          | `string` \| `number` \| `Date`                   | `undefined`   |
| `fmt`                | `"delta"` \| `"long"` \| `"short"` \| `"narrow"` | `'long'`      |
| `previousTimestamp?` | `string` \| `number` \| `Date`                   | `undefined`   |
| `execOptions`        | `LanguageBearing`                                | `undefined`   |

#### Returns

`HTMLElement`

#### Defined in

[packages/core/src/webapp/util/time.ts:36](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/util/time.ts#L36)

---

### promiseEach

▸ **promiseEach**<`T`, `R`\>(`arr`, `fn`): `Promise`<`R`[]\>

Map a asynchronous function to an array sequentially from front to
back.

#### Type parameters

| Name |
| :--- |
| `T`  |
| `R`  |

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `arr` | `T`[]                                                 |
| `fn`  | (`t`: `T`, `idx`: `number`) => `R` \| `Promise`<`R`\> |

#### Returns

`Promise`<`R`[]\>

#### Defined in

[packages/core/src/util/async.ts:22](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/async.ts#L22)
