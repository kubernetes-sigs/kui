[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / SourceRef

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

[packages/core/src/models/entity.ts:232](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/entity.ts#L232)

---

### templates

• **templates**: { `contentType?`: `string` ; `data`: `string` ; `filepath`: `string` ; `isFor`: `string` ; `kind?`: `"source"` \| `"template"` }[]

#### Defined in

[packages/core/src/models/entity.ts:231](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/entity.ts#L231)
