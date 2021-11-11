[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/test](kui_shell_test.md) / Util

# Namespace: Util

[@kui-shell/test](kui_shell_test.md).Util

## Table of contents

### Interfaces

- [AppAndCount](../interfaces/kui_shell_test.Util.AppAndCount.md)

### Functions

- [clickBlockActionButton](kui_shell_test.Util.md#clickblockactionbutton)
- [clickNewTabButton](kui_shell_test.Util.md#clicknewtabbutton)
- [clickSidecarButtonCustomized](kui_shell_test.Util.md#clicksidecarbuttoncustomized)
- [clickSidecarModeButton](kui_shell_test.Util.md#clicksidecarmodebutton)
- [clickToExpandMonacoFold](kui_shell_test.Util.md#clicktoexpandmonacofold)
- [closeAllExceptFirstTab](kui_shell_test.Util.md#closeallexceptfirsttab)
- [copyBlockLink](kui_shell_test.Util.md#copyblocklink)
- [doCancel](kui_shell_test.Util.md#docancel)
- [doClear](kui_shell_test.Util.md#doclear)
- [doList](kui_shell_test.Util.md#dolist)
- [expectArray](kui_shell_test.Util.md#expectarray)
- [expectStruct](kui_shell_test.Util.md#expectstruct)
- [expectSubset](kui_shell_test.Util.md#expectsubset)
- [expectText](kui_shell_test.Util.md#expecttext)
- [expectYAML](kui_shell_test.Util.md#expectyaml)
- [expectYAMLSubset](kui_shell_test.Util.md#expectyamlsubset)
- [getValueFromMonaco](kui_shell_test.Util.md#getvaluefrommonaco)
- [listAndOpenSidecarNoWait](kui_shell_test.Util.md#listandopensidecarnowait)
- [markBlockAsSection](kui_shell_test.Util.md#markblockassection)
- [openSidecarByClick](kui_shell_test.Util.md#opensidecarbyclick)
- [outputOf](kui_shell_test.Util.md#outputof)
- [removeBlock](kui_shell_test.Util.md#removeblock)
- [rerunCommand](kui_shell_test.Util.md#reruncommand)
- [switchToTab](kui_shell_test.Util.md#switchtotab)
- [switchToTopLevelTabViaClick](kui_shell_test.Util.md#switchtotopleveltabviaclick)
- [tabCount](kui_shell_test.Util.md#tabcount)
- [uniqueFileForSnapshot](kui_shell_test.Util.md#uniquefileforsnapshot)
- [waitForXtermInput](kui_shell_test.Util.md#waitforxterminput)

## Functions

### clickBlockActionButton

▸ **clickBlockActionButton**(`res`, `buttonSelector`): `Promise`<`void`\>

Click the specified button action button

#### Parameters

| Name             | Type                                                              |
| :--------------- | :---------------------------------------------------------------- |
| `res`            | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |
| `buttonSelector` | `string`                                                          |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/util.ts:317](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L317)

---

### clickNewTabButton

▸ **clickNewTabButton**(`ctx`, `expectedNewTabIndex`): `Promise`<`Application`\>

#### Parameters

| Name                  | Type                                                      |
| :-------------------- | :-------------------------------------------------------- |
| `ctx`                 | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |
| `expectedNewTabIndex` | `number`                                                  |

#### Returns

`Promise`<`Application`\>

#### Defined in

[packages/test/src/api/util.ts:490](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L490)

---

### clickSidecarButtonCustomized

▸ **clickSidecarButtonCustomized**(`ctx`, `res`, `selector`): `Promise`<`void`\>

Click a sidecar button with `selector`

#### Parameters

| Name       | Type                                                              |
| :--------- | :---------------------------------------------------------------- |
| `ctx`      | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md)         |
| `res`      | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |
| `selector` | `string`                                                          |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/util.ts:446](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L446)

---

### clickSidecarModeButton

▸ **clickSidecarModeButton**(`ctx`, `res`, `mode`): `Promise`<`void`\>

Click sidecar mode button by `mode`

#### Parameters

| Name   | Type                                                              |
| :----- | :---------------------------------------------------------------- |
| `ctx`  | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md)         |
| `res`  | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |
| `mode` | `string`                                                          |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/util.ts:435](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L435)

---

### clickToExpandMonacoFold

▸ **clickToExpandMonacoFold**(`res`, `lineIdx`): `Promise`<`void`\>

Expand the fold on the given line of a monaco editor

#### Parameters

| Name      | Type                                                              |
| :-------- | :---------------------------------------------------------------- |
| `res`     | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |
| `lineIdx` | `number`                                                          |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/util.ts:183](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L183)

---

### closeAllExceptFirstTab

▸ **closeAllExceptFirstTab**(`expectedInitialNTabs`): `void`

Close all except the first tab

#### Parameters

| Name                   | Type     |
| :--------------------- | :------- |
| `expectedInitialNTabs` | `number` |

#### Returns

`void`

#### Defined in

[packages/test/src/api/util.ts:286](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L286)

---

### copyBlockLink

▸ **copyBlockLink**(`res`): `Promise`<`void`\>

Click the section button on a block, and expect it to be a section

#### Parameters

| Name  | Type                                                              |
| :---- | :---------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/util.ts:340](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L340)

---

### doCancel

▸ **doCancel**(`cmd`): `Promise`<`unknown`\>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `cmd` | `string` |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/test/src/api/util.ts:453](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L453)

---

### doClear

▸ **doClear**(`residualBlockCount`, `splitIndex?`): `Promise`<`unknown`\>

#### Parameters

| Name                 | Type     | Default value |
| :------------------- | :------- | :------------ |
| `residualBlockCount` | `number` | `undefined`   |
| `splitIndex`         | `number` | `1`           |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/test/src/api/util.ts:483](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L483)

---

### doList

▸ **doList**(`ctx`, `command`, `name`): `Promise`<`string`\>

Execute `command` and expect a table with `name`

#### Parameters

| Name      | Type                                                      |
| :-------- | :-------------------------------------------------------- |
| `ctx`     | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |
| `command` | `string`                                                  |
| `name`    | `string`                                                  |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/test/src/api/util.ts:371](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L371)

---

### expectArray

▸ `Const` **expectArray**(`expected`, `failFast?`, `subset?`): (`actual`: `string` \| `string`[]) => `boolean`

is the given actual array the same as the given expected array?

#### Parameters

| Name       | Type       | Default value |
| :--------- | :--------- | :------------ |
| `expected` | `string`[] | `undefined`   |
| `failFast` | `boolean`  | `true`        |
| `subset`   | `boolean`  | `false`       |

#### Returns

`fn`

▸ (`actual`): `boolean`

##### Parameters

| Name     | Type                   |
| :------- | :--------------------- |
| `actual` | `string` \| `string`[] |

##### Returns

`boolean`

#### Defined in

[packages/test/src/api/util.ts:157](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L157)

---

### expectStruct

▸ `Const` **expectStruct**(`struct1`, `noParse?`, `failFast?`): (`str`: `string`) => `boolean`

is the given struct2 the same as the given struct2 (given as a string)

#### Parameters

| Name       | Type      | Default value |
| :--------- | :-------- | :------------ |
| `struct1`  | `object`  | `undefined`   |
| `noParse`  | `boolean` | `false`       |
| `failFast` | `boolean` | `true`        |

#### Returns

`fn`

▸ (`str`): `boolean`

##### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

##### Returns

`boolean`

#### Defined in

[packages/test/src/api/util.ts:119](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L119)

---

### expectSubset

▸ `Const` **expectSubset**(`struct1`, `failFast?`): (`str`: `string`) => `boolean`

#### Parameters

| Name       | Type      | Default value |
| :--------- | :-------- | :------------ |
| `struct1`  | `object`  | `undefined`   |
| `failFast` | `boolean` | `true`        |

#### Returns

`fn`

▸ (`str`): `boolean`

##### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

##### Returns

`boolean`

#### Defined in

[packages/test/src/api/util.ts:105](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L105)

---

### expectText

▸ `Const` **expectText**(`app`, `expectedText`, `exact?`, `timeout?`): (`selector`: `string`) => `Promise`<`Application`\>

#### Parameters

| Name           | Type          | Default value     |
| :------------- | :------------ | :---------------- |
| `app`          | `Application` | `undefined`       |
| `expectedText` | `string`      | `undefined`       |
| `exact`        | `boolean`     | `true`            |
| `timeout`      | `number`      | `CLI.waitTimeout` |

#### Returns

`fn`

▸ (`selector`): `Promise`<`Application`\>

##### Parameters

| Name       | Type     |
| :--------- | :------- |
| `selector` | `string` |

##### Returns

`Promise`<`Application`\>

#### Defined in

[packages/test/src/api/util.ts:253](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L253)

---

### expectYAML

▸ `Const` **expectYAML**(`struct1`, `subset?`, `failFast?`): (`str`: `string`) => `boolean`

#### Parameters

| Name       | Type      | Default value |
| :--------- | :-------- | :------------ |
| `struct1`  | `object`  | `undefined`   |
| `subset`   | `boolean` | `false`       |
| `failFast` | `boolean` | `true`        |

#### Returns

`fn`

▸ (`str`): `boolean`

##### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

##### Returns

`boolean`

#### Defined in

[packages/test/src/api/util.ts:132](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L132)

---

### expectYAMLSubset

▸ `Const` **expectYAMLSubset**(`struct1`, `failFast?`): (`str`: `string`) => `boolean`

#### Parameters

| Name       | Type      | Default value |
| :--------- | :-------- | :------------ |
| `struct1`  | `object`  | `undefined`   |
| `failFast` | `boolean` | `true`        |

#### Returns

`fn`

▸ (`str`): `boolean`

##### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

##### Returns

`boolean`

#### Defined in

[packages/test/src/api/util.ts:154](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L154)

---

### getValueFromMonaco

▸ `Const` **getValueFromMonaco**(`res`, `container?`): `Promise`<`string`\>

get the monaco editor text

#### Parameters

| Name         | Type                                                              |
| :----------- | :---------------------------------------------------------------- |
| `res`        | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |
| `container?` | `string`                                                          |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/test/src/api/util.ts:214](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L214)

---

### listAndOpenSidecarNoWait

▸ **listAndOpenSidecarNoWait**(`ctx`, `command`, `name`, `mode?`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

Execute `command` and expect a table with `name`,
and then open sidecar by clicking the `name`

#### Parameters

| Name      | Type                                                      |
| :-------- | :-------------------------------------------------------- |
| `ctx`     | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |
| `command` | `string`                                                  |
| `name`    | `string`                                                  |
| `mode?`   | `string`                                                  |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/util.ts:426](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L426)

---

### markBlockAsSection

▸ **markBlockAsSection**(`res`): `Promise`<`void`\>

Click the section button on a block, and expect it to be a section

#### Parameters

| Name  | Type                                                              |
| :---- | :---------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/util.ts:335](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L335)

---

### openSidecarByClick

▸ **openSidecarByClick**(`ctx`, `selector`, `name`, `mode?`, `activationId?`, `splitIndex?`, `inNotebook?`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name            | Type                                                      | Default value |
| :-------------- | :-------------------------------------------------------- | :------------ |
| `ctx`           | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) | `undefined`   |
| `selector`      | `string`                                                  | `undefined`   |
| `name`          | `string`                                                  | `undefined`   |
| `mode?`         | `string`                                                  | `undefined`   |
| `activationId?` | `string`                                                  | `undefined`   |
| `splitIndex`    | `number`                                                  | `2`           |
| `inNotebook`    | `boolean`                                                 | `false`       |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/util.ts:380](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L380)

---

### outputOf

▸ **outputOf**(`res`): `Promise`<`string`\>

Output of the given block

#### Parameters

| Name  | Type                                                              |
| :---- | :---------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/test/src/api/util.ts:363](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L363)

---

### removeBlock

▸ **removeBlock**(`res`): `Promise`<`void`\>

Click the close button on a block, and expect it to be gone

#### Parameters

| Name  | Type                                                              |
| :---- | :---------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/util.ts:330](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L330)

---

### rerunCommand

▸ **rerunCommand**(`res`): `Promise`<`void`\>

Click the section button on a block, and expect it to be a section

#### Parameters

| Name  | Type                                                              |
| :---- | :---------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/util.ts:345](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L345)

---

### switchToTab

▸ **switchToTab**(`mode`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md)\>

Switch sidecar tab

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `mode` | `string` |

#### Returns

`fn`

▸ (`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md)\>

##### Parameters

| Name  | Type                                                              |
| :---- | :---------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md) |

##### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.Util.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/util.ts:350](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L350)

---

### switchToTopLevelTabViaClick

▸ **switchToTopLevelTabViaClick**(`ctx`, `N`): `Promise`<`unknown`\>

#### Parameters

| Name  | Type                                                      |
| :---- | :-------------------------------------------------------- |
| `ctx` | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |
| `N`   | `number`                                                  |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[packages/test/src/api/util.ts:474](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L474)

---

### tabCount

▸ **tabCount**(`app`): `Promise`<`number`\>

#### Parameters

| Name  | Type          |
| :---- | :------------ |
| `app` | `Application` |

#### Returns

`Promise`<`number`\>

the current number of tabs

#### Defined in

[packages/test/src/api/util.ts:280](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L280)

---

### uniqueFileForSnapshot

▸ **uniqueFileForSnapshot**(): `string`

#### Returns

`string`

#### Defined in

[packages/test/src/api/util.ts:312](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L312)

---

### waitForXtermInput

▸ `Const` **waitForXtermInput**(`app`, `N`): `Promise`<`boolean`\>

#### Parameters

| Name  | Type          |
| :---- | :------------ |
| `app` | `Application` |
| `N`   | `number`      |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/util.ts:248](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/util.ts#L248)
