[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/test](../modules/kui_shell_test.md) / TestMMR

# Class: TestMMR

[@kui-shell/test](../modules/kui_shell_test.md).TestMMR

## Table of contents

### Constructors

- [constructor](kui_shell_test.TestMMR.md#constructor)

### Properties

- [param](kui_shell_test.TestMMR.md#param)

### Methods

- [badges](kui_shell_test.TestMMR.md#badges)
- [diffPlainText](kui_shell_test.TestMMR.md#diffplaintext)
- [kind](kui_shell_test.TestMMR.md#kind)
- [modes](kui_shell_test.TestMMR.md#modes)
- [name](kui_shell_test.TestMMR.md#name)
- [namespace](kui_shell_test.TestMMR.md#namespace)
- [testClickResult](kui_shell_test.TestMMR.md#testclickresult)
- [toolbarButtons](kui_shell_test.TestMMR.md#toolbarbuttons)
- [toolbarNotExist](kui_shell_test.TestMMR.md#toolbarnotexist)
- [toolbarText](kui_shell_test.TestMMR.md#toolbartext)

## Constructors

### constructor

• **new TestMMR**(`param`)

new TestMMR() instantiates a class of multi-model-response tests

#### Parameters

| Name    | Type        | Description                              |
| :------ | :---------- | :--------------------------------------- |
| `param` | `TestParam` | includes: command, testName and metadata |

#### Defined in

[packages/test/src/api/mmr.ts:46](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L46)

## Properties

### param

• `Readonly` **param**: `TestParam`

## Methods

### badges

▸ **badges**(`badges`): `void`

badges() starts a Mocha Test Suite
badges() executes `command` in REPL and expects `badges` are showin in Sidecar

#### Parameters

| Name     | Type          | Description                                 |
| :------- | :------------ | :------------------------------------------ |
| `badges` | `BadgeSpec`[] | is the expected badges shown in the Sidecar |

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:195](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L195)

---

### diffPlainText

▸ **diffPlainText**(`mode`, `textB`): `void`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `mode`  | `string` |
| `textB` | `string` |

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:381](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L381)

---

### kind

▸ **kind**(`kind`): `void`

kind() starts a Mocha Test Suite
kind() executes `command` in REPL and expects `kind` is showin in Sidecar

#### Parameters

| Name   | Type     | Description                                    |
| :----- | :------- | :--------------------------------------------- |
| `kind` | `string` | is the expected kind text shown in the Sidecar |

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:173](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L173)

---

### modes

▸ **modes**(`expectModes`, `defaultMode`): `void`

modes() starts a Mocha Test Suite
modes() executes `command` in REPL and expects `modes` are showin in Sidecar

#### Parameters

| Name          | Type                                                            | Description                                 |
| :------------ | :-------------------------------------------------------------- | :------------------------------------------ |
| `expectModes` | [`MMRExpectMode`](../modules/kui_shell_test.md#mmrexpectmode)[] | is the expected modes shown as Sidecar Tabs |
| `defaultMode` | [`MMRExpectMode`](../modules/kui_shell_test.md#mmrexpectmode)   | is the expected default Sidecar Tab         |

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:218](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L218)

---

### name

▸ **name**(`opt?`): `void`

name() starts a Mocha Test Suite
name() executes `command` in REPL and expects `prettyName` or `name` is shown in Sidecar

#### Parameters

| Name                    | Type          |
| :---------------------- | :------------ |
| `opt?`                  | `Object`      |
| `opt.heroName?`         | `boolean`     |
| `opt.nameHash?`         | `string`      |
| `opt.onclick?`          | `Object`      |
| `opt.onclick.name?`     | `ClickExpect` |
| `opt.onclick.nameHash?` | `ClickExpect` |
| `opt.prettyName?`       | `string`      |

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:59](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L59)

---

### namespace

▸ **namespace**(`opt?`): `void`

namespace() starts a Mocha Test Suite
namespace() executes `command` in REPL and expects `namespace` is shown in Sidecar

#### Parameters

| Name          | Type          |
| :------------ | :------------ |
| `opt?`        | `Object`      |
| `opt.onclick` | `ClickExpect` |

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:131](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L131)

---

### testClickResult

▸ `Private` **testClickResult**(`cmdIdx`, `command`, `expect`): (`app`: `Application`) => `Promise`<`void`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `cmdIdx`  | `number` |
| `command` | `string` |
| `expect`  | `string` |

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

[packages/test/src/api/mmr.ts:48](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L48)

---

### toolbarButtons

▸ **toolbarButtons**(`buttons`): `void`

toolbarButtons() starts a Mocha Test Suite
toolbarButtons() executes `command` and expects the `buttons` shown in Sidecar having correct labels and drildown handlers

#### Parameters

| Name      | Type                                                                                                                                                                | Description                                                    |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------- |
| `buttons` | { `command`: `string` \| `Function` ; `confirm?`: `boolean` ; `expectError?`: `127` ; `kind`: `"view"` \| `"drilldown"` ; `label?`: `string` ; `mode`: `string` }[] | is the expected array of `button` shown in the Sidecar Toolbar |

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:405](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L405)

---

### toolbarNotExist

▸ **toolbarNotExist**(): `void`

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:517](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L517)

---

### toolbarText

▸ **toolbarText**(`toolbarText`): `void`

toolbarText() starts a Mocha Test Suite
toolbarText() executes `command` and expects Sidecar Toolbar has correct `text` and `type`

#### Parameters

| Name                 | Type      | Description                                                        |
| :------------------- | :-------- | :----------------------------------------------------------------- |
| `toolbarText`        | `Object`  | is the expected text content and type shown in the Sidecar Toolbar |
| `toolbarText.exact?` | `boolean` | -                                                                  |
| `toolbarText.text`   | `string`  | -                                                                  |
| `toolbarText.type`   | `string`  | -                                                                  |

#### Returns

`void`

#### Defined in

[packages/test/src/api/mmr.ts:500](https://github.com/mra-ruiz/kui/blob/76908b178/packages/test/src/api/mmr.ts#L500)
