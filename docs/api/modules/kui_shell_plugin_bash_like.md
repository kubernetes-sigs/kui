[Kui API Documentation - v10.8.0](../README.md) / @kui-shell/plugin-bash-like

# Module: @kui-shell/plugin-bash-like

## Table of contents

### Classes

- [StdioChannelWebsocketSide](../classes/kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

### Functions

- [doExecWithPty](kui_shell_plugin_bash_like.md#doexecwithpty)
- [doExecWithStdoutViaPty](kui_shell_plugin_bash_like.md#doexecwithstdoutviapty)
- [getSessionForTab](kui_shell_plugin_bash_like.md#getsessionfortab)
- [getTabState](kui_shell_plugin_bash_like.md#gettabstate)
- [main](kui_shell_plugin_bash_like.md#main)

## Functions

### doExecWithPty

▸ `Const` **doExecWithPty**(`__namedParameters`): `Promise`<`any`\>

Command handler that dispatches to an outer shell

#### Parameters

| Name                | Type                              |
| :------------------ | :-------------------------------- |
| `__namedParameters` | `EvaluatorArgs`<`ParsedOptions`\> |

#### Returns

`Promise`<`any`\>

#### Defined in

[plugins/plugin-bash-like/src/lib/cmds/catchall.ts:26](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-bash-like/src/lib/cmds/catchall.ts#L26)

---

### doExecWithStdoutViaPty

▸ **doExecWithStdoutViaPty**<`O`\>(`args`): `Promise`<`string`\>

Execute the given command using a pty, but return a string

#### Type parameters

| Name | Type                                     |
| :--- | :--------------------------------------- |
| `O`  | extends ` ParsedOptions``ParsedOptions ` |

#### Parameters

| Name   | Type                  |
| :----- | :-------------------- |
| `args` | `EvaluatorArgs`<`O`\> |

#### Returns

`Promise`<`string`\>

#### Defined in

[plugins/plugin-bash-like/src/lib/cmds/catchall.ts:103](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-bash-like/src/lib/cmds/catchall.ts#L103)

---

### getSessionForTab

▸ **getSessionForTab**(`tab`): `Promise`<`Channel`\>

Return the session for the given tab

#### Parameters

| Name  | Type  |
| :---- | :---- |
| `tab` | `Tab` |

#### Returns

`Promise`<`Channel`\>

#### Defined in

[plugins/plugin-bash-like/src/pty/sessionCache.ts:38](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-bash-like/src/pty/sessionCache.ts#L38)

---

### getTabState

▸ **getTabState**(`tab`, `key`): `any`

#### Parameters

| Name  | Type      |
| :---- | :-------- |
| `tab` | `default` |
| `key` | `string`  |

#### Returns

`any`

#### Defined in

[plugins/plugin-bash-like/src/tab-state/get.ts:21](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-bash-like/src/tab-state/get.ts#L21)

---

### main

▸ `Const` **main**(`N`, `server?`, `preexistingPort?`, `expectedCookie?`): `Promise`<`number` \| { `port`: `number` ; `wss`: `Server` }\>

#### Parameters

| Name               | Type            |
| :----------------- | :-------------- |
| `N`                | `string`        |
| `server?`          | `Server`        |
| `preexistingPort?` | `number`        |
| `expectedCookie?`  | `SessionCookie` |

#### Returns

`Promise`<`number` \| { `port`: `number` ; `wss`: `Server` }\>

#### Defined in

[plugins/plugin-bash-like/src/pty/server.ts:509](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-bash-like/src/pty/server.ts#L509)
