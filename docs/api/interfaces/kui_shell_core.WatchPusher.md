[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / WatchPusher

# Interface: WatchPusher

[@kui-shell/core](../modules/kui_shell_core.md).WatchPusher

callbacks to indicate state changes

## Table of contents

### Methods

- [allOffline](kui_shell_core.WatchPusher.md#alloffline)
- [batchUpdateDone](kui_shell_core.WatchPusher.md#batchupdatedone)
- [done](kui_shell_core.WatchPusher.md#done)
- [footer](kui_shell_core.WatchPusher.md#footer)
- [header](kui_shell_core.WatchPusher.md#header)
- [offline](kui_shell_core.WatchPusher.md#offline)
- [setBody](kui_shell_core.WatchPusher.md#setbody)
- [update](kui_shell_core.WatchPusher.md#update)

## Methods

### allOffline

▸ **allOffline**(): `void`

The entire underlying model has disappared

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:62](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/jobs/watchable.ts#L62)

---

### batchUpdateDone

▸ **batchUpdateDone**(): `void`

A batch of calls to `update` is complete

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:53](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/jobs/watchable.ts#L53)

---

### done

▸ **done**(): `void`

No more updates will be performed

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:59](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/jobs/watchable.ts#L59)

---

### footer

▸ **footer**(`streams`): `void`

#### Parameters

| Name      | Type       |
| :-------- | :--------- |
| `streams` | `string`[] |

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:67](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/jobs/watchable.ts#L67)

---

### header

▸ **header**(`response`): `void`

The header model has changed

#### Parameters

| Name       | Type                                      |
| :--------- | :---------------------------------------- |
| `response` | [`Row`](../classes/kui_shell_core.Row.md) |

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:65](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/jobs/watchable.ts#L65)

---

### offline

▸ **offline**(`rowKey`): `void`

The given keyed row is gone

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `rowKey` | `string` |

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:56](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/jobs/watchable.ts#L56)

---

### setBody

▸ **setBody**(`response`): `void`

set table body

#### Parameters

| Name       | Type                                        |
| :--------- | :------------------------------------------ |
| `response` | [`Row`](../classes/kui_shell_core.Row.md)[] |

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:50](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/jobs/watchable.ts#L50)

---

### update

▸ **update**(`response`, `batch?`, `changed?`, `idxToUpdate?`): `void`

#### Parameters

| Name           | Type                                      | Description       |
| :------------- | :---------------------------------------- | :---------------- |
| `response`     | [`Row`](../classes/kui_shell_core.Row.md) | Updated row model |
| `batch?`       | `boolean`                                 | -                 |
| `changed?`     | `boolean`                                 | -                 |
| `idxToUpdate?` | `number`                                  | -                 |

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:47](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/jobs/watchable.ts#L47)
