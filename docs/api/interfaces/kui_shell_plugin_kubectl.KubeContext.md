[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / KubeContext

# Interface: KubeContext

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).KubeContext

Kubernetes context

## Hierarchy

- [`KubeResource`](../modules/kui_shell_plugin_kubectl.md#kuberesource)

  ↳ **`KubeContext`**

## Table of contents

### Properties

- [apiVersion](kui_shell_plugin_kubectl.KubeContext.md#apiversion)
- [content](kui_shell_plugin_kubectl.KubeContext.md#content)
- [contentType](kui_shell_plugin_kubectl.KubeContext.md#contenttype)
- [isKubeResource](kui_shell_plugin_kubectl.KubeContext.md#iskuberesource)
- [isSimulacrum](kui_shell_plugin_kubectl.KubeContext.md#issimulacrum)
- [kind](kui_shell_plugin_kubectl.KubeContext.md#kind)
- [kuiRawData](kui_shell_plugin_kubectl.KubeContext.md#kuirawdata)
- [metadata](kui_shell_plugin_kubectl.KubeContext.md#metadata)
- [nameHash](kui_shell_plugin_kubectl.KubeContext.md#namehash)
- [onclick](kui_shell_plugin_kubectl.KubeContext.md#onclick)
- [originatingCommand](kui_shell_plugin_kubectl.KubeContext.md#originatingcommand)
- [presentation](kui_shell_plugin_kubectl.KubeContext.md#presentation)
- [prettyName](kui_shell_plugin_kubectl.KubeContext.md#prettyname)
- [spec](kui_shell_plugin_kubectl.KubeContext.md#spec)
- [status](kui_shell_plugin_kubectl.KubeContext.md#status)
- [toolbarText](kui_shell_plugin_kubectl.KubeContext.md#toolbartext)
- [version](kui_shell_plugin_kubectl.KubeContext.md#version)

## Properties

### apiVersion

• **apiVersion**: `"github.com/kui-shell/plugin-kubectl/v1alpha1"`

#### Overrides

KubeResource.apiVersion

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:626](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/lib/model/resource.ts#L626)

---

### content

• `Optional` **content**: `void`

#### Inherited from

KubeResource.content

#### Defined in

packages/core/mdist/models/entity.d.ts:51

---

### contentType

• `Optional` **contentType**: `string`

#### Inherited from

KubeResource.contentType

#### Defined in

packages/core/mdist/models/entity.d.ts:52

---

### isKubeResource

• **isKubeResource**: `true`

#### Inherited from

KubeResource.isKubeResource

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:205](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/lib/model/resource.ts#L205)

---

### isSimulacrum

• `Optional` **isSimulacrum**: `boolean`

#### Inherited from

KubeResource.isSimulacrum

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:204](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/lib/model/resource.ts#L204)

---

### kind

• **kind**: `"Context"`

#### Overrides

KubeResource.kind

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:627](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/lib/model/resource.ts#L627)

---

### kuiRawData

• `Optional` **kuiRawData**: `string`

#### Inherited from

KubeResource.kuiRawData

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:182](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/lib/model/resource.ts#L182)

---

### metadata

• `Optional` **metadata**: { `creationTimestamp?`: `string` ; `generation?`: `string` ; `labels?`: `Record`<`string`, `string`\> ; `name`: `string` ; `namespace?`: `string` } & `Partial`<`WithOwnerReferences`\> & `Partial`<`WithResourceVersion`\> & { `annotations?`: `object` ; `creationTimestamp?`: `string` ; `generateName?`: `string` ; `generation?`: `string` ; `labels?`: { [key: string]: `string`; } ; `name`: `string` ; `namespace?`: `string` ; `uid?`: `string` }

#### Inherited from

KubeResource.metadata

#### Defined in

packages/core/mdist/models/entity.d.ts:24

---

### nameHash

• `Optional` **nameHash**: `string`

#### Inherited from

KubeResource.nameHash

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

KubeResource.onclick

#### Defined in

packages/core/mdist/models/entity.d.ts:45

---

### originatingCommand

• **originatingCommand**: `EvaluatorArgs`<[`KubeOptions`](kui_shell_plugin_kubectl.KubeOptions.md)\>

#### Inherited from

KubeResource.originatingCommand

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:203](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/lib/model/resource.ts#L203)

---

### presentation

• `Optional` **presentation**: `Presentation`

#### Inherited from

KubeResource.presentation

#### Defined in

packages/core/mdist/models/entity.d.ts:54

---

### prettyName

• `Optional` **prettyName**: `string`

name hash, e.g. the hash part of auto-generated names, or an openwhisk activation id

#### Inherited from

KubeResource.prettyName

#### Defined in

packages/core/mdist/models/entity.d.ts:42

---

### spec

• **spec**: `Object`

#### Type declaration

| Name        | Type      |
| :---------- | :-------- |
| `cluster`   | `string`  |
| `isCurrent` | `boolean` |
| `user`      | `string`  |

#### Overrides

KubeResource.spec

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:628](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/lib/model/resource.ts#L628)

---

### status

• `Optional` **status**: [`KubeStatus`](kui_shell_plugin_kubectl.KubeStatus.md)

#### Inherited from

KubeResource.status

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:199](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/lib/model/resource.ts#L199)

---

### toolbarText

• `Optional` **toolbarText**: `ToolbarText`

#### Inherited from

KubeResource.toolbarText

#### Defined in

packages/core/mdist/models/entity.d.ts:53

---

### version

• `Optional` **version**: `string`

optional designation of resource version

#### Inherited from

KubeResource.version

#### Defined in

packages/core/mdist/models/entity.d.ts:40
