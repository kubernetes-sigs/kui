[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / KubeStatus

# Interface: KubeStatus

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).KubeStatus

## Table of contents

### Properties

- [availableReplicas](kui_shell_plugin_kubectl.KubeStatus.md#availablereplicas)
- [completionTime](kui_shell_plugin_kubectl.KubeStatus.md#completiontime)
- [conditions](kui_shell_plugin_kubectl.KubeStatus.md#conditions)
- [loadBalancer](kui_shell_plugin_kubectl.KubeStatus.md#loadbalancer)
- [message](kui_shell_plugin_kubectl.KubeStatus.md#message)
- [phase](kui_shell_plugin_kubectl.KubeStatus.md#phase)
- [podName](kui_shell_plugin_kubectl.KubeStatus.md#podname)
- [qosClass](kui_shell_plugin_kubectl.KubeStatus.md#qosclass)
- [readyReplicas](kui_shell_plugin_kubectl.KubeStatus.md#readyreplicas)
- [replicas](kui_shell_plugin_kubectl.KubeStatus.md#replicas)
- [startTime](kui_shell_plugin_kubectl.KubeStatus.md#starttime)
- [state](kui_shell_plugin_kubectl.KubeStatus.md#state)
- [unavailableReplicas](kui_shell_plugin_kubectl.KubeStatus.md#unavailablereplicas)
- [updatedReplicas](kui_shell_plugin_kubectl.KubeStatus.md#updatedreplicas)

## Properties

### availableReplicas

• `Optional` **availableReplicas**: `number`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:55](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L55)

---

### completionTime

• `Optional` **completionTime**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:49](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L49)

---

### conditions

• `Optional` **conditions**: [`KubeStatusCondition`](kui_shell_plugin_kubectl.KubeStatusCondition.md)[]

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:59](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L59)

---

### loadBalancer

• `Optional` **loadBalancer**: `KubeLoadBalancer`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:58](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L58)

---

### message

• `Optional` **message**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:46](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L46)

---

### phase

• `Optional` **phase**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:50](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L50)

---

### podName

• `Optional` **podName**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:51](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L51)

---

### qosClass

• `Optional` **qosClass**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:52](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L52)

---

### readyReplicas

• `Optional` **readyReplicas**: `number`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:54](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L54)

---

### replicas

• `Optional` **replicas**: `number`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:53](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L53)

---

### startTime

• `Optional` **startTime**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:48](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L48)

---

### state

• `Optional` **state**: `string`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:47](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L47)

---

### unavailableReplicas

• `Optional` **unavailableReplicas**: `number`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:56](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L56)

---

### updatedReplicas

• `Optional` **updatedReplicas**: `number`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:57](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-kubectl/src/lib/model/resource.ts#L57)
