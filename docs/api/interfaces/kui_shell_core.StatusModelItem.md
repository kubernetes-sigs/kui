[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / StatusModelItem

# Interface: StatusModelItem

[@kui-shell/core](../modules/kui_shell_core.md).StatusModelItem

## Table of contents

### Properties

- [description](kui_shell_core.StatusModelItem.md#description)
- [status](kui_shell_core.StatusModelItem.md#status)
- [title](kui_shell_core.StatusModelItem.md#title)

## Properties

### description

• **description**: `string`

#### Defined in

[packages/core/src/models/StatusModel.ts:23](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/StatusModel.ts#L23)

---

### status

• **status**: [`StatusModelStatus`](../modules/kui_shell_core.md#statusmodelstatus) \| { `cached?`: [`StatusModelStatus`](../modules/kui_shell_core.md#statusmodelstatus) ; `statusFn`: () => `Promise`<[`StatusModelStatus`](../modules/kui_shell_core.md#statusmodelstatus)\> }

#### Defined in

[packages/core/src/models/StatusModel.ts:24](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/StatusModel.ts#L24)

---

### title

• **title**: `string`

#### Defined in

[packages/core/src/models/StatusModel.ts:22](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/StatusModel.ts#L22)
