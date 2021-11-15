[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / Registrar

# Interface: Registrar

[@kui-shell/core](../modules/kui_shell_core.md).Registrar

## Hierarchy

- **`Registrar`**

  ↳ [`PreloadRegistrar`](kui_shell_core.PreloadRegistrar.md)

## Table of contents

### Properties

- [listen](kui_shell_core.Registrar.md#listen)

### Methods

- [catchall](kui_shell_core.Registrar.md#catchall)
- [find](kui_shell_core.Registrar.md#find)
- [override](kui_shell_core.Registrar.md#override)
- [subtree](kui_shell_core.Registrar.md#subtree)
- [subtreeSynonym](kui_shell_core.Registrar.md#subtreesynonym)
- [synonym](kui_shell_core.Registrar.md#synonym)

## Properties

### listen

• **listen**: `CommandListener`

#### Defined in

[packages/core/src/models/command.ts:329](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L329)

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

#### Defined in

[packages/core/src/models/command.ts:348](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L348)

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

#### Defined in

[packages/core/src/models/command.ts:324](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L324)

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

#### Defined in

[packages/core/src/models/command.ts:330](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L330)

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

#### Defined in

[packages/core/src/models/command.ts:342](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L342)

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

#### Defined in

[packages/core/src/models/command.ts:343](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L343)

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

#### Defined in

[packages/core/src/models/command.ts:336](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L336)
