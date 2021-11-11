[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-bash-like](../modules/kui_shell_plugin_bash_like.md) / StdioChannelWebsocketSide

# Class: StdioChannelWebsocketSide

[@kui-shell/plugin-bash-like](../modules/kui_shell_plugin_bash_like.md).StdioChannelWebsocketSide

stdin/stdout channel

## Hierarchy

- `EventEmitter`

  ↳ **`StdioChannelWebsocketSide`**

## Implements

- `Channel`

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#constructor)

### Properties

- [readyState](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#readystate)
- [ws](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#ws)
- [wss](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#wss)
- [defaultMaxListeners](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#defaultmaxlisteners)

### Methods

- [addListener](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#addlistener)
- [close](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#close)
- [emit](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#emit)
- [eventNames](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#eventnames)
- [getMaxListeners](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#getmaxlisteners)
- [init](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#init)
- [listenerCount](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#listenercount)
- [listeners](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#listeners)
- [off](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#off)
- [on](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#on)
- [once](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#once)
- [prependListener](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#prependlistener)
- [prependOnceListener](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#prependoncelistener)
- [rawListeners](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#rawlisteners)
- [removeAllListeners](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#removealllisteners)
- [removeEventListener](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#removeeventlistener)
- [removeListener](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#removelistener)
- [send](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#send)
- [setMaxListeners](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#setmaxlisteners)
- [listenerCount](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md#listenercount)

## Constructors

### constructor

• **new StdioChannelWebsocketSide**(`wss`)

#### Parameters

| Name  | Type           |
| :---- | :------------- |
| `wss` | `EventEmitter` |

#### Overrides

EventEmitter.constructor

#### Defined in

[plugins/plugin-bash-like/src/pty/stdio-channel.ts:46](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-bash-like/src/pty/stdio-channel.ts#L46)

## Properties

### readyState

• **readyState**: `ReadyState` = `ReadyState.CONNECTING`

#### Implementation of

Channel.readyState

#### Defined in

[plugins/plugin-bash-like/src/pty/stdio-channel.ts:40](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-bash-like/src/pty/stdio-channel.ts#L40)

---

### ws

• `Private` **ws**: `Channel`

#### Defined in

[plugins/plugin-bash-like/src/pty/stdio-channel.ts:42](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-bash-like/src/pty/stdio-channel.ts#L42)

---

### wss

• `Private` `Readonly` **wss**: `EventEmitter`

#### Defined in

[plugins/plugin-bash-like/src/pty/stdio-channel.ts:44](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-bash-like/src/pty/stdio-channel.ts#L44)

---

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:18

## Methods

### addListener

▸ **addListener**(`event`, `listener`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/events.d.ts:20

---

### close

▸ **close**(): `void`

Forcibly close the channel

#### Returns

`void`

#### Implementation of

Channel.close

#### Defined in

[plugins/plugin-bash-like/src/pty/stdio-channel.ts:144](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-bash-like/src/pty/stdio-channel.ts#L144)

---

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name      | Type                 |
| :-------- | :------------------- |
| `event`   | `string` \| `symbol` |
| `...args` | `any`[]              |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/events.d.ts:32

---

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:33

---

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:29

---

### init

▸ **init**(`child`, `pollInterval?`): `Promise`<`void`\>

#### Parameters

| Name           | Type           | Default value |
| :------------- | :------------- | :------------ |
| `child`        | `ChildProcess` | `undefined`   |
| `pollInterval` | `number`       | `30000`       |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-bash-like/src/pty/stdio-channel.ts:51](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-bash-like/src/pty/stdio-channel.ts#L51)

---

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name   | Type                 |
| :----- | :------------------- |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:34

---

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name    | Type                 |
| :------ | :------------------- |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/events.d.ts:30

---

### off

▸ **off**(`event`, `listener`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:26

---

### on

▸ **on**(`event`, `listener`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Implementation of

Channel.on

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:21

---

### once

▸ **once**(`event`, `listener`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:22

---

### prependListener

▸ **prependListener**(`event`, `listener`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:23

---

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/events.d.ts:24

---

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name    | Type                 |
| :------ | :------------------- |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:31

---

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name     | Type                 |
| :------- | :------------------- |
| `event?` | `string` \| `symbol` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:27

---

### removeEventListener

▸ **removeEventListener**(`eventType`, `handler`): `void`

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `eventType` | `string` |
| `handler`   | `any`    |

#### Returns

`void`

#### Implementation of

Channel.removeEventListener

#### Defined in

[plugins/plugin-bash-like/src/pty/stdio-channel.ts:174](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-bash-like/src/pty/stdio-channel.ts#L174)

---

### removeListener

▸ **removeListener**(`event`, `listener`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:25

---

### send

▸ **send**(`msg`): `void`

emit 'message' on the other side

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `msg` | `string` |

#### Returns

`void`

#### Implementation of

Channel.send

#### Defined in

[plugins/plugin-bash-like/src/pty/stdio-channel.ts:150](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-bash-like/src/pty/stdio-channel.ts#L150)

---

### setMaxListeners

▸ **setMaxListeners**(`n`): [`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Parameters

| Name | Type     |
| :--- | :------- |
| `n`  | `number` |

#### Returns

[`StdioChannelWebsocketSide`](kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:28

---

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`deprecated`** since v4.0.0

#### Parameters

| Name      | Type                 |
| :-------- | :------------------- |
| `emitter` | `EventEmitter`       |
| `event`   | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:17
