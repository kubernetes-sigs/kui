[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](kui_shell_core.md) / pc

# Namespace: pc

[@kui-shell/core](kui_shell_core.md).pc

## Table of contents

### Functions

- [command](kui_shell_core.pc.md#command)
- [examples](kui_shell_core.pc.md#examples)
- [intro](kui_shell_core.pc.md#intro)
- [option](kui_shell_core.pc.md#option)
- [options](kui_shell_core.pc.md#options)
- [pipeline](kui_shell_core.pc.md#pipeline)
- [related](kui_shell_core.pc.md#related)
- [title](kui_shell_core.pc.md#title)
- [usage](kui_shell_core.pc.md#usage)

## Functions

### command

▸ **command**(`cmdline`): `string`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `cmdline` | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:23](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L23)

---

### examples

▸ **examples**(`examples`, `sectionTitle?`): `string`

#### Parameters

| Name           | Type        | Default value |
| :------------- | :---------- | :------------ |
| `examples`     | `Example`[] | `undefined`   |
| `sectionTitle` | `string`    | `'Examples'`  |

#### Returns

`string`

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:70](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L70)

---

### intro

▸ **intro**(`paragraph`): `string`

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `paragraph` | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:27](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L27)

---

### option

▸ **option**(`opts`): `string`

#### Parameters

| Name   | Type                   |
| :----- | :--------------------- |
| `opts` | `string` \| `string`[] |

#### Returns

`string`

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:31](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L31)

---

### options

▸ **options**(`options`): `string`

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `options` | `Option`[] |

#### Returns

`string`

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:87](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L87)

---

### pipeline

▸ **pipeline**(`code`): `string`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `code` | `string` |

#### Returns

`string`

pretty-printed version of the given bash pipeline

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:43](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L43)

---

### related

▸ **related**(`related`): `string`

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `related` | `string`[] |

#### Returns

`string`

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:81](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L81)

---

### title

▸ **title**(`_`): `string`

#### Parameters

| Name | Type    |
| :--- | :------ |
| `_`  | `Title` |

#### Returns

`string`

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:37](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L37)

---

### usage

▸ **usage**(`usages`): `string`

#### Parameters

| Name     | Type       |
| :------- | :--------- |
| `usages` | `string`[] |

#### Returns

`string`

#### Defined in

[packages/core/src/core/usage/pretty-code.ts:60](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/usage/pretty-code.ts#L60)
