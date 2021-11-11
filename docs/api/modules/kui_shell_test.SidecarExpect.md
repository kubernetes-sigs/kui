[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/test](kui_shell_test.md) / SidecarExpect

# Namespace: SidecarExpect

[@kui-shell/test](kui_shell_test.md).SidecarExpect

## Table of contents

### Functions

- [badge](kui_shell_test.SidecarExpect.md#badge)
- [breadcrumbs](kui_shell_test.SidecarExpect.md#breadcrumbs)
- [button](kui_shell_test.SidecarExpect.md#button)
- [closed](kui_shell_test.SidecarExpect.md#closed)
- [defaultMode](kui_shell_test.SidecarExpect.md#defaultmode)
- [descriptionList](kui_shell_test.SidecarExpect.md#descriptionlist)
- [form](kui_shell_test.SidecarExpect.md#form)
- [fullyClosed](kui_shell_test.SidecarExpect.md#fullyclosed)
- [heroName](kui_shell_test.SidecarExpect.md#heroname)
- [keyToClose](kui_shell_test.SidecarExpect.md#keytoclose)
- [kind](kui_shell_test.SidecarExpect.md#kind)
- [mode](kui_shell_test.SidecarExpect.md#mode)
- [modes](kui_shell_test.SidecarExpect.md#modes)
- [name](kui_shell_test.SidecarExpect.md#name)
- [namehash](kui_shell_test.SidecarExpect.md#namehash)
- [namespace](kui_shell_test.SidecarExpect.md#namespace)
- [notOpen](kui_shell_test.SidecarExpect.md#notopen)
- [open](kui_shell_test.SidecarExpect.md#open)
- [openInBlockAfter](kui_shell_test.SidecarExpect.md#openinblockafter)
- [openWithFailure](kui_shell_test.SidecarExpect.md#openwithfailure)
- [popupTitle](kui_shell_test.SidecarExpect.md#popuptitle)
- [showing](kui_shell_test.SidecarExpect.md#showing)
- [showingLeftNav](kui_shell_test.SidecarExpect.md#showingleftnav)
- [showingNotClickable](kui_shell_test.SidecarExpect.md#showingnotclickable)
- [showingTopNav](kui_shell_test.SidecarExpect.md#showingtopnav)
- [tableContent](kui_shell_test.SidecarExpect.md#tablecontent)
- [textPlainContent](kui_shell_test.SidecarExpect.md#textplaincontent)
- [textPlainContentFromMonaco](kui_shell_test.SidecarExpect.md#textplaincontentfrommonaco)
- [toolbarAlert](kui_shell_test.SidecarExpect.md#toolbaralert)
- [toolbarText](kui_shell_test.SidecarExpect.md#toolbartext)
- [yaml](kui_shell_test.SidecarExpect.md#yaml)

## Functions

### badge

▸ `Const` **badge**(`title`, `css?`, `absent?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

Expect the given badge to exist in the sidecar header

#### Parameters

| Name     | Type      | Default value |
| :------- | :-------- | :------------ |
| `title`  | `string`  | `undefined`   |
| `css?`   | `string`  | `undefined`   |
| `absent` | `boolean` | `false`       |

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

[packages/test/src/api/sidecar-expect.ts:71](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L71)

---

### breadcrumbs

▸ **breadcrumbs**(`breadcrumbs`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name          | Type       |
| :------------ | :--------- |
| `breadcrumbs` | `string`[] |

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

[packages/test/src/api/sidecar-expect.ts:369](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L369)

---

### button

▸ `Const` **button**(`button`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name            | Type     |
| :-------------- | :------- |
| `button`        | `Object` |
| `button.label?` | `string` |
| `button.mode`   | `string` |

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

[packages/test/src/api/sidecar-expect.ts:91](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L91)

---

### closed

▸ `Const` **closed**(`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

either minimized or fully closed

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:60](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L60)

---

### defaultMode

▸ `Const` **defaultMode**(`expected`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name              | Type     |
| :---------------- | :------- |
| `expected`        | `Object` |
| `expected.label?` | `string` |
| `expected.mode`   | `string` |

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

[packages/test/src/api/sidecar-expect.ts:181](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L181)

---

### descriptionList

▸ `Const` **descriptionList**(`content`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

Expect DescriptionList content in the current tab

#### Parameters

| Name      | Type                                                   |
| :-------- | :----------------------------------------------------- |
| `content` | `Record`<`string`, `string` \| `number` \| `boolean`\> |

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

[packages/test/src/api/sidecar-expect.ts:384](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L384)

---

### form

▸ **form**(`form`, `idPrefix?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

expect a form in the sidecar content

#### Parameters

| Name       | Type                          | Default value |
| :--------- | :---------------------------- | :------------ |
| `form`     | `Record`<`string`, `string`\> | `undefined`   |
| `idPrefix` | `string`                      | `'kui-form'`  |

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

[packages/test/src/api/sidecar-expect.ts:260](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L260)

---

### fullyClosed

▸ `Const` **fullyClosed**(`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

fully closed, not just minimized

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:52](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L52)

---

### heroName

▸ `Const` **heroName**(`count`, `expectedName`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `count`        | `number` |
| `expectedName` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:145](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L145)

---

### keyToClose

▸ `Const` **keyToClose**(`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

close the sidecar by ESCAPE key

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:65](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L65)

---

### kind

▸ `Const` **kind**(`expectedKind`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `expectedKind` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:153](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L153)

---

### mode

▸ `Const` **mode**(`expectedMode`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `expectedMode` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:98](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L98)

---

### modes

▸ `Const` **modes**(`expected`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name       | Type                                                                    |
| :--------- | :---------------------------------------------------------------------- |
| `expected` | { `dafaultMode?`: `boolean` ; `label?`: `string` ; `mode`: `string` }[] |

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

[packages/test/src/api/sidecar-expect.ts:157](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L157)

---

### name

▸ `Const` **name**(`count`, `expectedName`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `count`        | `number` |
| `expectedName` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:143](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L143)

---

### namehash

▸ `Const` **namehash**(`count`, `expectedNameHash`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name               | Type     |
| :----------------- | :------- |
| `count`            | `number` |
| `expectedNameHash` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:147](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L147)

---

### namespace

▸ `Const` **namespace**(`expectedNamespace`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name                | Type     |
| :------------------ | :------- |
| `expectedNamespace` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:150](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L150)

---

### notOpen

▸ `Const` **notOpen**(`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:37](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L37)

---

### open

▸ `Const` **open**(`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:25](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L25)

---

### openInBlockAfter

▸ **openInBlockAfter**(`res`, `delta?`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

Same as open(), but in the block proceding the given block

#### Parameters

| Name    | Type                                                                    | Default value |
| :------ | :---------------------------------------------------------------------- | :------------ |
| `res`   | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) | `undefined`   |
| `delta` | `number`                                                                | `1`           |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:33](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L33)

---

### openWithFailure

▸ `Const` **openWithFailure**(`res`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name  | Type                                                                    |
| :---- | :---------------------------------------------------------------------- |
| `res` | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:44](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L44)

---

### popupTitle

▸ **popupTitle**(`res`, `expectedTitle`): `Promise`<`boolean`\>

#### Parameters

| Name            | Type                                                                    |
| :-------------- | :---------------------------------------------------------------------- |
| `res`           | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |
| `expectedTitle` | `string`                                                                |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:247](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L247)

---

### showing

▸ `Const` **showing**(`expectedName`, `expectedActivationId?`, `expectSubstringMatchOnName?`, `expectedPackageName?`, `expectType?`, `waitThisLong?`, `which?`, `clickable?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name                          | Type                      |
| :---------------------------- | :------------------------ |
| `expectedName`                | `string`                  |
| `expectedActivationId?`       | `string`                  |
| `expectSubstringMatchOnName?` | `boolean`                 |
| `expectedPackageName?`        | `string`                  |
| `expectType?`                 | `string`                  |
| `waitThisLong?`               | `number`                  |
| `which?`                      | `"leftnav"` \| `"topnav"` |
| `clickable?`                  | `boolean`                 |

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

[packages/test/src/api/sidecar-expect.ts:281](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L281)

---

### showingLeftNav

▸ `Const` **showingLeftNav**(`expectedName`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `expectedName` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:366](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L366)

---

### showingNotClickable

▸ `Const` **showingNotClickable**(`expectedName`, `expectedPackageName?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name                   | Type     |
| :--------------------- | :------- |
| `expectedName`         | `string` |
| `expectedPackageName?` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:360](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L360)

---

### showingTopNav

▸ `Const` **showingTopNav**(`expectedName`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `expectedName` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:363](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L363)

---

### tableContent

▸ **tableContent**(`res`, `nRows`, `nCells`): `Promise`<`void`\>

#### Parameters

| Name     | Type                                                                    |
| :------- | :---------------------------------------------------------------------- |
| `res`    | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) |
| `nRows`  | `number`                                                                |
| `nCells` | `number`                                                                |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/sidecar-expect.ts:227](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L227)

---

### textPlainContent

▸ `Const` **textPlainContent**(`content`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `content` | `string` |

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

[packages/test/src/api/sidecar-expect.ts:201](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L201)

---

### textPlainContentFromMonaco

▸ `Const` **textPlainContentFromMonaco**(`expectedText`, `exact?`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name           | Type      | Default value |
| :------------- | :-------- | :------------ |
| `expectedText` | `string`  | `undefined`   |
| `exact`        | `boolean` | `true`        |

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

[packages/test/src/api/sidecar-expect.ts:206](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L206)

---

### toolbarAlert

▸ `Const` **toolbarAlert**(`expect`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name            | Type      |
| :-------------- | :-------- |
| `expect`        | `Object`  |
| `expect.exact?` | `boolean` |
| `expect.text`   | `string`  |
| `expect.type`   | `string`  |

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

[packages/test/src/api/sidecar-expect.ts:124](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L124)

---

### toolbarText

▸ `Const` **toolbarText**(`expect`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name              | Type      |
| :---------------- | :-------- |
| `expect`          | `Object`  |
| `expect.exact?`   | `boolean` |
| `expect.text`     | `string`  |
| `expect.timeout?` | `number`  |
| `expect.type`     | `string`  |

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

[packages/test/src/api/sidecar-expect.ts:112](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L112)

---

### yaml

▸ `Const` **yaml**(`content`): (`res`: [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)) => `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `content` | `object` |

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

[packages/test/src/api/sidecar-expect.ts:235](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/sidecar-expect.ts#L235)
