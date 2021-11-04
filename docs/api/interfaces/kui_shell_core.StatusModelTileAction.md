[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / StatusModelTileAction

# Interface: StatusModelTileAction

[@kui-shell/core](../modules/kui_shell_core.md).StatusModelTileAction

## Table of contents

### Properties

- [label](kui_shell_core.StatusModelTileAction.md#label)

### Methods

- [isVisible](kui_shell_core.StatusModelTileAction.md#isvisible)
- [onClick](kui_shell_core.StatusModelTileAction.md#onclick)

## Properties

### label

• **label**: `string`

Label for e.g. Button UI

#### Defined in

[packages/core/src/models/StatusModel.ts:34](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/StatusModel.ts#L34)

## Methods

### isVisible

▸ **isVisible**(`items`): `boolean` \| `Promise`<`boolean`\>

Should the button be shown?

#### Parameters

| Name    | Type                                                     |
| :------ | :------------------------------------------------------- |
| `items` | [`StatusModelItem`](kui_shell_core.StatusModelItem.md)[] |

#### Returns

`boolean` \| `Promise`<`boolean`\>

#### Defined in

[packages/core/src/models/StatusModel.ts:37](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/StatusModel.ts#L37)

---

### onClick

▸ **onClick**(`items`): `Promise`<[`StatusModelItem`](kui_shell_core.StatusModelItem.md)[]\>

What happens when the button is clicked? @return updated items

#### Parameters

| Name    | Type                                                     |
| :------ | :------------------------------------------------------- |
| `items` | [`StatusModelItem`](kui_shell_core.StatusModelItem.md)[] |

#### Returns

`Promise`<[`StatusModelItem`](kui_shell_core.StatusModelItem.md)[]\>

#### Defined in

[packages/core/src/models/StatusModel.ts:40](https://github.com/mra-ruiz/kui/blob/76908b178/packages/core/src/models/StatusModel.ts#L40)
