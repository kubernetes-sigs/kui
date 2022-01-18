[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / PodList

# Interface: PodList

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).PodList

## Hierarchy

- [`KubeResource`](../modules/kui_shell_plugin_kubectl.md#kuberesource)

  ↳ **`PodList`**

## Table of contents

### Properties

- [apiVersion](kui_shell_plugin_kubectl.PodList.md#apiversion)
- [content](kui_shell_plugin_kubectl.PodList.md#content)
- [contentType](kui_shell_plugin_kubectl.PodList.md#contenttype)
- [isKubeResource](kui_shell_plugin_kubectl.PodList.md#iskuberesource)
- [isSimulacrum](kui_shell_plugin_kubectl.PodList.md#issimulacrum)
- [items](kui_shell_plugin_kubectl.PodList.md#items)
- [kind](kui_shell_plugin_kubectl.PodList.md#kind)
- [kuiRawData](kui_shell_plugin_kubectl.PodList.md#kuirawdata)
- [metadata](kui_shell_plugin_kubectl.PodList.md#metadata)
- [nameHash](kui_shell_plugin_kubectl.PodList.md#namehash)
- [onclick](kui_shell_plugin_kubectl.PodList.md#onclick)
- [originatingCommand](kui_shell_plugin_kubectl.PodList.md#originatingcommand)
- [presentation](kui_shell_plugin_kubectl.PodList.md#presentation)
- [prettyName](kui_shell_plugin_kubectl.PodList.md#prettyname)
- [spec](kui_shell_plugin_kubectl.PodList.md#spec)
- [status](kui_shell_plugin_kubectl.PodList.md#status)
- [toolbarText](kui_shell_plugin_kubectl.PodList.md#toolbartext)
- [version](kui_shell_plugin_kubectl.PodList.md#version)

## Properties

### apiVersion

• **apiVersion**: `"v1"`

#### Overrides

KubeResource.apiVersion

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:547](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L547)

---

### content

• `Optional` **content**: `void`

#### Inherited from

KubeResource.content

#### Defined in

packages/core/mdist/models/entity.d.ts:50

---

### contentType

• `Optional` **contentType**: `string`

#### Inherited from

KubeResource.contentType

#### Defined in

packages/core/mdist/models/entity.d.ts:51

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

### items

• **items**: [`KubePartial`](../modules/kui_shell_plugin_kubectl.md#kubepartial)<[`Pod`](kui_shell_plugin_kubectl.Pod.md)\>[]

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:549](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L549)

---

### kind

• **kind**: `"PodList"`

#### Overrides

KubeResource.kind

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:548](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L548)

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

packages/core/mdist/models/entity.d.ts:23

---

### nameHash

• `Optional` **nameHash**: `string`

#### Inherited from

KubeResource.nameHash

#### Defined in

packages/core/mdist/models/entity.d.ts:42

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

packages/core/mdist/models/entity.d.ts:44

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

packages/core/mdist/models/entity.d.ts:53

---

### prettyName

• `Optional` **prettyName**: `string`

name hash, e.g. the hash part of auto-generated names, or an openwhisk activation id

#### Inherited from

KubeResource.prettyName

#### Defined in

packages/core/mdist/models/entity.d.ts:41

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

packages/core/mdist/models/entity.d.ts:52

---

### version

• `Optional` **version**: `string`

optional designation of resource version

#### Inherited from

KubeResource.version

#### Defined in

packages/core/mdist/models/entity.d.ts:39
