[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / WatchPusher

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
- [progress](kui_shell_core.WatchPusher.md#progress)
- [setBody](kui_shell_core.WatchPusher.md#setbody)
- [update](kui_shell_core.WatchPusher.md#update)

## Methods

### allOffline

▸ **allOffline**(): `void`

The entire underlying model has disappared

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:80](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L80)

---

### batchUpdateDone

▸ **batchUpdateDone**(): `void`

A batch of calls to `update` is complete

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:71](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L71)

---

### done

▸ **done**(): `void`

No more updates will be performed

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:77](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L77)

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

[packages/core/src/core/jobs/watchable.ts:85](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L85)

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

[packages/core/src/core/jobs/watchable.ts:83](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L83)

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

[packages/core/src/core/jobs/watchable.ts:74](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L74)

---

### progress

▸ **progress**(`progress`): `void`

Update progress bar for a given row

#### Parameters

| Name                       | Type     |
| :------------------------- | :------- |
| `progress`                 | `Object` |
| `progress.fileName?`       | `string` |
| `progress.message?`        | `string` |
| `progress.percentComplete` | `number` |
| `progress.rowIdx`          | `number` |
| `progress.totalSize?`      | `number` |

#### Returns

`void`

#### Defined in

[packages/core/src/core/jobs/watchable.ts:59](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L59)

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

[packages/core/src/core/jobs/watchable.ts:68](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L68)

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

[packages/core/src/core/jobs/watchable.ts:47](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/jobs/watchable.ts#L47)
