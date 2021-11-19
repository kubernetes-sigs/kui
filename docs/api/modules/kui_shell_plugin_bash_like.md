[Kui API Documentation - v10.8.0](../README.md) / @kui-shell/plugin-bash-like

# Module: @kui-shell/plugin-bash-like

## Table of contents

### Classes

- [StdioChannelWebsocketSide](../classes/kui_shell_plugin_bash_like.StdioChannelWebsocketSide.md)

### Functions

- [doExecPipe](kui_shell_plugin_bash_like.md#doexecpipe)
- [doExecWithPty](kui_shell_plugin_bash_like.md#doexecwithpty)
- [doExecWithStdoutViaPty](kui_shell_plugin_bash_like.md#doexecwithstdoutviapty)
- [getSessionForTab](kui_shell_plugin_bash_like.md#getsessionfortab)
- [getTabState](kui_shell_plugin_bash_like.md#gettabstate)
- [main](kui_shell_plugin_bash_like.md#main)

## Functions

### doExecPipe

▸ **doExecPipe**(`argvs`, `repl`, `execOptions?`): `Promise`<`unknown`\>

#### Parameters

| Name           | Type                                                                   |
| :------------- | :--------------------------------------------------------------------- |
| `argvs`        | `string`[][]                                                           |
| `repl`         | `default`                                                              |
| `execOptions?` | `Pick`<`ExecOptions`, `"cwd"` \| `"env"` \| `"stderr"` \| `"stdout"`\> |

#### Returns

`Promise`<`unknown`\>

#### Defined in

[plugins/plugin-bash-like/src/lib/cmds/pipe.ts:23](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-bash-like/src/lib/cmds/pipe.ts#L23)

---

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

[plugins/plugin-bash-like/src/lib/cmds/catchall.ts:28](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-bash-like/src/lib/cmds/catchall.ts#L28)

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

[plugins/plugin-bash-like/src/lib/cmds/catchall.ts:105](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-bash-like/src/lib/cmds/catchall.ts#L105)

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

[plugins/plugin-bash-like/src/pty/sessionCache.ts:38](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-bash-like/src/pty/sessionCache.ts#L38)

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

[plugins/plugin-bash-like/src/tab-state/get.ts:21](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-bash-like/src/tab-state/get.ts#L21)

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

[plugins/plugin-bash-like/src/pty/server.ts:509](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-bash-like/src/pty/server.ts#L509)
