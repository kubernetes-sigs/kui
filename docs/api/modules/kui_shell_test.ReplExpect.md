[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/test](kui_shell_test.md) / ReplExpect

# Namespace: ReplExpect

[@kui-shell/test](kui_shell_test.md).ReplExpect

## Table of contents

### Interfaces

- [AppAndCount](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)

### Functions

- [blank](kui_shell_test.ReplExpect.md#blank)
- [blankWithOpts](kui_shell_test.ReplExpect.md#blankwithopts)
- [blockAfter](kui_shell_test.ReplExpect.md#blockafter)
- [blockCount](kui_shell_test.ReplExpect.md#blockcount)
- [comment](kui_shell_test.ReplExpect.md#comment)
- [consoleToBeClear](kui_shell_test.ReplExpect.md#consoletobeclear)
- [elsewhere](kui_shell_test.ReplExpect.md#elsewhere)
- [error](kui_shell_test.ReplExpect.md#error)
- [justOK](kui_shell_test.ReplExpect.md#justok)
- [ok](kui_shell_test.ReplExpect.md#ok)
- [okWith](kui_shell_test.ReplExpect.md#okwith)
- [okWithAny](kui_shell_test.ReplExpect.md#okwithany)
- [okWithCustom](kui_shell_test.ReplExpect.md#okwithcustom)
- [okWithDropDownList](kui_shell_test.ReplExpect.md#okwithdropdownlist)
- [okWithEvents](kui_shell_test.ReplExpect.md#okwithevents)
- [okWithOnly](kui_shell_test.ReplExpect.md#okwithonly)
- [okWithPtyOutput](kui_shell_test.ReplExpect.md#okwithptyoutput)
- [okWithPtyOutputEventually](kui_shell_test.ReplExpect.md#okwithptyoutputeventually)
- [okWithStreamingOutput](kui_shell_test.ReplExpect.md#okwithstreamingoutput)
- [okWithString](kui_shell_test.ReplExpect.md#okwithstring)
- [okWithStringEventually](kui_shell_test.ReplExpect.md#okwithstringeventually)
- [okWithTextContent](kui_shell_test.ReplExpect.md#okwithtextcontent)
- [splitCount](kui_shell_test.ReplExpect.md#splitcount)
- [tableWithNRows](kui_shell_test.ReplExpect.md#tablewithnrows)

## Functions

### blank

▸ `Const` **blank**(`res`): `Promise`<`boolean`\>

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:201](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L201)

---

### blankWithOpts

▸ `Const` **blankWithOpts**(`opts?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `opts` | `Object` |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:198](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L198)

---

### blockAfter

▸ **blockAfter**(`res`, `delta?`): [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)

Transform the given block finder to one that can find the next block

#### Parameters

| Name    | Type                                                                    | Default value |
| :------ | :---------------------------------------------------------------------- | :------------ |
| `res`   | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) | `undefined`   |
| `delta` | `number`                                                                | `1`           |

#### Returns

[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)

#### Defined in

[packages/test/src/api/repl-expect.ts:469](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L469)

---

### blockCount

▸ **blockCount**(): `Object`

Verify that the number of blocks equals the expected count

#### Returns

`Object`

| Name      | Type                                                                                     |
| :-------- | :--------------------------------------------------------------------------------------- |
| `inSplit` | (`splitIndex`: `number`) => { `is`: (`expected`: `number` \| () => `number`) => `void` } |

#### Defined in

[packages/test/src/api/repl-expect.ts:437](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L437)

---

### comment

▸ **comment**(`expectedBody`, `expectedTitle?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

Expect a CommentaryResponse

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `expectedBody`   | `string` |
| `expectedTitle?` | `string` |

#### Returns

`fn`

▸ (`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/repl-expect.ts:413](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L413)

---

### consoleToBeClear

▸ `Const` **consoleToBeClear**(`app`, `residualBlockCount?`, `splitIndex?`): `Promise`<`boolean`\>

The return type `any` comes from webdriverio waitUntil

#### Parameters

| Name                 | Type          | Default value |
| :------------------- | :------------ | :------------ |
| `app`                | `Application` | `undefined`   |
| `residualBlockCount` | `number`      | `1`           |
| `splitIndex`         | `number`      | `1`           |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:204](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L204)

---

### elsewhere

▸ **elsewhere**(`expectedBody`, `N?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`Application`\>

Expect an ElsewhereCommentaryResponse

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `expectedBody` | `string` |
| `N?`           | `number` |

#### Returns

`fn`

▸ (`res`): `Promise`<`Application`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`Application`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:392](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L392)

---

### error

▸ `Const` **error**(`statusCode`, `expect?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`Application`\>

#### Parameters

| Name         | Type                 |
| :----------- | :------------------- |
| `statusCode` | `string` \| `number` |
| `expect?`    | `string`             |

#### Returns

`fn`

▸ (`res`): `Promise`<`Application`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`Application`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:174](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L174)

---

### justOK

▸ `Const` **justOK**(`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

expect just ok, and no result value

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/repl-expect.ts:353](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L353)

---

### ok

▸ `Const` **ok**(`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/repl-expect.ts:168](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L168)

---

### okWith

▸ `Const` **okWith**(`entityName`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

expect ok and at least the given result value

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `entityName` | `string` |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:350](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L350)

---

### okWithAny

▸ `Const` **okWithAny**(`res`): `Promise`<`boolean`\>

as long as its ok, accept anything

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:342](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L342)

---

### okWithCustom

▸ `Const` **okWithCustom**<`T`\>(`custom`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`T`\>

as long as its ok, accept anything

#### Type parameters

| Name | Type                          |
| :--- | :---------------------------- |
| `T`  | extends `string` \| `boolean` |

#### Parameters

| Name     | Type         |
| :------- | :----------- |
| `custom` | `CustomSpec` |

#### Returns

`fn`

▸ (`res`): `Promise`<`T`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`T`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:221](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L221)

---

### okWithDropDownList

▸ `Const` **okWithDropDownList**(`openAndExpectLabel`, `click?`, `closeAfterOpen?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name                 | Type      | Default value |
| :------------------- | :-------- | :------------ |
| `openAndExpectLabel` | `string`  | `undefined`   |
| `click`              | `boolean` | `false`       |
| `closeAfterOpen`     | `boolean` | `true`        |

#### Returns

`fn`

▸ (`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/repl-expect.ts:294](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L294)

---

### okWithEvents

▸ `Const` **okWithEvents**(`ctx`, `res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `ctx` | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md)               |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/repl-expect.ts:325](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L325)

---

### okWithOnly

▸ `Const` **okWithOnly**(`entityName`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

expect ok and _only_ the given result value

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `entityName` | `string` |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:345](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L345)

---

### okWithPtyOutput

▸ `Const` **okWithPtyOutput**(`expect`, `exact?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

#### Parameters

| Name     | Type      | Default value |
| :------- | :-------- | :------------ |
| `expect` | `string`  | `undefined`   |
| `exact`  | `boolean` | `false`       |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:266](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L266)

---

### okWithPtyOutputEventually

▸ `Const` **okWithPtyOutputEventually**(`expect`, `exact?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

#### Parameters

| Name     | Type      | Default value |
| :------- | :-------- | :------------ |
| `expect` | `string`  | `undefined`   |
| `exact`  | `boolean` | `false`       |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:281](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L281)

---

### okWithStreamingOutput

▸ `Const` **okWithStreamingOutput**(`expect`, `exact?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

#### Parameters

| Name     | Type      | Default value |
| :------- | :-------- | :------------ |
| `expect` | `string`  | `undefined`   |
| `exact`  | `boolean` | `false`       |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:265](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L265)

---

### okWithString

▸ `Const` **okWithString**(`expect`, `exact?`, `streaming?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

#### Parameters

| Name        | Type      | Default value |
| :---------- | :-------- | :------------ |
| `expect`    | `string`  | `undefined`   |
| `exact`     | `boolean` | `false`       |
| `streaming` | `boolean` | `false`       |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:252](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L252)

---

### okWithStringEventually

▸ `Const` **okWithStringEventually**(`expect`, `exact?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

#### Parameters

| Name     | Type      | Default value |
| :------- | :-------- | :------------ |
| `expect` | `string`  | `undefined`   |
| `exact`  | `boolean` | `false`       |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:268](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L268)

---

### okWithTextContent

▸ `Const` **okWithTextContent**(`expect`, `exact?`, `failFast?`, `sel?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

#### Parameters

| Name       | Type      | Default value |
| :--------- | :-------- | :------------ |
| `expect`   | `string`  | `undefined`   |
| `exact`    | `boolean` | `false`       |
| `failFast` | `boolean` | `true`        |
| `sel`      | `string`  | `' '`         |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:224](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L224)

---

### splitCount

▸ **splitCount**(`expectedSplitCount`, `inverseColors?`, `expectedSplitIndex?`): (`app`: `Application`) => `Promise`<`void`\>

Expect the given number of terminal splits in the current tab, and check whether the last split has inverse colors

#### Parameters

| Name                  | Type      | Default value |
| :-------------------- | :-------- | :------------ |
| `expectedSplitCount`  | `number`  | `undefined`   |
| `inverseColors`       | `boolean` | `false`       |
| `expectedSplitIndex?` | `number`  | `undefined`   |

#### Returns

`fn`

▸ (`app`): `Promise`<`void`\>

##### Parameters

| Name  | Type          |
| :---- | :------------ |
| `app` | `Application` |

##### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:356](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L356)

---

### tableWithNRows

▸ **tableWithNRows**(`N`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<`boolean`\>

Expect table with N rows

#### Parameters

| Name | Type     |
| :--- | :------- |
| `N`  | `number` |

#### Returns

`fn`

▸ (`res`): `Promise`<`boolean`\>

##### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

##### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/repl-expect.ts:379](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/repl-expect.ts#L379)
