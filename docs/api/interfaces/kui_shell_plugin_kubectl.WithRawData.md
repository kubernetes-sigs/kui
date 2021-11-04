[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / WithRawData

# Interface: WithRawData<Content\>

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).WithRawData

## Type parameters

| Name      | Type   |
| :-------- | :----- |
| `Content` | `void` |

## Hierarchy

- `ResourceWithMetadata`<`Content`\>

  ↳ **`WithRawData`**

## Table of contents

### Properties

- [apiVersion](kui_shell_plugin_kubectl.WithRawData.md#apiversion)
- [content](kui_shell_plugin_kubectl.WithRawData.md#content)
- [contentType](kui_shell_plugin_kubectl.WithRawData.md#contenttype)
- [kind](kui_shell_plugin_kubectl.WithRawData.md#kind)
- [kuiRawData](kui_shell_plugin_kubectl.WithRawData.md#kuirawdata)
- [metadata](kui_shell_plugin_kubectl.WithRawData.md#metadata)
- [nameHash](kui_shell_plugin_kubectl.WithRawData.md#namehash)
- [onclick](kui_shell_plugin_kubectl.WithRawData.md#onclick)
- [presentation](kui_shell_plugin_kubectl.WithRawData.md#presentation)
- [prettyName](kui_shell_plugin_kubectl.WithRawData.md#prettyname)
- [toolbarText](kui_shell_plugin_kubectl.WithRawData.md#toolbartext)
- [version](kui_shell_plugin_kubectl.WithRawData.md#version)

## Properties

### apiVersion

• `Optional` **apiVersion**: `string`

#### Inherited from

ResourceWithMetadata.apiVersion

#### Defined in

packages/core/mdist/models/entity.d.ts:38

---

### content

• `Optional` **content**: `Content`

#### Inherited from

ResourceWithMetadata.content

#### Defined in

packages/core/mdist/models/entity.d.ts:51

---

### contentType

• `Optional` **contentType**: `string`

#### Inherited from

ResourceWithMetadata.contentType

#### Defined in

packages/core/mdist/models/entity.d.ts:52

---

### kind

• `Optional` **kind**: `string`

#### Inherited from

ResourceWithMetadata.kind

#### Defined in

packages/core/mdist/models/entity.d.ts:23

---

### kuiRawData

• `Optional` **kuiRawData**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:182](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L182)

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

ResourceWithMetadata.metadata

#### Defined in

packages/core/mdist/models/entity.d.ts:24

---

### nameHash

• `Optional` **nameHash**: `string`

#### Inherited from

ResourceWithMetadata.nameHash

#### Defined in

packages/core/mdist/models/entity.d.ts:43

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

ResourceWithMetadata.onclick

#### Defined in

packages/core/mdist/models/entity.d.ts:45

---

### presentation

• `Optional` **presentation**: `Presentation`

#### Inherited from

ResourceWithMetadata.presentation

#### Defined in

packages/core/mdist/models/entity.d.ts:54

---

### prettyName

• `Optional` **prettyName**: `string`

name hash, e.g. the hash part of auto-generated names, or an openwhisk activation id

#### Inherited from

ResourceWithMetadata.prettyName

#### Defined in

packages/core/mdist/models/entity.d.ts:42

---

### toolbarText

• `Optional` **toolbarText**: `ToolbarText`

#### Inherited from

ResourceWithMetadata.toolbarText

#### Defined in

packages/core/mdist/models/entity.d.ts:53

---

### version

• `Optional` **version**: `string`

optional designation of resource version

#### Inherited from

ResourceWithMetadata.version

#### Defined in

packages/core/mdist/models/entity.d.ts:40
