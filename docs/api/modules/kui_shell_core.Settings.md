[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](kui_shell_core.md) / Settings

# Namespace: Settings

[@kui-shell/core](kui_shell_core.md).Settings

## Table of contents

### Functions

- [getOrSetPreference](kui_shell_core.Settings.md#getorsetpreference)
- [getPreference](kui_shell_core.Settings.md#getpreference)
- [setPreference](kui_shell_core.Settings.md#setpreference)
- [uiThemes](kui_shell_core.Settings.md#uithemes)
- [userDataDir](kui_shell_core.Settings.md#userdatadir)

## Functions

### getOrSetPreference

▸ **getOrSetPreference**(`key`, `defaultValue`): `Promise`<`string`\>

#### Parameters

| Name           | Type                                               |
| :------------- | :------------------------------------------------- |
| `key`          | `string`                                           |
| `defaultValue` | `string` \| () => `string` \| `Promise`<`string`\> |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/core/src/core/userdata.ts:187](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/userdata.ts#L187)

---

### getPreference

▸ `Const` **getPreference**(`key`): `Promise`<`string`\>

Get a persisted preference

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `key` | `string` |

#### Returns

`Promise`<`string`\>

the preference value

#### Defined in

[packages/core/src/core/userdata.ts:166](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/userdata.ts#L166)

---

### setPreference

▸ `Const` **setPreference**(`key`, `value`): `Promise`<`string`\>

Set a persisted preference

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `key`   | `string` |
| `value` | `string` |

#### Returns

`Promise`<`string`\>

the preference value

#### Defined in

[packages/core/src/core/userdata.ts:179](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/userdata.ts#L179)

---

### uiThemes

▸ **uiThemes**(): `Promise`<`ThemeSet`[]\>

#### Returns

`Promise`<`ThemeSet`[]\>

#### Defined in

[packages/core/src/core/settings.ts:21](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/settings.ts#L21)

---

### userDataDir

▸ `Const` **userDataDir**(): `string`

Get the userdata directory

#### Returns

`string`

#### Defined in

[packages/core/src/core/userdata.ts:34](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/userdata.ts#L34)
