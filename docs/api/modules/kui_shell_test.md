[Kui API Documentation - v10.8.0](../README.md) / @kui-shell/test

# Module: @kui-shell/test

## Table of contents

### Namespaces

- [CLI](kui_shell_test.CLI.md)
- [Common](kui_shell_test.Common.md)
- [ReplExpect](kui_shell_test.ReplExpect.md)
- [Selectors](kui_shell_test.Selectors.md)
- [SidecarExpect](kui_shell_test.SidecarExpect.md)
- [Util](kui_shell_test.Util.md)

### Classes

- [TestMMR](../classes/kui_shell_test.TestMMR.md)
- [TestNavResponse](../classes/kui_shell_test.TestNavResponse.md)
- [TestStringResponse](../classes/kui_shell_test.TestStringResponse.md)
- [TestTable](../classes/kui_shell_test.TestTable.md)

### Type aliases

- [MMRExpectMode](kui_shell_test.md#mmrexpectmode)

### Variables

- [Keys](kui_shell_test.md#keys)

### Functions

- [testAbout](kui_shell_test.md#testabout)

## Type aliases

### MMRExpectMode

Ƭ **MMRExpectMode**: `Label` & `PlainTextContent` \| `YamlContentWithEditor` \| `TableContent` \| `ReactContent`

#### Defined in

[packages/test/src/api/mmr.ts:36](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/mmr.ts#L36)

## Variables

### Keys

• **Keys**: `Object`

#### Type declaration

| Name          | Type                                          |
| :------------ | :-------------------------------------------- |
| `BACKSPACE`   | `string`                                      |
| `CONTROL`     | `string`                                      |
| `DELETE`      | `string`                                      |
| `Delete`      | `string`                                      |
| `ENTER`       | `string`                                      |
| `ESCAPE`      | `string`                                      |
| `End`         | `string`                                      |
| `Home`        | `string`                                      |
| `META`        | `string`                                      |
| `Numpad1`     | `string`                                      |
| `Numpad2`     | `string`                                      |
| `PageDown`    | `string`                                      |
| `PageUp`      | `string`                                      |
| `TAB`         | `string`                                      |
| `ctrlC`       | `string`[]                                    |
| `ctrlN`       | `string`[]                                    |
| `ctrlOrMeta`  | `string`                                      |
| `ctrlP`       | `string`[]                                    |
| `holdDownKey` | (`character`: `string`) => `Promise`<`void`\> |
| `releaseKey`  | (`character`: `string`) => `Promise`<`void`\> |

#### Defined in

[packages/test/src/api/keys.ts:19](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/keys.ts#L19)

## Functions

### testAbout

▸ `Const` **testAbout**(`self`): `void`

#### Parameters

| Name   | Type                                                      |
| :----- | :-------------------------------------------------------- |
| `self` | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) |

#### Returns

`void`

#### Defined in

[packages/test/src/api/NavResponse.ts:129](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/test/src/api/NavResponse.ts#L129)
