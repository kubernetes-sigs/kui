[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/test](../modules/kui_shell_test.md) / TestTable

# Class: TestTable

[@kui-shell/test](../modules/kui_shell_test.md).TestTable

## Table of contents

### Constructors

- [constructor](kui_shell_test.TestTable.md#constructor)

### Properties

- [cmdIdx](kui_shell_test.TestTable.md#cmdidx)
- [ctx](kui_shell_test.TestTable.md#ctx)
- [outputCount](kui_shell_test.TestTable.md#outputcount)
- [testName](kui_shell_test.TestTable.md#testname)
- [tests](kui_shell_test.TestTable.md#tests)

### Methods

- [drilldownFromTable](kui_shell_test.TestTable.md#drilldownfromtable)
- [evalStatus](kui_shell_test.TestTable.md#evalstatus)
- [executeAndValidate](kui_shell_test.TestTable.md#executeandvalidate)
- [run](kui_shell_test.TestTable.md#run)

## Constructors

### constructor

• **new TestTable**(`testName?`, `tests?`)

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `testName?` | `string` |
| `tests?`    | `Tests`  |

#### Defined in

[packages/test/src/api/table.ts:56](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L56)

## Properties

### cmdIdx

• `Private` **cmdIdx**: `number`

#### Defined in

[packages/test/src/api/table.ts:54](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L54)

---

### ctx

• `Private` **ctx**: [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md)

#### Defined in

[packages/test/src/api/table.ts:52](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L52)

---

### outputCount

• `Private` **outputCount**: `number`

#### Defined in

[packages/test/src/api/table.ts:51](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L51)

---

### testName

• `Private` **testName**: `string`

#### Defined in

[packages/test/src/api/table.ts:50](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L50)

---

### tests

• `Private` **tests**: `Tests`

#### Defined in

[packages/test/src/api/table.ts:53](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L53)

## Methods

### drilldownFromTable

▸ **drilldownFromTable**(`expectTable`, `_ctx?`): `void`

drilldownFromTable() drilldowns from the table

#### Parameters

| Name          | Type                                                      | Description                             |
| :------------ | :-------------------------------------------------------- | :-------------------------------------- |
| `expectTable` | `Table`<`Row`\>                                           | is the expected table shown in the REPL |
| `_ctx?`       | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) | -                                       |

#### Returns

`void`

#### Defined in

[packages/test/src/api/table.ts:219](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L219)

---

### evalStatus

▸ **evalStatus**(`_`): `void`

#### Parameters

| Name                   | Type                                                      |
| :--------------------- | :-------------------------------------------------------- |
| `_`                    | `Object`                                                  |
| `_.command`            | `string`                                                  |
| `_.ctx?`               | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |
| `_.expectRow`          | `RowWithBadgeAndMessage`[]                                |
| `_.statusDescription?` | `string`                                                  |

#### Returns

`void`

#### Defined in

[packages/test/src/api/table.ts:87](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L87)

---

### executeAndValidate

▸ `Private` **executeAndValidate**(`command`, `expectTable`, `validation?`, `_ctx?`): `void`

Execute the table-generating command, and validate the content.

#### Parameters

| Name          | Type                                                      |
| :------------ | :-------------------------------------------------------- |
| `command`     | `string`                                                  |
| `expectTable` | `Table`<`Row`\>                                           |
| `validation?` | `TableValidation`                                         |
| `_ctx?`       | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |

#### Returns

`void`

#### Defined in

[packages/test/src/api/table.ts:124](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L124)

---

### run

▸ **run**(): `void`

new TestTable().run() will start a mocha test suite

#### Returns

`void`

#### Defined in

[packages/test/src/api/table.ts:62](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/table.ts#L62)
