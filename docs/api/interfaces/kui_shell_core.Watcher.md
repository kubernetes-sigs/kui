[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / Watcher

# Interface: Watcher

[@kui-shell/core](../modules/kui_shell_core.md).Watcher

## Table of contents

### Methods

- [init](kui_shell_core.Watcher.md#init)

## Methods

### init

▸ **init**(`pusher`): `void`

the table renderer will call this function when the DOM
is ready to accept updates. when you have updates, please call
one or the other of the provided functions

#### Parameters

| Name     | Type                                           |
| :------- | :--------------------------------------------- |
| `pusher` | [`WatchPusher`](kui_shell_core.WatchPusher.md) |

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:27](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L27)
