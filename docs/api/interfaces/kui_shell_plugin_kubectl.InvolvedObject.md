[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md) / InvolvedObject

# Interface: InvolvedObject

[@kui-shell/plugin-kubectl](../modules/kui_shell_plugin_kubectl.md).InvolvedObject

Trait that defines an involvedObject, e.g. for Events

## Table of contents

### Properties

- [involvedObject](kui_shell_plugin_kubectl.InvolvedObject.md#involvedobject)

## Properties

### involvedObject

• **involvedObject**: `Object`

#### Type declaration

| Name               | Type     |
| :----------------- | :------- |
| `apiVersion`       | `string` |
| `fieldPath?`       | `string` |
| `kind`             | `string` |
| `name`             | `string` |
| `namespace`        | `string` |
| `resourceVersion?` | `string` |
| `uid?`             | `string` |

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:468](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-kubectl/src/lib/model/resource.ts#L468)
