[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-core-support](../modules/kui_shell_plugin_core_support.md) / NotebookVFS

# Class: NotebookVFS

[@kui-shell/plugin-core-support](../modules/kui_shell_plugin_core_support.md).NotebookVFS

## Hierarchy

- [`TrieVFS`](kui_shell_plugin_core_support.TrieVFS.md)<`NotebookLeaf`[``"data"``]\>

  ↳ **`NotebookVFS`**

## Implements

- `VFS`

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_core_support.NotebookVFS.md#constructor)

### Properties

- [isLocal](kui_shell_plugin_core_support.NotebookVFS.md#islocal)
- [isVirtual](kui_shell_plugin_core_support.NotebookVFS.md#isvirtual)
- [mountPath](kui_shell_plugin_core_support.NotebookVFS.md#mountpath)
- [prefix](kui_shell_plugin_core_support.NotebookVFS.md#prefix)
- [trie](kui_shell_plugin_core_support.NotebookVFS.md#trie)

### Methods

- [cp](kui_shell_plugin_core_support.NotebookVFS.md#cp)
- [fslice](kui_shell_plugin_core_support.NotebookVFS.md#fslice)
- [fstat](kui_shell_plugin_core_support.NotebookVFS.md#fstat)
- [fwrite](kui_shell_plugin_core_support.NotebookVFS.md#fwrite)
- [isLeaf](kui_shell_plugin_core_support.NotebookVFS.md#isleaf)
- [load](kui_shell_plugin_core_support.NotebookVFS.md#load)
- [loadAsString](kui_shell_plugin_core_support.NotebookVFS.md#loadasstring)
- [ls](kui_shell_plugin_core_support.NotebookVFS.md#ls)
- [mkdir](kui_shell_plugin_core_support.NotebookVFS.md#mkdir)
- [nameForDisplay](kui_shell_plugin_core_support.NotebookVFS.md#namefordisplay)
- [rm](kui_shell_plugin_core_support.NotebookVFS.md#rm)
- [rmdir](kui_shell_plugin_core_support.NotebookVFS.md#rmdir)
- [viewer](kui_shell_plugin_core_support.NotebookVFS.md#viewer)

## Constructors

### constructor

• **new NotebookVFS**(`mountPath?`)

#### Parameters

| Name        | Type     | Default value |
| :---------- | :------- | :------------ |
| `mountPath` | `string` | `'/kui'`      |

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[constructor](kui_shell_plugin_core_support.TrieVFS.md#constructor)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:51](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L51)

## Properties

### isLocal

• `Readonly` **isLocal**: `false`

#### Implementation of

VFS.isLocal

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[isLocal](kui_shell_plugin_core_support.TrieVFS.md#islocal)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:43](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L43)

---

### isVirtual

• `Readonly` **isVirtual**: `true`

#### Implementation of

VFS.isVirtual

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[isVirtual](kui_shell_plugin_core_support.TrieVFS.md#isvirtual)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:44](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L44)

---

### mountPath

• `Readonly` **mountPath**: `string` = `'/kui'`

#### Implementation of

VFS.mountPath

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[mountPath](kui_shell_plugin_core_support.TrieVFS.md#mountpath)

---

### prefix

• `Protected` `Readonly` **prefix**: `RegExp`

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[prefix](kui_shell_plugin_core_support.TrieVFS.md#prefix)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:46](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L46)

---

### trie

• `Protected` `Readonly` **trie**: `any`

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[trie](kui_shell_plugin_core_support.TrieVFS.md#trie)

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

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[cp](kui_shell_plugin_core_support.TrieVFS.md#cp)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:181](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L181)

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

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[fslice](kui_shell_plugin_core_support.TrieVFS.md#fslice)

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

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[fstat](kui_shell_plugin_core_support.TrieVFS.md#fstat)

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

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[fwrite](kui_shell_plugin_core_support.TrieVFS.md#fwrite)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:233](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L233)

---

### isLeaf

▸ `Protected` **isLeaf**(`entry`): entry is Leaf<Notebook \| Object\>

#### Parameters

| Name    | Type                                                              |
| :------ | :---------------------------------------------------------------- |
| `entry` | `BaseEntry` \| `Leaf`<`Notebook` \| { `srcFilepath`: `string` }\> |

#### Returns

entry is Leaf<Notebook \| Object\>

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[isLeaf](kui_shell_plugin_core_support.TrieVFS.md#isleaf)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:65](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L65)

---

### load

▸ `Private` **load**(`data`): `Promise`<`Notebook`\>

Load Notebook data from bundles

#### Parameters

| Name   | Type                                      |
| :----- | :---------------------------------------- |
| `data` | `Notebook` \| { `srcFilepath`: `string` } |

#### Returns

`Promise`<`Notebook`\>

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:49](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L49)

---

### loadAsString

▸ `Protected` **loadAsString**(`leaf`): `Promise`<`string`\>

#### Parameters

| Name   | Type           |
| :----- | :------------- |
| `leaf` | `NotebookLeaf` |

#### Returns

`Promise`<`string`\>

#### Overrides

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[loadAsString](kui_shell_plugin_core_support.TrieVFS.md#loadasstring)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:43](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L43)

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

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[ls](kui_shell_plugin_core_support.TrieVFS.md#ls)

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

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[mkdir](kui_shell_plugin_core_support.TrieVFS.md#mkdir)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:254](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L254)

---

### nameForDisplay

▸ `Protected` **nameForDisplay**(`name`, `entry`): `Promise`<`string`\>

#### Parameters

| Name    | Type            |
| :------ | :-------------- |
| `name`  | `string`        |
| `entry` | `NotebookEntry` |

#### Returns

`Promise`<`string`\>

#### Overrides

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[nameForDisplay](kui_shell_plugin_core_support.TrieVFS.md#namefordisplay)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:38](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L38)

---

### rm

▸ **rm**(): `Promise`<`string` \| `boolean`\>

Remove filepath

#### Returns

`Promise`<`string` \| `boolean`\>

#### Implementation of

VFS.rm

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[rm](kui_shell_plugin_core_support.TrieVFS.md#rm)

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

#### Inherited from

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[rmdir](kui_shell_plugin_core_support.TrieVFS.md#rmdir)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts:260](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/TrieVFS.ts#L260)

---

### viewer

▸ `Protected` **viewer**(): `string`

#### Returns

`string`

#### Overrides

[TrieVFS](kui_shell_plugin_core_support.TrieVFS.md).[viewer](kui_shell_plugin_core_support.TrieVFS.md#viewer)

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:34](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L34)
