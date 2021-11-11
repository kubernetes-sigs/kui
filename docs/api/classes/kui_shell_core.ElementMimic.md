[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / ElementMimic

# Class: ElementMimic

[@kui-shell/core](../modules/kui_shell_core.md).ElementMimic

## Table of contents

### Constructors

- [constructor](kui_shell_core.ElementMimic.md#constructor)

### Properties

- [\_attrs](kui_shell_core.ElementMimic.md#_attrs)
- [\_isFakeDom](kui_shell_core.ElementMimic.md#_isfakedom)
- [cells](kui_shell_core.ElementMimic.md#cells)
- [children](kui_shell_core.ElementMimic.md#children)
- [classList](kui_shell_core.ElementMimic.md#classlist)
- [className](kui_shell_core.ElementMimic.md#classname)
- [innerHTML](kui_shell_core.ElementMimic.md#innerhtml)
- [innerText](kui_shell_core.ElementMimic.md#innertext)
- [nodeType](kui_shell_core.ElementMimic.md#nodetype)
- [rows](kui_shell_core.ElementMimic.md#rows)
- [style](kui_shell_core.ElementMimic.md#style)
- [value](kui_shell_core.ElementMimic.md#value)

### Methods

- [addEventListener](kui_shell_core.ElementMimic.md#addeventlistener)
- [appendChild](kui_shell_core.ElementMimic.md#appendchild)
- [cloneNode](kui_shell_core.ElementMimic.md#clonenode)
- [focus](kui_shell_core.ElementMimic.md#focus)
- [getAttribute](kui_shell_core.ElementMimic.md#getattribute)
- [hasStyle](kui_shell_core.ElementMimic.md#hasstyle)
- [insertCell](kui_shell_core.ElementMimic.md#insertcell)
- [insertRow](kui_shell_core.ElementMimic.md#insertrow)
- [querySelector](kui_shell_core.ElementMimic.md#queryselector)
- [querySelectorAll](kui_shell_core.ElementMimic.md#queryselectorall)
- [recursiveInnerTextLength](kui_shell_core.ElementMimic.md#recursiveinnertextlength)
- [remove](kui_shell_core.ElementMimic.md#remove)
- [removeAttribute](kui_shell_core.ElementMimic.md#removeattribute)
- [setAttribute](kui_shell_core.ElementMimic.md#setattribute)
- [isFakeDom](kui_shell_core.ElementMimic.md#isfakedom)

## Constructors

### constructor

• **new ElementMimic**()

## Properties

### \_attrs

• `Private` **\_attrs**: `Object` = `{}`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/core/src/util/element-mimic.ts:76](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L76)

---

### \_isFakeDom

• `Private` `Readonly` **\_isFakeDom**: `true`

#### Defined in

[packages/core/src/util/element-mimic.ts:54](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L54)

---

### cells

• **cells**: [`ElementMimic`](kui_shell_core.ElementMimic.md)[] = `[]`

#### Defined in

[packages/core/src/util/element-mimic.ts:72](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L72)

---

### children

• **children**: [`ElementMimic`](kui_shell_core.ElementMimic.md)[] = `[]`

#### Defined in

[packages/core/src/util/element-mimic.ts:70](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L70)

---

### classList

• **classList**: `ClassList`

#### Defined in

[packages/core/src/util/element-mimic.ts:64](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L64)

---

### className

• **className**: `string` = `''`

#### Defined in

[packages/core/src/util/element-mimic.ts:62](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L62)

---

### innerHTML

• **innerHTML**: `string` = `''`

#### Defined in

[packages/core/src/util/element-mimic.ts:60](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L60)

---

### innerText

• **innerText**: `string` = `''`

#### Defined in

[packages/core/src/util/element-mimic.ts:58](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L58)

---

### nodeType

• **nodeType**: `string` = `''`

#### Defined in

[packages/core/src/util/element-mimic.ts:66](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L66)

---

### rows

• **rows**: [`ElementMimic`](kui_shell_core.ElementMimic.md)[] = `[]`

#### Defined in

[packages/core/src/util/element-mimic.ts:74](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L74)

---

### style

• **style**: `Object` = `{}`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[packages/core/src/util/element-mimic.ts:68](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L68)

---

### value

• **value**: `string` = `''`

#### Defined in

[packages/core/src/util/element-mimic.ts:56](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L56)

## Methods

### addEventListener

▸ **addEventListener**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/core/src/util/element-mimic.ts:118](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L118)

---

### appendChild

▸ **appendChild**(`c`): `number`

#### Parameters

| Name | Type                                             |
| :--- | :----------------------------------------------- |
| `c`  | [`ElementMimic`](kui_shell_core.ElementMimic.md) |

#### Returns

`number`

#### Defined in

[packages/core/src/util/element-mimic.ts:82](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L82)

---

### cloneNode

▸ **cloneNode**(): [`ElementMimic`](kui_shell_core.ElementMimic.md)

#### Returns

[`ElementMimic`](kui_shell_core.ElementMimic.md)

#### Defined in

[packages/core/src/util/element-mimic.ts:105](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L105)

---

### focus

▸ **focus**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/util/element-mimic.ts:78](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L78)

---

### getAttribute

▸ **getAttribute**(`k`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `k`  | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/util/element-mimic.ts:86](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L86)

---

### hasStyle

▸ **hasStyle**(`style`, `desiredValue?`): `string` \| `boolean`

#### Parameters

| Name            | Type                 |
| :-------------- | :------------------- |
| `style`         | `string`             |
| `desiredValue?` | `string` \| `number` |

#### Returns

`string` \| `boolean`

#### Defined in

[packages/core/src/util/element-mimic.ts:122](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L122)

---

### insertCell

▸ **insertCell**(`idx`): [`ElementMimic`](kui_shell_core.ElementMimic.md)

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `idx` | `number` |

#### Returns

[`ElementMimic`](kui_shell_core.ElementMimic.md)

#### Defined in

[packages/core/src/util/element-mimic.ts:146](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L146)

---

### insertRow

▸ **insertRow**(`idx`): [`ElementMimic`](kui_shell_core.ElementMimic.md)

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `idx` | `number` |

#### Returns

[`ElementMimic`](kui_shell_core.ElementMimic.md)

#### Defined in

[packages/core/src/util/element-mimic.ts:136](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L136)

---

### querySelector

▸ **querySelector**(): [`ElementMimic`](kui_shell_core.ElementMimic.md)

#### Returns

[`ElementMimic`](kui_shell_core.ElementMimic.md)

#### Defined in

[packages/core/src/util/element-mimic.ts:114](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L114)

---

### querySelectorAll

▸ **querySelectorAll**(`selector`): [`ElementMimic`](kui_shell_core.ElementMimic.md)[]

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `selector` | `string` |

#### Returns

[`ElementMimic`](kui_shell_core.ElementMimic.md)[]

#### Defined in

[packages/core/src/util/element-mimic.ts:110](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L110)

---

### recursiveInnerTextLength

▸ **recursiveInnerTextLength**(): `number`

#### Returns

`number`

#### Defined in

[packages/core/src/util/element-mimic.ts:130](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L130)

---

### remove

▸ **remove**(): `void`

#### Returns

`void`

#### Defined in

[packages/core/src/util/element-mimic.ts:95](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L95)

---

### removeAttribute

▸ **removeAttribute**(`k`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `k`  | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/util/element-mimic.ts:99](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L99)

---

### setAttribute

▸ **setAttribute**(`k`, `v`): `string`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `k`  | `string` |
| `v`  | `string` |

#### Returns

`string`

#### Defined in

[packages/core/src/util/element-mimic.ts:90](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L90)

---

### isFakeDom

▸ `Static` **isFakeDom**(`dom`): dom is ElementMimic

#### Parameters

| Name  | Type  |
| :---- | :---- |
| `dom` | `any` |

#### Returns

dom is ElementMimic

#### Defined in

[packages/core/src/util/element-mimic.ts:155](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/util/element-mimic.ts#L155)
