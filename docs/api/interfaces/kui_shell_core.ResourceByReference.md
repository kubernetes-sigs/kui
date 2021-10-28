[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / ResourceByReference

# Interface: ResourceByReference<Content\>

[@kui-shell/core](../modules/kui_shell_core.md).ResourceByReference

Entity with a "resource" field that is MetadataBearing

## Type parameters

| Name      | Type   |
| :-------- | :----- |
| `Content` | `void` |

## Hierarchy

- [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md)<`Content`\>

  ↳ **`ResourceByReference`**

## Table of contents

### Properties

- [apiVersion](kui_shell_core.ResourceByReference.md#apiversion)
- [content](kui_shell_core.ResourceByReference.md#content)
- [contentType](kui_shell_core.ResourceByReference.md#contenttype)
- [kind](kui_shell_core.ResourceByReference.md#kind)
- [metadata](kui_shell_core.ResourceByReference.md#metadata)
- [nameHash](kui_shell_core.ResourceByReference.md#namehash)
- [onclick](kui_shell_core.ResourceByReference.md#onclick)
- [presentation](kui_shell_core.ResourceByReference.md#presentation)
- [prettyName](kui_shell_core.ResourceByReference.md#prettyname)
- [resource](kui_shell_core.ResourceByReference.md#resource)
- [toolbarText](kui_shell_core.ResourceByReference.md#toolbartext)
- [version](kui_shell_core.ResourceByReference.md#version)

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[apiVersion](kui_shell_core.ResourceWithMetadata.md#apiversion)

#### Defined in

[packages/core/src/models/entity.ts:64](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L64)

---

### content

• `Optional` **content**: `Content`

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[content](kui_shell_core.ResourceWithMetadata.md#content)

#### Defined in

[packages/core/src/models/entity.ts:81](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L81)

---

### contentType

• `Optional` **contentType**: `string`

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[contentType](kui_shell_core.ResourceWithMetadata.md#contenttype)

#### Defined in

[packages/core/src/models/entity.ts:82](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L82)

---

### kind

• `Optional` **kind**: `string`

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[kind](kui_shell_core.ResourceWithMetadata.md#kind)

#### Defined in

[packages/core/src/models/entity.ts:47](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L47)

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

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[metadata](kui_shell_core.ResourceWithMetadata.md#metadata)

#### Defined in

[packages/core/src/models/entity.ts:49](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L49)

---

### nameHash

• `Optional` **nameHash**: `string`

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[nameHash](kui_shell_core.ResourceWithMetadata.md#namehash)

#### Defined in

[packages/core/src/models/entity.ts:71](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L71)

---

### onclick

• `Optional` **onclick**: `Object`

family of onclick handlers

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `kind?`      | `string` |
| `name?`      | `string` |
| `nameHash?`  | `string` |
| `namespace?` | `string` |

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[onclick](kui_shell_core.ResourceWithMetadata.md#onclick)

#### Defined in

[packages/core/src/models/entity.ts:74](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L74)

---

### presentation

• `Optional` **presentation**: [`Presentation`](../enums/kui_shell_core.Presentation.md)

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[presentation](kui_shell_core.ResourceWithMetadata.md#presentation)

#### Defined in

[packages/core/src/models/entity.ts:84](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L84)

---

### prettyName

• `Optional` **prettyName**: `string`

name hash, e.g. the hash part of auto-generated names, or an openwhisk activation id

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[prettyName](kui_shell_core.ResourceWithMetadata.md#prettyname)

#### Defined in

[packages/core/src/models/entity.ts:70](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L70)

---

### resource

• **resource**: [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md)<`Content`\>

#### Defined in

[packages/core/src/models/entity.ts:110](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L110)

---

### toolbarText

• `Optional` **toolbarText**: [`ToolbarText`](kui_shell_core.ToolbarText.md)

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[toolbarText](kui_shell_core.ResourceWithMetadata.md#toolbartext)

#### Defined in

[packages/core/src/models/entity.ts:83](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L83)

---

### version

• `Optional` **version**: `string`

optional designation of resource version

#### Inherited from

[ResourceWithMetadata](kui_shell_core.ResourceWithMetadata.md).[version](kui_shell_core.ResourceWithMetadata.md#version)

#### Defined in

[packages/core/src/models/entity.ts:67](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/entity.ts#L67)
