[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](kui_shell_core.md) / Themes

# Namespace: Themes

[@kui-shell/core](kui_shell_core.md).Themes

## Table of contents

### Interfaces

- [ThemeProperties](../interfaces/kui_shell_core.Themes.ThemeProperties.md)

### Type aliases

- [Theme](kui_shell_core.Themes.md#theme)

### Functions

- [findThemeByName](kui_shell_core.Themes.md#findthemebyname)
- [getDefaultTheme](kui_shell_core.Themes.md#getdefaulttheme)
- [getPersistedThemeChoice](kui_shell_core.Themes.md#getpersistedthemechoice)
- [resetToDefaultTheme](kui_shell_core.Themes.md#resettodefaulttheme)
- [switchToTheme](kui_shell_core.Themes.md#switchtotheme)

## Type aliases

### Theme

Ƭ **Theme**: [`ThemeProperties`](../interfaces/kui_shell_core.Themes.ThemeProperties.md) & { `apiVersion?`: `ThemeApiVersion` ; `attrs?`: `string`[] ; `css`: `string` \| `string`[] ; `description?`: `string` ; `lightweight?`: `boolean` ; `name`: `string` ; `style`: `"light"` \| `"dark"` }

#### Defined in

[packages/core/src/webapp/themes/Theme.ts:29](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/webapp/themes/Theme.ts#L29)

## Functions

### findThemeByName

▸ **findThemeByName**(`name`): `Promise`<`Object`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `string` |

#### Returns

`Promise`<`Object`\>

the Theme model associated with the given theme name

#### Defined in

[packages/core/src/webapp/themes/find.ts:25](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/webapp/themes/find.ts#L25)

---

### getDefaultTheme

▸ **getDefaultTheme**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

the name of the default theme

#### Defined in

[packages/core/src/webapp/themes/default.ts:27](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/webapp/themes/default.ts#L27)

---

### getPersistedThemeChoice

▸ `Const` **getPersistedThemeChoice**(): `Promise`<`string`\>

Return the previously selected (and persisted) choice of theme

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/core/src/webapp/themes/persistence.ts:41](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/webapp/themes/persistence.ts#L41)

---

### resetToDefaultTheme

▸ `Const` **resetToDefaultTheme**(): `Promise`<`boolean`\>

Reset to the default theme

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/core/src/webapp/themes/persistence.ts:188](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/webapp/themes/persistence.ts#L188)

---

### switchToTheme

▸ `Const` **switchToTheme**(`theme`, `saveNotNeeded?`): `Promise`<`void`\>

Internal logic to switch themes

#### Parameters

| Name            | Type      | Default value |
| :-------------- | :-------- | :------------ |
| `theme`         | `string`  | `undefined`   |
| `saveNotNeeded` | `boolean` | `false`       |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/core/src/webapp/themes/persistence.ts:71](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/webapp/themes/persistence.ts#L71)
