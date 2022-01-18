[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](kui_shell_core.md) / Util

# Namespace: Util

[@kui-shell/core](kui_shell_core.md).Util

## Table of contents

### Functions

- [absolute](kui_shell_core.Util.md#absolute)
- [base64PlusGzip](kui_shell_core.Util.md#base64plusgzip)
- [cwd](kui_shell_core.Util.md#cwd)
- [decodeBase64PlusGzip](kui_shell_core.Util.md#decodebase64plusgzip)
- [expandHomeDir](kui_shell_core.Util.md#expandhomedir)
- [fallbackCWD](kui_shell_core.Util.md#fallbackcwd)
- [flatten](kui_shell_core.Util.md#flatten)
- [isHTML](kui_shell_core.Util.md#ishtml)
- [isPromise](kui_shell_core.Util.md#ispromise)
- [prettyPrintBytes](kui_shell_core.Util.md#prettyprintbytes)
- [prettyPrintTime](kui_shell_core.Util.md#prettyprinttime)
- [promiseEach](kui_shell_core.Util.md#promiseeach)

## Functions

### absolute

▸ **absolute**(`filepath`): `string`

Notes:

- path.resolve() turns /kui/x into c:\kui\x. We just want to
  absolute-ify a local filepath if it isn't already so.

- this only works for local filepaths; if we wanted this to work
  for all kui VFS, we would need to use `vfs ls`, which is
  asynchronous.

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filepath` | `string` |

#### Returns

`string`

An absolute path for the given `path`, only if it is not already absolute

#### Defined in

[packages/core/src/util/absolute.ts:31](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/absolute.ts#L31)

---

### base64PlusGzip

▸ **base64PlusGzip**(`plaintext`, `compress?`): `string`

#### Parameters

| Name        | Type      | Default value |
| :---------- | :-------- | :------------ |
| `plaintext` | `string`  | `undefined`   |
| `compress`  | `boolean` | `true`        |

#### Returns

`string`

a base64-encoded and gzip-compressed version of the given
`plaintext`

#### Defined in

[packages/core/src/util/gzip.ts:24](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/gzip.ts#L24)

---

### cwd

▸ `Const` **cwd**(): `string`

#### Returns

`string`

#### Defined in

[packages/core/src/util/home.ts:49](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/home.ts#L49)

---

### decodeBase64PlusGzip

▸ **decodeBase64PlusGzip**(`data`, `compressed?`): `Buffer`

#### Parameters

| Name         | Type      | Default value |
| :----------- | :-------- | :------------ |
| `data`       | `string`  | `undefined`   |
| `compressed` | `boolean` | `true`        |

#### Returns

`Buffer`

the reverse of `base64PlusGzip`

#### Defined in

[packages/core/src/util/gzip.ts:33](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/gzip.ts#L33)

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

[packages/core/src/util/home.ts:24](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/home.ts#L24)

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

[packages/core/src/util/home.ts:41](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/home.ts#L41)

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

[packages/core/src/core/utility.ts:72](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/utility.ts#L72)

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

[packages/core/src/util/types.ts:21](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/types.ts#L21)

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

[packages/core/src/util/types.ts:25](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/types.ts#L25)

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

[packages/core/src/webapp/util/bytes.ts:18](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/webapp/util/bytes.ts#L18)

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

[packages/core/src/webapp/util/time.ts:36](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/webapp/util/time.ts#L36)

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

[packages/core/src/util/async.ts:22](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/util/async.ts#L22)
