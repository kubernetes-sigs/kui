[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / MetadataNamedResource

# Interface: MetadataNamedResource

[@kui-shell/core](../modules/kui_shell_core.md).MetadataNamedResource

The name part of a metadata bearing resource.

## Hierarchy

- **`MetadataNamedResource`**

  ↳ [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md)

## Table of contents

### Properties

- [kind](kui_shell_core.MetadataNamedResource.md#kind)
- [metadata](kui_shell_core.MetadataNamedResource.md#metadata)

## Properties

### kind

• `Optional` **kind**: `string`

#### Defined in

[packages/core/src/models/entity.ts:47](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/entity.ts#L47)

---

### metadata

• `Optional` **metadata**: `Object`

#### Type declaration

| Name                 | Type                          |
| :------------------- | :---------------------------- |
| `creationTimestamp?` | `string`                      |
| `generation?`        | `string`                      |
| `labels?`            | `Record`<`string`, `string`\> |
| `name`               | `string`                      |
| `namespace?`         | `string`                      |

#### Defined in

[packages/core/src/models/entity.ts:49](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/entity.ts#L49)
