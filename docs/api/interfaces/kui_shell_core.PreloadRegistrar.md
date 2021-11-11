[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / PreloadRegistrar

# Interface: PreloadRegistrar

[@kui-shell/core](../modules/kui_shell_core.md).PreloadRegistrar

## Hierarchy

- [`Registrar`](kui_shell_core.Registrar.md)

  ↳ **`PreloadRegistrar`**

## Table of contents

### Properties

- [listen](kui_shell_core.PreloadRegistrar.md#listen)

### Methods

- [catchall](kui_shell_core.PreloadRegistrar.md#catchall)
- [find](kui_shell_core.PreloadRegistrar.md#find)
- [override](kui_shell_core.PreloadRegistrar.md#override)
- [registerBadge](kui_shell_core.PreloadRegistrar.md#registerbadge)
- [registerBadges](kui_shell_core.PreloadRegistrar.md#registerbadges)
- [registerMode](kui_shell_core.PreloadRegistrar.md#registermode)
- [registerModes](kui_shell_core.PreloadRegistrar.md#registermodes)
- [registerSessionInitializer](kui_shell_core.PreloadRegistrar.md#registersessioninitializer)
- [subtree](kui_shell_core.PreloadRegistrar.md#subtree)
- [subtreeSynonym](kui_shell_core.PreloadRegistrar.md#subtreesynonym)
- [synonym](kui_shell_core.PreloadRegistrar.md#synonym)

## Properties

### listen

• **listen**: `CommandListener`

#### Inherited from

[Registrar](kui_shell_core.Registrar.md).[listen](kui_shell_core.Registrar.md#listen)

#### Defined in

[packages/core/src/models/command.ts:329](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L329)

## Methods

### catchall

▸ **catchall**<`T`, `O`\>(`offer`, `handler`, `prio`, `options?`): `void`

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |
| `O`  | extends [`ParsedOptions`](kui_shell_core.ParsedOptions.md)            |

#### Parameters

| Name       | Type                                                                       |
| :--------- | :------------------------------------------------------------------------- |
| `offer`    | `CatchAllOffer`                                                            |
| `handler`  | [`CommandHandler`](../modules/kui_shell_core.md#commandhandler)<`T`, `O`\> |
| `prio`     | `number`                                                                   |
| `options?` | [`CommandOptions`](kui_shell_core.CommandOptions.md)                       |

#### Returns

`void`

#### Inherited from

[Registrar](kui_shell_core.Registrar.md).[catchall](kui_shell_core.Registrar.md#catchall)

#### Defined in

[packages/core/src/models/command.ts:348](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L348)

---

### find

▸ **find**<`T`, `O`\>(`route`, `fromPlugin?`, `noOverride?`): `Promise`<`Command`<`T`, `O`\>\>

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |
| `O`  | extends [`ParsedOptions`](kui_shell_core.ParsedOptions.md)            |

#### Parameters

| Name          | Type      |
| :------------ | :-------- |
| `route`       | `string`  |
| `fromPlugin?` | `string`  |
| `noOverride?` | `boolean` |

#### Returns

`Promise`<`Command`<`T`, `O`\>\>

#### Inherited from

[Registrar](kui_shell_core.Registrar.md).[find](kui_shell_core.Registrar.md#find)

#### Defined in

[packages/core/src/models/command.ts:324](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L324)

---

### override

▸ **override**<`T`, `O`\>(`route`, `fromPlugin`, `handler`, `options?`): `Promise`<`Command`<`T`, `O`\>\>

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |
| `O`  | extends [`ParsedOptions`](kui_shell_core.ParsedOptions.md)            |

#### Parameters

| Name         | Type                                                 |
| :----------- | :--------------------------------------------------- |
| `route`      | `string`                                             |
| `fromPlugin` | `string`                                             |
| `handler`    | `CommandOverrideHandler`<`T`, `O`\>                  |
| `options?`   | [`CommandOptions`](kui_shell_core.CommandOptions.md) |

#### Returns

`Promise`<`Command`<`T`, `O`\>\>

#### Inherited from

[Registrar](kui_shell_core.Registrar.md).[override](kui_shell_core.Registrar.md#override)

#### Defined in

[packages/core/src/models/command.ts:330](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L330)

---

### registerBadge

▸ **registerBadge**<`Resource`\>(`registration`): `void`

sidecar badges

#### Type parameters

| Name       | Type                                                                                          |
| :--------- | :-------------------------------------------------------------------------------------------- |
| `Resource` | extends [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md)<`void`, `Resource`\> |

#### Parameters

| Name           | Type                                                                    |
| :------------- | :---------------------------------------------------------------------- |
| `registration` | [`BadgeRegistration`](kui_shell_core.BadgeRegistration.md)<`Resource`\> |

#### Returns

`void`

#### Defined in

[packages/core/src/models/plugin.ts:34](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/plugin.ts#L34)

---

### registerBadges

▸ **registerBadges**<`Resource`\>(...`registrations`): `void`

#### Type parameters

| Name       | Type                                                                                          |
| :--------- | :-------------------------------------------------------------------------------------------- |
| `Resource` | extends [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md)<`void`, `Resource`\> |

#### Parameters

| Name               | Type                                                                      |
| :----------------- | :------------------------------------------------------------------------ |
| `...registrations` | [`BadgeRegistration`](kui_shell_core.BadgeRegistration.md)<`Resource`\>[] |

#### Returns

`void`

#### Defined in

[packages/core/src/models/plugin.ts:35](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/plugin.ts#L35)

---

### registerMode

▸ **registerMode**<`Resource`\>(`registration`): `void`

sidecar modes

#### Type parameters

| Name       | Type                                                                                          |
| :--------- | :-------------------------------------------------------------------------------------------- |
| `Resource` | extends [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md)<`void`, `Resource`\> |

#### Parameters

| Name           | Type                                                                  |
| :------------- | :-------------------------------------------------------------------- |
| `registration` | [`ModeRegistration`](kui_shell_core.ModeRegistration.md)<`Resource`\> |

#### Returns

`void`

#### Defined in

[packages/core/src/models/plugin.ts:30](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/plugin.ts#L30)

---

### registerModes

▸ **registerModes**<`Resource`\>(...`registrations`): `void`

#### Type parameters

| Name       | Type                                                                                          |
| :--------- | :-------------------------------------------------------------------------------------------- |
| `Resource` | extends [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md)<`void`, `Resource`\> |

#### Parameters

| Name               | Type                                                                    |
| :----------------- | :---------------------------------------------------------------------- |
| `...registrations` | [`ModeRegistration`](kui_shell_core.ModeRegistration.md)<`Resource`\>[] |

#### Returns

`void`

#### Defined in

[packages/core/src/models/plugin.ts:31](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/plugin.ts#L31)

---

### registerSessionInitializer

▸ **registerSessionInitializer**(`init`): `void`

session initializers

#### Parameters

| Name   | Type                 |
| :----- | :------------------- |
| `init` | `SessionInitializer` |

#### Returns

`void`

#### Defined in

[packages/core/src/models/plugin.ts:38](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/plugin.ts#L38)

---

### subtree

▸ **subtree**<`T`, `O`\>(`route`, `options`): `Command`<`T`, `O`\>

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |
| `O`  | extends [`ParsedOptions`](kui_shell_core.ParsedOptions.md)            |

#### Parameters

| Name      | Type                                                 |
| :-------- | :--------------------------------------------------- |
| `route`   | `string`                                             |
| `options` | [`CommandOptions`](kui_shell_core.CommandOptions.md) |

#### Returns

`Command`<`T`, `O`\>

#### Inherited from

[Registrar](kui_shell_core.Registrar.md).[subtree](kui_shell_core.Registrar.md#subtree)

#### Defined in

[packages/core/src/models/command.ts:342](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L342)

---

### subtreeSynonym

▸ **subtreeSynonym**<`T`, `O`\>(`route`, `masterTree`, `options?`): `void`

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |
| `O`  | extends [`ParsedOptions`](kui_shell_core.ParsedOptions.md)            |

#### Parameters

| Name         | Type                                                 |
| :----------- | :--------------------------------------------------- |
| `route`      | `string`                                             |
| `masterTree` | `Command`<`T`, `O`\>                                 |
| `options?`   | [`CommandOptions`](kui_shell_core.CommandOptions.md) |

#### Returns

`void`

#### Inherited from

[Registrar](kui_shell_core.Registrar.md).[subtreeSynonym](kui_shell_core.Registrar.md#subtreesynonym)

#### Defined in

[packages/core/src/models/command.ts:343](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L343)

---

### synonym

▸ **synonym**<`T`, `O`\>(`route`, `handler`, `master`, `options?`): `void`

#### Type parameters

| Name | Type                                                                  |
| :--- | :-------------------------------------------------------------------- |
| `T`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\> |
| `O`  | extends [`ParsedOptions`](kui_shell_core.ParsedOptions.md)            |

#### Parameters

| Name       | Type                                                                       |
| :--------- | :------------------------------------------------------------------------- |
| `route`    | `string`                                                                   |
| `handler`  | [`CommandHandler`](../modules/kui_shell_core.md#commandhandler)<`T`, `O`\> |
| `master`   | `Command`<`T`, `O`\>                                                       |
| `options?` | [`CommandOptions`](kui_shell_core.CommandOptions.md)                       |

#### Returns

`void`

#### Inherited from

[Registrar](kui_shell_core.Registrar.md).[synonym](kui_shell_core.Registrar.md#synonym)

#### Defined in

[packages/core/src/models/command.ts:336](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L336)
