[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-core-support](../modules/kui_shell_plugin_core_support.md) / TrieVFS

# Class: TrieVFS<D, L\>

[@kui-shell/plugin-core-support](../modules/kui_shell_plugin_core_support.md).TrieVFS

## Type parameters

| Name | Type                             |
| :--- | :------------------------------- |
| `D`  | extends `any`                    |
| `L`  | extends `Leaf`<`D`\>`Leaf`<`D`\> |

## Hierarchy

- **`TrieVFS`**

  ↳ [`NotebookVFS`](kui_shell_plugin_core_support.NotebookVFS.md)

## Implements

- `VFS`

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_core_support.TrieVFS.md#constructor)

### Properties

- [isLocal](kui_shell_plugin_core_support.TrieVFS.md#islocal)
- [isVirtual](kui_shell_plugin_core_support.TrieVFS.md#isvirtual)
- [mountPath](kui_shell_plugin_core_support.TrieVFS.md#mountpath)
- [prefix](kui_shell_plugin_core_support.TrieVFS.md#prefix)
- [trie](kui_shell_plugin_core_support.TrieVFS.md#trie)

### Methods

- [cp](kui_shell_plugin_core_support.TrieVFS.md#cp)
- [dirPattern](kui_shell_plugin_core_support.TrieVFS.md#dirpattern)
- [enumerate](kui_shell_plugin_core_support.TrieVFS.md#enumerate)
- [find](kui_shell_plugin_core_support.TrieVFS.md#find)
- [findExact](kui_shell_plugin_core_support.TrieVFS.md#findexact)
- [fslice](kui_shell_plugin_core_support.TrieVFS.md#fslice)
- [fstat](kui_shell_plugin_core_support.TrieVFS.md#fstat)
- [fwrite](kui_shell_plugin_core_support.TrieVFS.md#fwrite)
- [glob2RegExp](kui_shell_plugin_core_support.TrieVFS.md#glob2regexp)
- [isLeaf](kui_shell_plugin_core_support.TrieVFS.md#isleaf)
- [loadAsString](kui_shell_plugin_core_support.TrieVFS.md#loadasstring)
- [ls](kui_shell_plugin_core_support.TrieVFS.md#ls)
- [mkdir](kui_shell_plugin_core_support.TrieVFS.md#mkdir)
- [nameForDisplay](kui_shell_plugin_core_support.TrieVFS.md#namefordisplay)
- [rm](kui_shell_plugin_core_support.TrieVFS.md#rm)
- [rmdir](kui_shell_plugin_core_support.TrieVFS.md#rmdir)
- [viewer](kui_shell_plugin_core_support.TrieVFS.md#viewer)

## Constructors

### constructor

• **new TrieVFS**<`D`, `L`\>(`mountPath?`)

#### Type parameters

| Name | Type                                  |
| :--- | :------------------------------------ |
| `D`  | extends `unknown`                     |
| `L`  | extends `Leaf`<`D`, `L`\>`Leaf`<`D`\> |

#### Parameters

| Name        | Type     | Default value |
| :---------- | :------- | :------------ |
| `mountPath` | `string` | `'/kui'`      |

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:51](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L51)

## Properties

### isLocal

• `Readonly` **isLocal**: `false`

#### Implementation of

VFS.isLocal

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:43](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L43)

---

### isVirtual

• `Readonly` **isVirtual**: `true`

#### Implementation of

VFS.isVirtual

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:44](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L44)

---

### mountPath

• `Readonly` **mountPath**: `string` = `'/kui'`

#### Implementation of

VFS.mountPath

---

### prefix

• `Protected` `Readonly` **prefix**: `RegExp`

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:46](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L46)

---

### trie

• `Protected` `Readonly` **trie**: `any`

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:48](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L48)

## Methods

### cp

▸ **cp**(`_`, `srcFilepaths`, `dstFilepath`): `Promise`<`string`\>

Insert filepath into directory

#### Parameters

| Name           | Type       |
| :------------- | :--------- |
| `_`            | `any`      |
| `srcFilepaths` | `string`[] |
| `dstFilepath`  | `string`   |

#### Returns

`Promise`<`string`\>

#### Implementation of

VFS.cp

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:181](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L181)

---

### dirPattern

▸ `Private` **dirPattern**(`filepath`): `RegExp`

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filepath` | `string` |

#### Returns

`RegExp`

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:74](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L74)

---

### enumerate

▸ `Private` **enumerate**(`__namedParameters`): `Promise`<{ `dirent`: { `isDirectory`: `boolean` = isDir; `isExecutable`: `boolean` ; `isFile`: `boolean` = !isDir; `isSpecial`: `boolean` = false; `isSymbolicLink`: `boolean` = false; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` = ''; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` = mount.mountPath; `stats`: { `gid`: `number` ; `mode`: `number` = 0; `mtimeMs`: `number` = 0; `size`: `number` = 0; `uid`: `number` } }[]\>

#### Parameters

| Name                        | Type                   |
| :-------------------------- | :--------------------- |
| `__namedParameters`         | `Object`               |
| `__namedParameters.entries` | (`L` \| `BaseEntry`)[] |

#### Returns

`Promise`<{ `dirent`: { `isDirectory`: `boolean` = isDir; `isExecutable`: `boolean` ; `isFile`: `boolean` = !isDir; `isSpecial`: `boolean` = false; `isSymbolicLink`: `boolean` = false; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` = ''; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` = mount.mountPath; `stats`: { `gid`: `number` ; `mode`: `number` = 0; `mtimeMs`: `number` = 0; `size`: `number` = 0; `uid`: `number` } }[]\>

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:136](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L136)

---

### find

▸ `Private` **find**(`filepath`, `dashD?`, `exact?`): (`L` \| `BaseEntry`)[]

Looks in the trie for any matches for the given filepath, handling the "contents of directory" case

#### Parameters

| Name       | Type      | Default value |
| :--------- | :-------- | :------------ |
| `filepath` | `string`  | `undefined`   |
| `dashD`    | `boolean` | `false`       |
| `exact`    | `boolean` | `false`       |

#### Returns

(`L` \| `BaseEntry`)[]

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:84](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L84)

---

### findExact

▸ `Private` **findExact**(`filepath`, `withData`): `Promise`<`FStat`\>

Looks in the trie for a single precise match

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `filepath` | `string`  |
| `withData` | `boolean` |

#### Returns

`Promise`<`FStat`\>

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:101](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L101)

---

### fslice

▸ **fslice**(`filename`, `offset`, `length`): `Promise`<`string`\>

Fetch content slice

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filename` | `string` |
| `offset`   | `number` |
| `length`   | `number` |

#### Returns

`Promise`<`string`\>

#### Implementation of

VFS.fslice

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:238](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L238)

---

### fstat

▸ **fstat**(`opts`, `filepath`, `withData`, `enoentOk`): `Promise`<`FStat`\>

Fetch contents

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `opts`     | `Pick`<`EvaluatorArgs`<`ParsedOptions`\>, `"REPL"` \| `"parsedOptions"`\> |
| `filepath` | `string`                                                                  |
| `withData` | `boolean`                                                                 |
| `enoentOk` | `boolean`                                                                 |

#### Returns

`Promise`<`FStat`\>

#### Implementation of

VFS.fstat

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:212](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L212)

---

### fwrite

▸ **fwrite**(`opts`, `filepath`, `data`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                 |
| :--------- | :--------------------------------------------------- |
| `opts`     | `Pick`<`EvaluatorArgs`<`ParsedOptions`\>, `"REPL"`\> |
| `filepath` | `string`                                             |
| `data`     | `string` \| `Buffer`                                 |

#### Returns

`Promise`<`void`\>

#### Implementation of

VFS.fwrite

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:233](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L233)

---

### glob2RegExp

▸ `Private` **glob2RegExp**(`filepath`): `string`

Turn an ls-style glob into a nodejs-style regexp

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filepath` | `string` |

#### Returns

`string`

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:70](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L70)

---

### isLeaf

▸ `Protected` **isLeaf**(`entry`): entry is L

#### Parameters

| Name    | Type               |
| :------ | :----------------- |
| `entry` | `L` \| `BaseEntry` |

#### Returns

entry is L

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:65](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L65)

---

### loadAsString

▸ `Protected` `Abstract` **loadAsString**(`leaf`): `Promise`<`string`\>

#### Parameters

| Name   | Type |
| :----- | :--- |
| `leaf` | `L`  |

#### Returns

`Promise`<`string`\>

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:53](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L53)

---

### ls

▸ **ls**(`__namedParameters`, `filepaths`): `Promise`<{ `dirent`: { `isDirectory`: `boolean` = isDir; `isExecutable`: `boolean` ; `isFile`: `boolean` = !isDir; `isSpecial`: `boolean` = false; `isSymbolicLink`: `boolean` = false; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` = ''; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` = mount.mountPath; `stats`: { `gid`: `number` ; `mode`: `number` = 0; `mtimeMs`: `number` = 0; `size`: `number` = 0; `uid`: `number` } }[]\>

#### Parameters

| Name                | Type                                                                                  |
| :------------------ | :------------------------------------------------------------------------------------ |
| `__namedParameters` | `Pick`<`EvaluatorArgs`<`KuiGlobOptions`\>, `"tab"` \| `"REPL"` \| `"parsedOptions"`\> |
| `filepaths`         | `string`[]                                                                            |

#### Returns

`Promise`<{ `dirent`: { `isDirectory`: `boolean` = isDir; `isExecutable`: `boolean` ; `isFile`: `boolean` = !isDir; `isSpecial`: `boolean` = false; `isSymbolicLink`: `boolean` = false; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` = ''; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` = mount.mountPath; `stats`: { `gid`: `number` ; `mode`: `number` = 0; `mtimeMs`: `number` = 0; `size`: `number` = 0; `uid`: `number` } }[]\>

#### Implementation of

VFS.ls

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:169](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L169)

---

### mkdir

▸ **mkdir**(`opts`): `Promise`<`void`\>

Create a directory/bucket

#### Parameters

| Name   | Type                                                          |
| :----- | :------------------------------------------------------------ |
| `opts` | `Pick`<`EvaluatorArgs`<`ParsedOptions`\>, `"argvNoOptions"`\> |

#### Returns

`Promise`<`void`\>

#### Implementation of

VFS.mkdir

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:254](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L254)

---

### nameForDisplay

▸ `Protected` **nameForDisplay**(`name`, `entry`): `string` \| `Promise`<`string`\>

#### Parameters

| Name    | Type               |
| :------ | :----------------- |
| `name`  | `string`           |
| `entry` | `L` \| `BaseEntry` |

#### Returns

`string` \| `Promise`<`string`\>

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:56](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L56)

---

### rm

▸ **rm**(): `Promise`<`string` \| `boolean`\>

Remove filepath

#### Returns

`Promise`<`string` \| `boolean`\>

#### Implementation of

VFS.rm

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:207](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L207)

---

### rmdir

▸ **rmdir**(): `Promise`<`void`\>

Remove a directory/bucket

#### Returns

`Promise`<`void`\>

#### Implementation of

VFS.rmdir

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:260](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L260)

---

### viewer

▸ `Protected` **viewer**(`leaf`): `string`

#### Parameters

| Name   | Type         |
| :----- | :----------- |
| `leaf` | `Leaf`<`D`\> |

#### Returns

`string`

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:61](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L61)
