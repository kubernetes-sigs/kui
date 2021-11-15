[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / StatusModel

# Interface: StatusModel

[@kui-shell/core](../modules/kui_shell_core.md).StatusModel

## Table of contents

### Properties

- [apiVersion](kui_shell_core.StatusModel.md#apiversion)
- [kind](kui_shell_core.StatusModel.md#kind)
- [metadata](kui_shell_core.StatusModel.md#metadata)
- [spec](kui_shell_core.StatusModel.md#spec)

## Properties

### apiVersion

• **apiVersion**: `"kui-shell/v1"`

#### Defined in

[packages/core/src/models/StatusModel.ts:57](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/StatusModel.ts#L57)

---

### kind

• **kind**: `"StatusModel"`

#### Defined in

[packages/core/src/models/StatusModel.ts:58](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/StatusModel.ts#L58)

---

### metadata

• **metadata**: `Object`

#### Type declaration

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Defined in

[packages/core/src/models/StatusModel.ts:59](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/StatusModel.ts#L59)

---

### spec

• **spec**: `Object`

#### Type declaration

| Name       | Type                                                           |
| :--------- | :------------------------------------------------------------- |
| `sections` | [`StatusModelSection`](kui_shell_core.StatusModelSection.md)[] |

#### Defined in

[packages/core/src/models/StatusModel.ts:62](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/StatusModel.ts#L62)
