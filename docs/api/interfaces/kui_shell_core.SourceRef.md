[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / SourceRef

# Interface: SourceRef

[@kui-shell/core](../modules/kui_shell_core.md).SourceRef

## Table of contents

### Properties

- [customization](kui_shell_core.SourceRef.md#customization)
- [templates](kui_shell_core.SourceRef.md#templates)

## Properties

### customization

• `Optional` **customization**: `Object`

#### Type declaration

| Name       | Type     |
| :--------- | :------- |
| `data`     | `string` |
| `filepath` | `string` |
| `isFor`    | `string` |

#### Defined in

[packages/core/src/models/entity.ts:236](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/entity.ts#L236)

---

### templates

• **templates**: { `contentType?`: `string` ; `data`: `string` ; `filepath`: `string` ; `isFor`: `string` ; `kind?`: `"source"` \| `"template"` }[]

#### Defined in

[packages/core/src/models/entity.ts:235](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/entity.ts#L235)
