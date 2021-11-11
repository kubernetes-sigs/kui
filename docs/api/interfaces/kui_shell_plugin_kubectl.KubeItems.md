[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / KubeItems

# Interface: KubeItems<Item\>

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).KubeItems

e.g. `kubectl get pods -o json` will return a kind: items

## Type parameters

| Name   | Type                                                                                                                                               |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Item` | extends [`KubeResource`](../modules/kui_shell_plugin_kubectl.md#kuberesource)[`KubeResource`](../modules/kui_shell_plugin_kubectl.md#kuberesource) |

## Hierarchy

- [`KubeResource`](../modules/kui_shell_plugin_kubectl.md#kuberesource)

  ↳ **`KubeItems`**

## Table of contents

### Properties

- [apiVersion](kui_shell_plugin_kubectl.KubeItems.md#apiversion)
- [content](kui_shell_plugin_kubectl.KubeItems.md#content)
- [contentType](kui_shell_plugin_kubectl.KubeItems.md#contenttype)
- [isKubeResource](kui_shell_plugin_kubectl.KubeItems.md#iskuberesource)
- [isSimulacrum](kui_shell_plugin_kubectl.KubeItems.md#issimulacrum)
- [items](kui_shell_plugin_kubectl.KubeItems.md#items)
- [kind](kui_shell_plugin_kubectl.KubeItems.md#kind)
- [kuiRawData](kui_shell_plugin_kubectl.KubeItems.md#kuirawdata)
- [metadata](kui_shell_plugin_kubectl.KubeItems.md#metadata)
- [nameHash](kui_shell_plugin_kubectl.KubeItems.md#namehash)
- [onclick](kui_shell_plugin_kubectl.KubeItems.md#onclick)
- [originatingCommand](kui_shell_plugin_kubectl.KubeItems.md#originatingcommand)
- [presentation](kui_shell_plugin_kubectl.KubeItems.md#presentation)
- [prettyName](kui_shell_plugin_kubectl.KubeItems.md#prettyname)
- [spec](kui_shell_plugin_kubectl.KubeItems.md#spec)
- [status](kui_shell_plugin_kubectl.KubeItems.md#status)
- [toolbarText](kui_shell_plugin_kubectl.KubeItems.md#toolbartext)
- [version](kui_shell_plugin_kubectl.KubeItems.md#version)

## Properties

### apiVersion

• **apiVersion**: `"v1"`

#### Overrides

KubeResource.apiVersion

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:539](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L539)

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

[plugins/plugin-kubectl/src/lib/model/resource.ts:205](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L205)

---

### isSimulacrum

• `Optional` **isSimulacrum**: `boolean`

#### Inherited from

KubeResource.isSimulacrum

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:204](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L204)

---

### items

• **items**: `Item`[]

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:541](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L541)

---

### kind

• **kind**: `"List"`

#### Overrides

KubeResource.kind

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:540](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L540)

---

### kuiRawData

• `Optional` **kuiRawData**: `string`

#### Inherited from

KubeResource.kuiRawData

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:182](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L182)

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

[plugins/plugin-kubectl/src/lib/model/resource.ts:203](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L203)

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

[plugins/plugin-kubectl/src/lib/model/resource.ts:200](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L200)

---

### status

• `Optional` **status**: [`KubeStatus`](kui_shell_plugin_kubectl.KubeStatus.md)

#### Inherited from

KubeResource.status

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:199](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L199)

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
