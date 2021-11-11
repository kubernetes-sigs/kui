[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / TabModel

# Class: TabModel

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).TabModel

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_client_common.TabModel.md#constructor)

### Accessors

- [buttons](kui_shell_plugin_client_common.TabModel.md#buttons)
- [exec](kui_shell_plugin_client_common.TabModel.md#exec)
- [initialCommandLine](kui_shell_plugin_client_common.TabModel.md#initialcommandline)
- [isNotebook](kui_shell_plugin_client_common.TabModel.md#isnotebook)
- [onClose](kui_shell_plugin_client_common.TabModel.md#onclose)
- [snapshot](kui_shell_plugin_client_common.TabModel.md#snapshot)
- [state](kui_shell_plugin_client_common.TabModel.md#state)
- [title](kui_shell_plugin_client_common.TabModel.md#title)
- [uuid](kui_shell_plugin_client_common.TabModel.md#uuid)

### Methods

- [update](kui_shell_plugin_client_common.TabModel.md#update)

## Constructors

### constructor

• **new TabModel**(`_uuid?`, `desiredStatusStripeDecoration?`, `doNotChangeActiveTab?`, `_title?`, `_state?`, `_buttons?`, `_initialCommandLine?`, `_onClose?`, `_exec?`, `_snapshot?`)

#### Parameters

| Name                             | Type                        | Default value |
| :------------------------------- | :-------------------------- | :------------ |
| `_uuid`                          | `string`                    | `undefined`   |
| `desiredStatusStripeDecoration?` | `StatusStripeChangeEvent`   | `undefined`   |
| `doNotChangeActiveTab?`          | `boolean`                   | `undefined`   |
| `_title?`                        | `string`                    | `undefined`   |
| `_state`                         | `default`                   | `undefined`   |
| `_buttons`                       | `TopTabButton`<`Object`\>[] | `[]`          |
| `_initialCommandLine?`           | `string`                    | `undefined`   |
| `_onClose?`                      | `string`                    | `undefined`   |
| `_exec?`                         | `"pexec"` \| `"qexec"`      | `undefined`   |
| `_snapshot?`                     | `Buffer`                    | `undefined`   |

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:30](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L30)

## Accessors

### buttons

• `get` **buttons**(): `TopTabButton`<`Object`\>[]

#### Returns

`TopTabButton`<`Object`\>[]

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:58](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L58)

---

### exec

• `get` **exec**(): `"pexec"` \| `"qexec"`

#### Returns

`"pexec"` \| `"qexec"`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:74](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L74)

---

### initialCommandLine

• `get` **initialCommandLine**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:66](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L66)

---

### isNotebook

• `get` **isNotebook**(): `boolean`

#### Returns

`boolean`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:82](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L82)

---

### onClose

• `get` **onClose**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:70](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L70)

---

### snapshot

• `get` **snapshot**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:78](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L78)

---

### state

• `get` **state**(): `default`

#### Returns

`default`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:54](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L54)

---

### title

• `get` **title**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:62](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L62)

---

### uuid

• `get` **uuid**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:50](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L50)

## Methods

### update

▸ **update**(`buttons`): [`TabModel`](kui_shell_plugin_client_common.TabModel.md)

#### Parameters

| Name      | Type                        |
| :-------- | :-------------------------- |
| `buttons` | `TopTabButton`<`Object`\>[] |

#### Returns

[`TabModel`](kui_shell_plugin_client_common.TabModel.md)

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabModel.ts:86](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-client-common/src/components/Client/TabModel.ts#L86)
