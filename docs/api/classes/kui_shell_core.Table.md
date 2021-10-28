[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / Table

# Class: Table<RowType\>

[@kui-shell/core](../modules/kui_shell_core.md).Table

## Type parameters

| Name      | Type                                                                 |
| :-------- | :------------------------------------------------------------------- |
| `RowType` | extends [`Row`](kui_shell_core.Row.md)[`Row`](kui_shell_core.Row.md) |

## Table of contents

### Constructors

- [constructor](kui_shell_core.Table.md#constructor)

### Properties

- [allowedPresentations](kui_shell_core.Table.md#allowedpresentations)
- [body](kui_shell_core.Table.md#body)
- [breadcrumbs](kui_shell_core.Table.md#breadcrumbs)
- [coldStartColumnIdx](kui_shell_core.Table.md#coldstartcolumnidx)
- [colorBy](kui_shell_core.Table.md#colorby)
- [completeColumnIdx](kui_shell_core.Table.md#completecolumnidx)
- [defaultPresentation](kui_shell_core.Table.md#defaultpresentation)
- [drilldownTo](kui_shell_core.Table.md#drilldownto)
- [durationColumnIdx](kui_shell_core.Table.md#durationcolumnidx)
- [flexWrap](kui_shell_core.Table.md#flexwrap)
- [fontawesome](kui_shell_core.Table.md#fontawesome)
- [fontawesomeBalloon](kui_shell_core.Table.md#fontawesomeballoon)
- [fontawesomeCSS](kui_shell_core.Table.md#fontawesomecss)
- [footer](kui_shell_core.Table.md#footer)
- [header](kui_shell_core.Table.md#header)
- [markdown](kui_shell_core.Table.md#markdown)
- [nFooterMessages](kui_shell_core.Table.md#nfootermessages)
- [noSort](kui_shell_core.Table.md#nosort)
- [queueingDelayColumnIdx](kui_shell_core.Table.md#queueingdelaycolumnidx)
- [resourceVersion](kui_shell_core.Table.md#resourceversion)
- [startColumnIdx](kui_shell_core.Table.md#startcolumnidx)
- [statusColumnIdx](kui_shell_core.Table.md#statuscolumnidx)
- [style](kui_shell_core.Table.md#style)
- [tableCSS](kui_shell_core.Table.md#tablecss)
- [title](kui_shell_core.Table.md#title)

## Constructors

### constructor

• **new Table**<`RowType`\>(`table`)

#### Type parameters

| Name      | Type                                                                             |
| :-------- | :------------------------------------------------------------------------------- |
| `RowType` | extends [`Row`](kui_shell_core.Row.md)<`RowType`\>[`Row`](kui_shell_core.Row.md) |

#### Parameters

| Name    | Type                                                                |
| :------ | :------------------------------------------------------------------ |
| `table` | [`Table`](kui_shell_core.Table.md)<[`Row`](kui_shell_core.Row.md)\> |

#### Defined in

[packages/core/src/webapp/models/table.ts:212](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L212)

## Properties

### allowedPresentations

• `Optional` **allowedPresentations**: `PresentationStyle`[]

Allowed presentations?

#### Defined in

[packages/core/src/webapp/models/table.ts:161](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L161)

---

### body

• **body**: `RowType`[]

#### Defined in

[packages/core/src/webapp/models/table.ts:142](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L142)

---

### breadcrumbs

• `Optional` **breadcrumbs**: [`Breadcrumb`](../interfaces/kui_shell_core.Breadcrumb.md)[] \| () => [`Breadcrumb`](../interfaces/kui_shell_core.Breadcrumb.md)[]

#### Defined in

[packages/core/src/webapp/models/table.ts:200](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L200)

---

### coldStartColumnIdx

• `Optional` **coldStartColumnIdx**: `number`

Column index to be interpreted as a time to initialize the computation

#### Defined in

[packages/core/src/webapp/models/table.ts:170](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L170)

---

### colorBy

• `Optional` **colorBy**: `"default"` \| `"status"` \| `"duration"`

Coloring strategy for e.g. 'grid' and 'sequence-diagram' and 'histogram'

#### Defined in

[packages/core/src/webapp/models/table.ts:182](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L182)

---

### completeColumnIdx

• `Optional` **completeColumnIdx**: `number`

Column index to be interpreted as a complete timestamp column

#### Defined in

[packages/core/src/webapp/models/table.ts:179](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L179)

---

### defaultPresentation

• `Optional` **defaultPresentation**: `PresentationStyle`

Default presentation?

#### Defined in

[packages/core/src/webapp/models/table.ts:158](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L158)

---

### drilldownTo

• `Optional` **drilldownTo**: `"side-split"` \| `"this-split"` \| `"new-window"`

Should drilldowns go to a side split, or to this split? Default:
`side-split`, unless the user chords the click with the Meta key
(which is Command on macOS, and Option on Linux/Windows

#### Defined in

[packages/core/src/webapp/models/table.ts:155](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L155)

---

### durationColumnIdx

• `Optional` **durationColumnIdx**: `number`

Column index to be interpreted as a duration column

#### Defined in

[packages/core/src/webapp/models/table.ts:167](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L167)

---

### flexWrap

• `Optional` **flexWrap**: `number` \| `boolean`

#### Defined in

[packages/core/src/webapp/models/table.ts:202](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L202)

---

### fontawesome

• `Optional` **fontawesome**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:206](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L206)

---

### fontawesomeBalloon

• `Optional` **fontawesomeBalloon**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:210](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L210)

---

### fontawesomeCSS

• `Optional` **fontawesomeCSS**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:208](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L208)

---

### footer

• `Optional` **footer**: `string`[]

#### Defined in

[packages/core/src/webapp/models/table.ts:188](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L188)

---

### header

• `Optional` **header**: `RowType` & { `isSortable?`: `boolean` }

#### Defined in

[packages/core/src/webapp/models/table.ts:186](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L186)

---

### markdown

• `Optional` **markdown**: `boolean`

Markdown cells?

#### Defined in

[packages/core/src/webapp/models/table.ts:145](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L145)

---

### nFooterMessages

• `Optional` **nFooterMessages**: `number`

E.g. when displaying events for a Kubernetes table, how many
events to show in the viewport. Use -1 to show them
all. [Default: 6]

#### Defined in

[packages/core/src/webapp/models/table.ts:195](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L195)

---

### noSort

• `Optional` **noSort**: `boolean`

#### Defined in

[packages/core/src/webapp/models/table.ts:197](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L197)

---

### queueingDelayColumnIdx

• `Optional` **queueingDelayColumnIdx**: `number`

Column index to be interpreted as a time spent in a run queue

#### Defined in

[packages/core/src/webapp/models/table.ts:173](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L173)

---

### resourceVersion

• `Optional` **resourceVersion**: `string` \| `number`

This field helps with watching/paginating

#### Defined in

[packages/core/src/webapp/models/table.ts:148](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L148)

---

### startColumnIdx

• `Optional` **startColumnIdx**: `number`

Column index to be interpreted as a start timestamp column

#### Defined in

[packages/core/src/webapp/models/table.ts:176](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L176)

---

### statusColumnIdx

• `Optional` **statusColumnIdx**: `number`

Column index to be interpreted as a status column

#### Defined in

[packages/core/src/webapp/models/table.ts:164](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L164)

---

### style

• `Optional` **style**: [`TableStyle`](../enums/kui_shell_core.TableStyle.md)

#### Defined in

[packages/core/src/webapp/models/table.ts:184](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L184)

---

### tableCSS

• `Optional` **tableCSS**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:204](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L204)

---

### title

• `Optional` **title**: `string`

#### Defined in

[packages/core/src/webapp/models/table.ts:199](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/webapp/models/table.ts#L199)
