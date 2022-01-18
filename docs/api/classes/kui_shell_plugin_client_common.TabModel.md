[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / TabModel

# Class: TabModel

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).TabModel

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_client_common.TabModel.md#constructor)

### Accessors

- [buttons](kui_shell_plugin_client_common.TabModel.md#buttons)
- [exec](kui_shell_plugin_client_common.TabModel.md#exec)
- [initialCommandLine](kui_shell_plugin_client_common.TabModel.md#initialcommandline)
- [onClose](kui_shell_plugin_client_common.TabModel.md#onclose)
- [state](kui_shell_plugin_client_common.TabModel.md#state)
- [title](kui_shell_plugin_client_common.TabModel.md#title)
- [uuid](kui_shell_plugin_client_common.TabModel.md#uuid)

### Methods

- [setTitle](kui_shell_plugin_client_common.TabModel.md#settitle)
- [update](kui_shell_plugin_client_common.TabModel.md#update)

## Constructors

### constructor

• **new TabModel**(`_uuid?`, `desiredStatusStripeDecoration?`, `doNotChangeActiveTab?`, `_title?`, `_state?`, `_buttons?`, `_initialCommandLine?`, `_onClose?`, `_exec?`)

#### Parameters

| Name                             | Type                                   | Default value |
| :------------------------------- | :------------------------------------- | :------------ |
| `_uuid`                          | `string`                               | `undefined`   |
| `desiredStatusStripeDecoration?` | `StatusStripeChangeEvent`              | `undefined`   |
| `doNotChangeActiveTab?`          | `boolean`                              | `undefined`   |
| `_title?`                        | `string`                               | `undefined`   |
| `_state`                         | `default`                              | `undefined`   |
| `_buttons`                       | `TopTabButton`<{ `key`: `string` }\>[] | `[]`          |
| `_initialCommandLine?`           | `string`                               | `undefined`   |
| `_onClose?`                      | `string`                               | `undefined`   |
| `_exec?`                         | `"pexec"` \| `"qexec"`                 | `undefined`   |

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:30](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L30)

## Accessors

### buttons

• `get` **buttons**(): `TopTabButton`<{ `key`: `string` }\>[]

#### Returns

`TopTabButton`<{ `key`: `string` }\>[]

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:56](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L56)

---

### exec

• `get` **exec**(): `"pexec"` \| `"qexec"`

#### Returns

`"pexec"` \| `"qexec"`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:76](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L76)

---

### initialCommandLine

• `get` **initialCommandLine**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:68](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L68)

---

### onClose

• `get` **onClose**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:72](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L72)

---

### state

• `get` **state**(): `default`

#### Returns

`default`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:52](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L52)

---

### title

• `get` **title**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:60](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L60)

---

### uuid

• `get` **uuid**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:48](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L48)

## Methods

### setTitle

▸ **setTitle**(`newTitle`): [`TabModel`](kui_shell_plugin_client_common.TabModel.md)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `newTitle` | `string` |

#### Returns

[`TabModel`](kui_shell_plugin_client_common.TabModel.md)

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:64](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L64)

---

### update

▸ **update**(`buttons`, `newTitle?`): [`TabModel`](kui_shell_plugin_client_common.TabModel.md)

#### Parameters

| Name        | Type                                   |
| :---------- | :------------------------------------- |
| `buttons`   | `TopTabButton`<{ `key`: `string` }\>[] |
| `newTitle?` | `string`                               |

#### Returns

[`TabModel`](kui_shell_plugin_client_common.TabModel.md)

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:80](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabModel.ts#L80)
