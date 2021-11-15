[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / Secret

# Interface: Secret<T\>

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).Secret

Kubernetes Secret

## Type parameters

| Name | Type                       |
| :--- | :------------------------- |
| `T`  | `Record`<`string`, `any`\> |

## Hierarchy

- [`KubeResource`](../modules/kui_shell_plugin_kubectl.md#kuberesource)

  ↳ **`Secret`**

## Table of contents

### Properties

- [apiVersion](kui_shell_plugin_kubectl.Secret.md#apiversion)
- [content](kui_shell_plugin_kubectl.Secret.md#content)
- [contentType](kui_shell_plugin_kubectl.Secret.md#contenttype)
- [data](kui_shell_plugin_kubectl.Secret.md#data)
- [isKubeResource](kui_shell_plugin_kubectl.Secret.md#iskuberesource)
- [isSimulacrum](kui_shell_plugin_kubectl.Secret.md#issimulacrum)
- [kind](kui_shell_plugin_kubectl.Secret.md#kind)
- [kuiRawData](kui_shell_plugin_kubectl.Secret.md#kuirawdata)
- [metadata](kui_shell_plugin_kubectl.Secret.md#metadata)
- [nameHash](kui_shell_plugin_kubectl.Secret.md#namehash)
- [onclick](kui_shell_plugin_kubectl.Secret.md#onclick)
- [originatingCommand](kui_shell_plugin_kubectl.Secret.md#originatingcommand)
- [presentation](kui_shell_plugin_kubectl.Secret.md#presentation)
- [prettyName](kui_shell_plugin_kubectl.Secret.md#prettyname)
- [spec](kui_shell_plugin_kubectl.Secret.md#spec)
- [status](kui_shell_plugin_kubectl.Secret.md#status)
- [toolbarText](kui_shell_plugin_kubectl.Secret.md#toolbartext)
- [type](kui_shell_plugin_kubectl.Secret.md#type)
- [version](kui_shell_plugin_kubectl.Secret.md#version)

## Properties

### apiVersion

• **apiVersion**: `"v1"`

#### Overrides

KubeResource.apiVersion

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:754](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L754)

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

### data

• **data**: `T`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:757](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L757)

---

### isKubeResource

• **isKubeResource**: `true`

#### Inherited from

KubeResource.isKubeResource

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:205](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L205)

---

### isSimulacrum

• `Optional` **isSimulacrum**: `boolean`

#### Inherited from

KubeResource.isSimulacrum

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:204](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L204)

---

### kind

• **kind**: `"Secret"`

#### Overrides

KubeResource.kind

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:755](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L755)

---

### kuiRawData

• `Optional` **kuiRawData**: `string`

#### Inherited from

KubeResource.kuiRawData

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:182](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L182)

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

[plugins/plugin-kubectl/src/lib/model/resource.ts:203](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L203)

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

• `Optional` **spec**: `any`

#### Inherited from

KubeResource.spec

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:200](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L200)

---

### status

• `Optional` **status**: [`KubeStatus`](kui_shell_plugin_kubectl.KubeStatus.md)

#### Inherited from

KubeResource.status

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:199](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L199)

---

### toolbarText

• `Optional` **toolbarText**: `ToolbarText`

#### Inherited from

KubeResource.toolbarText

#### Defined in

packages/core/mdist/models/entity.d.ts:53

---

### type

• **type**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:756](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L756)

---

### version

• `Optional` **version**: `string`

optional designation of resource version

#### Inherited from

KubeResource.version

#### Defined in

packages/core/mdist/models/entity.d.ts:40
