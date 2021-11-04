[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / Pod

# Interface: Pod

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).Pod

## Hierarchy

- [`KubeResource`](../modules/kui_shell_plugin_kubectl.md#kuberesource)<`PodStatus`\>

  ↳ **`Pod`**

## Table of contents

### Properties

- [apiVersion](kui_shell_plugin_kubectl.Pod.md#apiversion)
- [content](kui_shell_plugin_kubectl.Pod.md#content)
- [contentType](kui_shell_plugin_kubectl.Pod.md#contenttype)
- [isKubeResource](kui_shell_plugin_kubectl.Pod.md#iskuberesource)
- [isSimulacrum](kui_shell_plugin_kubectl.Pod.md#issimulacrum)
- [kind](kui_shell_plugin_kubectl.Pod.md#kind)
- [kuiRawData](kui_shell_plugin_kubectl.Pod.md#kuirawdata)
- [metadata](kui_shell_plugin_kubectl.Pod.md#metadata)
- [nameHash](kui_shell_plugin_kubectl.Pod.md#namehash)
- [onclick](kui_shell_plugin_kubectl.Pod.md#onclick)
- [originatingCommand](kui_shell_plugin_kubectl.Pod.md#originatingcommand)
- [presentation](kui_shell_plugin_kubectl.Pod.md#presentation)
- [prettyName](kui_shell_plugin_kubectl.Pod.md#prettyname)
- [spec](kui_shell_plugin_kubectl.Pod.md#spec)
- [status](kui_shell_plugin_kubectl.Pod.md#status)
- [toolbarText](kui_shell_plugin_kubectl.Pod.md#toolbartext)
- [version](kui_shell_plugin_kubectl.Pod.md#version)

## Properties

### apiVersion

• **apiVersion**: `"v1"`

#### Overrides

KubeResource.apiVersion

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:321](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L321)

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

[plugins/plugin-kubectl/src/lib/model/resource.ts:205](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L205)

---

### isSimulacrum

• `Optional` **isSimulacrum**: `boolean`

#### Inherited from

KubeResource.isSimulacrum

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:204](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L204)

---

### kind

• **kind**: `"Pod"`

#### Overrides

KubeResource.kind

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:322](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L322)

---

### kuiRawData

• `Optional` **kuiRawData**: `string`

#### Inherited from

KubeResource.kuiRawData

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:182](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L182)

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

[plugins/plugin-kubectl/src/lib/model/resource.ts:203](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L203)

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

• **spec**: [`PodLikeSpec`](kui_shell_plugin_kubectl.PodLikeSpec.md) & { `containers`: `ContainerSpec`[] ; `nodeName`: `string` ; `nominatedNodeName?`: `string` ; `readinessGates?`: { `conditionType`: `string` }[] }

#### Overrides

KubeResource.spec

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:323](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L323)

---

### status

• `Optional` **status**: `PodStatus`

#### Inherited from

KubeResource.status

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:199](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L199)

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
