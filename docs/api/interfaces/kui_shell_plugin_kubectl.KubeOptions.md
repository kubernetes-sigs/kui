[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / KubeOptions

# Interface: KubeOptions

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).KubeOptions

An incomplete set of kubectl options

## Hierarchy

- `ParsedOptions`

  ↳ **`KubeOptions`**

## Table of contents

### Properties

- [A](kui_shell_plugin_kubectl.KubeOptions.md#a)
- [\_](kui_shell_plugin_kubectl.KubeOptions.md#_)
- [all-namespaces](kui_shell_plugin_kubectl.KubeOptions.md#all-namespaces)
- [c](kui_shell_plugin_kubectl.KubeOptions.md#c)
- [cluster](kui_shell_plugin_kubectl.KubeOptions.md#cluster)
- [container](kui_shell_plugin_kubectl.KubeOptions.md#container)
- [context](kui_shell_plugin_kubectl.KubeOptions.md#context)
- [dry-run](kui_shell_plugin_kubectl.KubeOptions.md#dry-run)
- [f](kui_shell_plugin_kubectl.KubeOptions.md#f)
- [filename](kui_shell_plugin_kubectl.KubeOptions.md#filename)
- [h](kui_shell_plugin_kubectl.KubeOptions.md#h)
- [help](kui_shell_plugin_kubectl.KubeOptions.md#help)
- [k](kui_shell_plugin_kubectl.KubeOptions.md#k)
- [kubeconfig](kui_shell_plugin_kubectl.KubeOptions.md#kubeconfig)
- [kustomize](kui_shell_plugin_kubectl.KubeOptions.md#kustomize)
- [l](kui_shell_plugin_kubectl.KubeOptions.md#l)
- [label](kui_shell_plugin_kubectl.KubeOptions.md#label)
- [limit](kui_shell_plugin_kubectl.KubeOptions.md#limit)
- [n](kui_shell_plugin_kubectl.KubeOptions.md#n)
- [namespace](kui_shell_plugin_kubectl.KubeOptions.md#namespace)
- [o](kui_shell_plugin_kubectl.KubeOptions.md#o)
- [output](kui_shell_plugin_kubectl.KubeOptions.md#output)
- [p](kui_shell_plugin_kubectl.KubeOptions.md#p)
- [previous](kui_shell_plugin_kubectl.KubeOptions.md#previous)
- [sort-by](kui_shell_plugin_kubectl.KubeOptions.md#sort-by)
- [w](kui_shell_plugin_kubectl.KubeOptions.md#w)
- [wait](kui_shell_plugin_kubectl.KubeOptions.md#wait)
- [watch](kui_shell_plugin_kubectl.KubeOptions.md#watch)
- [watch-only](kui_shell_plugin_kubectl.KubeOptions.md#watch-only)

## Properties

### A

• `Optional` **A**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:273](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L273)

---

### \_

• `Optional` **\_**: `string`[]

#### Inherited from

ParsedOptions.\_

#### Defined in

packages/core/mdist/models/command.d.ts:79

---

### all-namespaces

• `Optional` **all-namespaces**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:274](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L274)

---

### c

• `Optional` **c**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:285](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L285)

---

### cluster

• `Optional` **cluster**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:276](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L276)

---

### container

• `Optional` **container**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:286](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L286)

---

### context

• `Optional` **context**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:277](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L277)

---

### dry-run

• `Optional` **dry-run**: `string` \| `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:280](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L280)

---

### f

• `Optional` **f**: `string` \| `string`[]

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:303](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L303)

---

### filename

• `Optional` **filename**: `string` \| `string`[]

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:304](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L304)

---

### h

• `Optional` **h**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:309](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L309)

---

### help

• `Optional` **help**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:310](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L310)

---

### k

• `Optional` **k**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:306](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L306)

---

### kubeconfig

• `Optional` **kubeconfig**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:278](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L278)

---

### kustomize

• `Optional` **kustomize**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:307](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L307)

---

### l

• `Optional` **l**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:300](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L300)

---

### label

• `Optional` **label**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:301](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L301)

---

### limit

• `Optional` **limit**: `number`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:312](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L312)

---

### n

• `Optional` **n**: `string` \| `string`[]

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:282](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L282)

---

### namespace

• `Optional` **namespace**: `string` \| `string`[]

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:283](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L283)

---

### o

• `Optional` **o**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:288](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L288)

---

### output

• `Optional` **output**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:289](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L289)

---

### p

• `Optional` **p**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:297](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L297)

---

### previous

• `Optional` **previous**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:298](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L298)

---

### sort-by

• `Optional` **sort-by**: `string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:314](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L314)

---

### w

• `Optional` **w**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:291](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L291)

---

### wait

• `Optional` **wait**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:295](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L295)

---

### watch

• `Optional` **watch**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:292](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L292)

---

### watch-only

• `Optional` **watch-only**: `boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:293](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L293)
