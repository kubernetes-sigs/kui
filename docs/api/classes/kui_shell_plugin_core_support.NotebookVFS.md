[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/plugin-core-support](../modules/kui_shell_plugin_core_support.md) / NotebookVFS

# Class: NotebookVFS

[@kui-shell/plugin-core-support](../modules/kui_shell_plugin_core_support.md).NotebookVFS

## Hierarchy

- `TrieVFS`<`NotebookLeaf`[``"data"``]\>

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
- [trieGet](kui_shell_plugin_core_support.NotebookVFS.md#trieget)
- [viewer](kui_shell_plugin_core_support.NotebookVFS.md#viewer)

## Constructors

### constructor

• **new NotebookVFS**(`mountPath?`, `trie?`)

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `mountPath?` | `string` |
| `trie?`      | `any`    |

#### Inherited from

TrieVFS.TrieVFS<NotebookLeaf['data']\>.constructor

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:21

## Properties

### isLocal

• `Readonly` **isLocal**: `false`

#### Implementation of

VFS.isLocal

#### Inherited from

TrieVFS.TrieVFS.isLocal

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:18

---

### isVirtual

• `Readonly` **isVirtual**: `true`

#### Implementation of

VFS.isVirtual

#### Inherited from

TrieVFS.TrieVFS.isVirtual

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:19

---

### mountPath

• `Readonly` **mountPath**: `string`

#### Implementation of

VFS.mountPath

#### Inherited from

TrieVFS.TrieVFS.mountPath

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:16

---

### prefix

• `Protected` `Readonly` **prefix**: `RegExp`

#### Inherited from

TrieVFS.TrieVFS.prefix

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:20

---

### trie

• `Protected` `Readonly` **trie**: `any`

#### Inherited from

TrieVFS.TrieVFS.trie

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:17

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

TrieVFS.TrieVFS.cp

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:62

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

TrieVFS.TrieVFS.fslice

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:69

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

TrieVFS.TrieVFS.fstat

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:66

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

TrieVFS.TrieVFS.fwrite

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:67

---

### isLeaf

▸ `Protected` **isLeaf**(`entry`): entry is Leaf<Object\>

#### Parameters

| Name    | Type                                                |
| :------ | :-------------------------------------------------- |
| `entry` | `Leaf`<{ `srcFilepath`: `string` }\> \| `BaseEntry` |

#### Returns

entry is Leaf<Object\>

#### Inherited from

TrieVFS.TrieVFS.isLeaf

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:25

---

### load

▸ `Private` **load**(`data`): `Promise`<`string`\>

Load Notebook data from bundles

#### Parameters

| Name               | Type     |
| :----------------- | :------- |
| `data`             | `Object` |
| `data.srcFilepath` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:45](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L45)

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

TrieVFS.TrieVFS.loadAsString

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:39](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L39)

---

### ls

▸ **ls**(`__namedParameters`, `filepaths`): `Promise`<{ `dirent`: { `isDirectory`: `boolean` ; `isExecutable`: `boolean` ; `isFile`: `boolean` ; `isSpecial`: `boolean` ; `isSymbolicLink`: `boolean` ; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` ; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` ; `stats`: { `gid`: `number` ; `mode`: `number` ; `mtimeMs`: `number` ; `size`: `number` ; `uid`: `number` } ; `viewer`: `string` }[]\>

#### Parameters

| Name                | Type                                                                                  |
| :------------------ | :------------------------------------------------------------------------------------ |
| `__namedParameters` | `Pick`<`EvaluatorArgs`<`KuiGlobOptions`\>, `"tab"` \| `"REPL"` \| `"parsedOptions"`\> |
| `filepaths`         | `string`[]                                                                            |

#### Returns

`Promise`<{ `dirent`: { `isDirectory`: `boolean` ; `isExecutable`: `boolean` ; `isFile`: `boolean` ; `isSpecial`: `boolean` ; `isSymbolicLink`: `boolean` ; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` ; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` ; `stats`: { `gid`: `number` ; `mode`: `number` ; `mtimeMs`: `number` ; `size`: `number` ; `uid`: `number` } ; `viewer`: `string` }[]\>

#### Implementation of

VFS.ls

#### Inherited from

TrieVFS.TrieVFS.ls

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:35

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

TrieVFS.TrieVFS.mkdir

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:71

---

### nameForDisplay

▸ `Protected` **nameForDisplay**(`name`): `Promise`<`string`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`Promise`<`string`\>

#### Overrides

TrieVFS.TrieVFS.nameForDisplay

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:35](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L35)

---

### rm

▸ **rm**(): `Promise`<`string` \| `boolean`\>

Remove filepath

#### Returns

`Promise`<`string` \| `boolean`\>

#### Implementation of

VFS.rm

#### Inherited from

TrieVFS.TrieVFS.rm

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:64

---

### rmdir

▸ **rmdir**(): `Promise`<`void`\>

Remove a directory/bucket

#### Returns

`Promise`<`void`\>

#### Implementation of

VFS.rmdir

#### Inherited from

TrieVFS.TrieVFS.rmdir

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:73

---

### trieGet

▸ `Protected` **trieGet**(`filepath`): `BaseEntry`[]

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `filepath` | `string` |

#### Returns

`BaseEntry`[]

#### Inherited from

TrieVFS.TrieVFS.trieGet

#### Defined in

plugins/plugin-bash-like/fs/mdist/vfs/TrieVFS.d.ts:29

---

### viewer

▸ `Protected` **viewer**(): `string`

#### Returns

`string`

#### Overrides

TrieVFS.TrieVFS.viewer

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:31](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L31)
