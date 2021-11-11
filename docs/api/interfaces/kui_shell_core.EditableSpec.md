[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / EditableSpec

# Interface: EditableSpec

[@kui-shell/core](../modules/kui_shell_core.md).EditableSpec

## Table of contents

### Properties

- [clearable](kui_shell_core.EditableSpec.md#clearable)
- [readOnly](kui_shell_core.EditableSpec.md#readonly)
- [revert](kui_shell_core.EditableSpec.md#revert)
- [save](kui_shell_core.EditableSpec.md#save)

## Properties

### clearable

• **clearable**: `boolean`

Should we offer a Clear button? Default: false

#### Defined in

[packages/core/src/models/editable.ts:30](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/editable.ts#L30)

---

### readOnly

• **readOnly**: `boolean`

Should the editor be opened in read-only mode? Default: false

#### Defined in

[packages/core/src/models/editable.ts:27](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/editable.ts#L27)

---

### revert

• **revert**: `Object`

Button and Controller to handle reverts

#### Type declaration

| Name       | Type                                   |
| :--------- | :------------------------------------- |
| `label?`   | `string`                               |
| `onRevert` | () => `string` \| `Promise`<`string`\> |

#### Defined in

[packages/core/src/models/editable.ts:39](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/editable.ts#L39)

---

### save

• **save**: `Object`

Button and Controller to handle saves

#### Type declaration

| Name     | Type                                               |
| :------- | :------------------------------------------------- |
| `label`  | `string`                                           |
| `onSave` | (`data`: `string`) => `Save` \| `Promise`<`Save`\> |

#### Defined in

[packages/core/src/models/editable.ts:33](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/editable.ts#L33)
