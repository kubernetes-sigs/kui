[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / Row

# Class: Row

[@kui-shell/core](../modules/kui_shell_core.md).Row

## Table of contents

### Constructors

- [constructor](kui_shell_core.Row.md#constructor)

### Properties

- [attributes](kui_shell_core.Row.md#attributes)
- [beforeAttributes](kui_shell_core.Row.md#beforeattributes)
- [css](kui_shell_core.Row.md#css)
- [done](kui_shell_core.Row.md#done)
- [drilldownTo](kui_shell_core.Row.md#drilldownto)
- [fontawesome](kui_shell_core.Row.md#fontawesome)
- [fontawesomeCSS](kui_shell_core.Row.md#fontawesomecss)
- [fullName](kui_shell_core.Row.md#fullname)
- [isDeleted](kui_shell_core.Row.md#isdeleted)
- [key](kui_shell_core.Row.md#key)
- [kind](kui_shell_core.Row.md#kind)
- [name](kui_shell_core.Row.md#name)
- [nameCss](kui_shell_core.Row.md#namecss)
- [nameDom](kui_shell_core.Row.md#namedom)
- [object](kui_shell_core.Row.md#object)
- [onclick](kui_shell_core.Row.md#onclick)
- [onclickExec](kui_shell_core.Row.md#onclickexec)
- [onclickIdempotent](kui_shell_core.Row.md#onclickidempotent)
- [outerCSS](kui_shell_core.Row.md#outercss)
- [packageName](kui_shell_core.Row.md#packagename)
- [prettyKind](kui_shell_core.Row.md#prettykind)
- [prettyName](kui_shell_core.Row.md#prettyname)
- [prettyType](kui_shell_core.Row.md#prettytype)
- [prettyVersion](kui_shell_core.Row.md#prettyversion)
- [rowCSS](kui_shell_core.Row.md#rowcss)
- [rowKey](kui_shell_core.Row.md#rowkey)
- [setSelected](kui_shell_core.Row.md#setselected)
- [setUnselected](kui_shell_core.Row.md#setunselected)
- [status](kui_shell_core.Row.md#status)
- [type](kui_shell_core.Row.md#type)
- [version](kui_shell_core.Row.md#version)

## Constructors

### constructor

• **new Row**(`row`)

#### Parameters

| Name  | Type                           |
| :---- | :----------------------------- |
| `row` | [`Row`](kui_shell_core.Row.md) |

#### Defined in

[packages/core/src/webapp/models/table.ts:95](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L95)

## Properties

### attributes

• `Optional` **attributes**: [`Cell`](kui_shell_core.Cell.md)[]

#### Defined in

[packages/core/src/webapp/models/table.ts:24](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L24)

---

### beforeAttributes

• `Optional` **beforeAttributes**: [`Cell`](kui_shell_core.Cell.md)[]

#### Defined in

[packages/core/src/webapp/models/table.ts:77](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L77)

---

### css

• `Optional` **css**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:89](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L89)

---

### done

• `Optional` **done**: `boolean`

#### Defined in

[packages/core/src/webapp/models/table.ts:93](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L93)

---

### drilldownTo

• `Optional` **drilldownTo**: `"side-split"` \| `"this-split"` \| `"new-window"`

#### Defined in

[packages/core/src/webapp/models/table.ts:87](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L87)

---

### fontawesome

• `Optional` **fontawesome**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:53](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L53)

---

### fontawesomeCSS

• `Optional` **fontawesomeCSS**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:55](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L55)

---

### fullName

• `Optional` **fullName**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:65](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L65)

---

### isDeleted

• `Optional` **isDeleted**: `boolean`

does this row represent a recently deleted resource?

#### Defined in

[packages/core/src/webapp/models/table.ts:45](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L45)

---

### key

• `Optional` **key**: `string`

the key-value pair for the first column

#### Defined in

[packages/core/src/webapp/models/table.ts:39](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L39)

---

### kind

• `Optional` **kind**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:67](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L67)

---

### name

• **name**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:40](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L40)

---

### nameCss

• `Optional` **nameCss**: `string` \| `string`[]

#### Defined in

[packages/core/src/webapp/models/table.ts:61](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L61)

---

### nameDom

• `Optional` **nameDom**: `Element`

#### Defined in

[packages/core/src/webapp/models/table.ts:42](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L42)

---

### object

• `Optional` **object**: `Pick`<[`MetadataNamedResource`](../interfaces/kui_shell_core.MetadataNamedResource.md), `"metadata"`\> & { `spec?`: { `selector?`: { `matchLabels?`: `Record`<`string`, `string`\> } } }

optional associated metadata for the corresponding resource

#### Defined in

[packages/core/src/webapp/models/table.ts:30](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L30)

---

### onclick

• `Optional` **onclick**: `any`

#### Defined in

[packages/core/src/webapp/models/table.ts:85](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L85)

---

### onclickExec

• `Optional` **onclickExec**: `"pexec"` \| `"qexec"`

#### Defined in

[packages/core/src/webapp/models/table.ts:83](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L83)

---

### onclickIdempotent

• `Optional` **onclickIdempotent**: `boolean`

#### Defined in

[packages/core/src/webapp/models/table.ts:81](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L81)

---

### outerCSS

• `Optional` **outerCSS**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:91](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L91)

---

### packageName

• `Optional` **packageName**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:49](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L49)

---

### prettyKind

• `Optional` **prettyKind**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:69](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L69)

---

### prettyName

• `Optional` **prettyName**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:63](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L63)

---

### prettyType

• `Optional` **prettyType**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:51](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L51)

---

### prettyVersion

• `Optional` **prettyVersion**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:75](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L75)

---

### rowCSS

• `Optional` **rowCSS**: `string` \| `string`[]

#### Defined in

[packages/core/src/webapp/models/table.ts:79](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L79)

---

### rowKey

• `Optional` **rowKey**: `string`

uniquely identifies this row in a given table; if not defined, we will use the name field as the row key

#### Defined in

[packages/core/src/webapp/models/table.ts:27](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L27)

---

### setSelected

• `Optional` **setSelected**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/core/src/webapp/models/table.ts:57](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L57)

---

### setUnselected

• `Optional` **setUnselected**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[packages/core/src/webapp/models/table.ts:59](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L59)

---

### status

• `Optional` **status**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:71](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L71)

---

### type

• `Optional` **type**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:47](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L47)

---

### version

• `Optional` **version**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:73](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/models/table.ts#L73)
