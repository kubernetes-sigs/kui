[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / DescriptionList

# Interface: DescriptionList

[@kui-shell/core](../modules/kui_shell_core.md).DescriptionList

## Table of contents

### Properties

- [apiVersion](kui_shell_core.DescriptionList.md#apiversion)
- [kind](kui_shell_core.DescriptionList.md#kind)
- [spec](kui_shell_core.DescriptionList.md#spec)

## Properties

### apiVersion

• **apiVersion**: `"kui-shell/v1"`

#### Defined in

[packages/core/src/models/DescriptionList.ts:20](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/DescriptionList.ts#L20)

---

### kind

• **kind**: `"DescriptionList"`

#### Defined in

[packages/core/src/models/DescriptionList.ts:21](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/DescriptionList.ts#L21)

---

### spec

• **spec**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                                              | Description                                                            |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `as?`    | `"default"` \| `"labels"`                                                                                                                                         | Display as a list of key-value pairs (default), or as a list of labels |
| `groups` | { `description`: `string` \| `number` \| `boolean` ; `term`: `string` ; `termHelp?`: { `description`: `string` \| `number` \| `boolean` ; `title`: `string` } }[] | -                                                                      |

#### Defined in

[packages/core/src/models/DescriptionList.ts:23](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/DescriptionList.ts#L23)
