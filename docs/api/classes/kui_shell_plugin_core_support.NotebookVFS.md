[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-core-support](../modules/kui_shell_plugin_core_support.md) / NotebookVFS

# Class: NotebookVFS

[@kui-shell/plugin-core-support](../modules/kui_shell_plugin_core_support.md).NotebookVFS

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
- [dirPattern](kui_shell_plugin_core_support.NotebookVFS.md#dirpattern)
- [enumerate](kui_shell_plugin_core_support.NotebookVFS.md#enumerate)
- [find](kui_shell_plugin_core_support.NotebookVFS.md#find)
- [findExact](kui_shell_plugin_core_support.NotebookVFS.md#findexact)
- [fslice](kui_shell_plugin_core_support.NotebookVFS.md#fslice)
- [fstat](kui_shell_plugin_core_support.NotebookVFS.md#fstat)
- [fwrite](kui_shell_plugin_core_support.NotebookVFS.md#fwrite)
- [glob2RegExp](kui_shell_plugin_core_support.NotebookVFS.md#glob2regexp)
- [load](kui_shell_plugin_core_support.NotebookVFS.md#load)
- [ls](kui_shell_plugin_core_support.NotebookVFS.md#ls)
- [mkdir](kui_shell_plugin_core_support.NotebookVFS.md#mkdir)
- [rm](kui_shell_plugin_core_support.NotebookVFS.md#rm)
- [rmdir](kui_shell_plugin_core_support.NotebookVFS.md#rmdir)

## Constructors

### constructor

• **new NotebookVFS**(`mountPath?`)

#### Parameters

| Name        | Type     | Default value |
| :---------- | :------- | :------------ |
| `mountPath` | `string` | `'/kui'`      |

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:62](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L62)

## Properties

### isLocal

• `Readonly` **isLocal**: `false`

#### Implementation of

VFS.isLocal

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:54](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L54)

---

### isVirtual

• `Readonly` **isVirtual**: `true`

#### Implementation of

VFS.isVirtual

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:55](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L55)

---

### mountPath

• `Readonly` **mountPath**: `string` = `'/kui'`

#### Implementation of

VFS.mountPath

---

### prefix

• `Protected` `Readonly` **prefix**: `RegExp`

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:57](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L57)

---

### trie

• `Private` `Readonly` **trie**: `any`

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:59](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L59)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:228](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L228)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:69](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L69)

---

### enumerate

▸ `Private` **enumerate**(`__namedParameters`): `Promise`<{ `dirent`: { `isDirectory`: `boolean` = isDir; `isExecutable`: `boolean` = false; `isFile`: `boolean` = !isDir; `isSpecial`: `boolean` = false; `isSymbolicLink`: `boolean` = false; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` = ''; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` = mount.mountPath; `stats`: { `gid`: `number` ; `mode`: `number` = 0; `mtimeMs`: `number` = 0; `size`: `number` = 0; `uid`: `number` } }[]\>

#### Parameters

| Name                        | Type      |
| :-------------------------- | :-------- |
| `__namedParameters`         | `Object`  |
| `__namedParameters.entries` | `Entry`[] |

#### Returns

`Promise`<{ `dirent`: { `isDirectory`: `boolean` = isDir; `isExecutable`: `boolean` = false; `isFile`: `boolean` = !isDir; `isSpecial`: `boolean` = false; `isSymbolicLink`: `boolean` = false; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` = ''; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` = mount.mountPath; `stats`: { `gid`: `number` ; `mode`: `number` = 0; `mtimeMs`: `number` = 0; `size`: `number` = 0; `uid`: `number` } }[]\>

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:139](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L139)

---

### find

▸ `Private` **find**(`filepath`, `dashD?`, `exact?`): `Entry`[]

Looks in the trie for any matches for the given filepath, handling the "contents of directory" case

#### Parameters

| Name       | Type      | Default value |
| :--------- | :-------- | :------------ |
| `filepath` | `string`  | `undefined`   |
| `dashD`    | `boolean` | `false`       |
| `exact`    | `boolean` | `false`       |

#### Returns

`Entry`[]

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:79](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L79)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:96](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L96)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:284](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L284)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:259](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L259)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:279](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L279)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:65](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L65)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:185](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L185)

---

### ls

▸ **ls**(`__namedParameters`, `filepaths`): `Promise`<{ `dirent`: { `isDirectory`: `boolean` = isDir; `isExecutable`: `boolean` = false; `isFile`: `boolean` = !isDir; `isSpecial`: `boolean` = false; `isSymbolicLink`: `boolean` = false; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` = ''; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` = mount.mountPath; `stats`: { `gid`: `number` ; `mode`: `number` = 0; `mtimeMs`: `number` = 0; `size`: `number` = 0; `uid`: `number` } }[]\>

#### Parameters

| Name                | Type                                                                                  |
| :------------------ | :------------------------------------------------------------------------------------ |
| `__namedParameters` | `Pick`<`EvaluatorArgs`<`KuiGlobOptions`\>, `"tab"` \| `"REPL"` \| `"parsedOptions"`\> |
| `filepaths`         | `string`[]                                                                            |

#### Returns

`Promise`<{ `dirent`: { `isDirectory`: `boolean` = isDir; `isExecutable`: `boolean` = false; `isFile`: `boolean` = !isDir; `isSpecial`: `boolean` = false; `isSymbolicLink`: `boolean` = false; `mount`: { `isLocal`: `boolean` ; `mountPath`: `string` } ; `permissions`: `string` = ''; `username`: `string` } ; `name`: `string` ; `nameForDisplay`: `string` ; `path`: `string` = mount.mountPath; `stats`: { `gid`: `number` ; `mode`: `number` = 0; `mtimeMs`: `number` = 0; `size`: `number` = 0; `uid`: `number` } }[]\>

#### Implementation of

VFS.ls

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:173](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L173)

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

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:300](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L300)

---

### rm

▸ **rm**(): `Promise`<`string` \| `boolean`\>

Remove filepath

#### Returns

`Promise`<`string` \| `boolean`\>

#### Implementation of

VFS.rm

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:254](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L254)

---

### rmdir

▸ **rmdir**(): `Promise`<`void`\>

Remove a directory/bucket

#### Returns

`Promise`<`void`\>

#### Implementation of

VFS.rmdir

#### Defined in

[plugins/plugin-core-support/src/notebooks/vfs/index.ts:306](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-core-support/src/notebooks/vfs/index.ts#L306)
