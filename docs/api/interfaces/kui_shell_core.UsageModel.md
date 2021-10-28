[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / UsageModel

# Interface: UsageModel

[@kui-shell/core](../modules/kui_shell_core.md).UsageModel

## Hierarchy

- `CapabilityRequirements`

  ↳ **`UsageModel`**

## Table of contents

### Properties

- [available](kui_shell_core.UsageModel.md#available)
- [breadcrumb](kui_shell_core.UsageModel.md#breadcrumb)
- [children](kui_shell_core.UsageModel.md#children)
- [command](kui_shell_core.UsageModel.md#command)
- [commandPrefix](kui_shell_core.UsageModel.md#commandprefix)
- [commandPrefixNotNeeded](kui_shell_core.UsageModel.md#commandprefixnotneeded)
- [commandSuffix](kui_shell_core.UsageModel.md#commandsuffix)
- [configuration](kui_shell_core.UsageModel.md#configuration)
- [detailedExample](kui_shell_core.UsageModel.md#detailedexample)
- [docs](kui_shell_core.UsageModel.md#docs)
- [example](kui_shell_core.UsageModel.md#example)
- [fullscreen](kui_shell_core.UsageModel.md#fullscreen)
- [header](kui_shell_core.UsageModel.md#header)
- [hide](kui_shell_core.UsageModel.md#hide)
- [intro](kui_shell_core.UsageModel.md#intro)
- [nRowsInViewport](kui_shell_core.UsageModel.md#nrowsinviewport)
- [needsUI](kui_shell_core.UsageModel.md#needsui)
- [noAuthOk](kui_shell_core.UsageModel.md#noauthok)
- [noHelp](kui_shell_core.UsageModel.md#nohelp)
- [noHelpAlias](kui_shell_core.UsageModel.md#nohelpalias)
- [oneof](kui_shell_core.UsageModel.md#oneof)
- [onlyEnforceOptions](kui_shell_core.UsageModel.md#onlyenforceoptions)
- [optional](kui_shell_core.UsageModel.md#optional)
- [parents](kui_shell_core.UsageModel.md#parents)
- [preserveCase](kui_shell_core.UsageModel.md#preservecase)
- [related](kui_shell_core.UsageModel.md#related)
- [required](kui_shell_core.UsageModel.md#required)
- [requiresLocal](kui_shell_core.UsageModel.md#requireslocal)
- [sampleInputs](kui_shell_core.UsageModel.md#sampleinputs)
- [sections](kui_shell_core.UsageModel.md#sections)
- [strict](kui_shell_core.UsageModel.md#strict)
- [synonymFor](kui_shell_core.UsageModel.md#synonymfor)
- [synonyms](kui_shell_core.UsageModel.md#synonyms)
- [title](kui_shell_core.UsageModel.md#title)

### Methods

- [fn](kui_shell_core.UsageModel.md#fn)

## Properties

### available

• `Optional` **available**: [`UsageRow`](kui_shell_core.UsageRow.md)[]

#### Defined in

[packages/core/src/core/usage-error.ts:852](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L852)

---

### breadcrumb

• `Optional` **breadcrumb**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:835](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L835)

---

### children

• `Optional` **children**: `Record`<`string`, `Object`\>

#### Defined in

[packages/core/src/core/usage-error.ts:831](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L831)

---

### command

• `Optional` **command**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:837](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L837)

---

### commandPrefix

• `Optional` **commandPrefix**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:846](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L846)

---

### commandPrefixNotNeeded

• `Optional` **commandPrefixNotNeeded**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:847](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L847)

---

### commandSuffix

• `Optional` **commandSuffix**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:848](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L848)

---

### configuration

• `Optional` **configuration**: `YargsParserConfiguration`

#### Defined in

[packages/core/src/core/usage-error.ts:828](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L828)

---

### detailedExample

• `Optional` **detailedExample**: `DetailedExample` \| `DetailedExample`[]

#### Defined in

[packages/core/src/core/usage-error.ts:842](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L842)

---

### docs

• `Optional` **docs**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:839](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L839)

---

### example

• `Optional` **example**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:841](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L841)

---

### fullscreen

• `Optional` **fullscreen**: `boolean`

#### Inherited from

CapabilityRequirements.fullscreen

#### Defined in

[packages/core/src/models/command.ts:262](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/command.ts#L262)

---

### header

• `Optional` **header**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:840](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L840)

---

### hide

• `Optional` **hide**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:830](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L830)

---

### intro

• `Optional` **intro**: `TitledContent`

#### Defined in

[packages/core/src/core/usage-error.ts:844](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L844)

---

### nRowsInViewport

• `Optional` **nRowsInViewport**: `number` \| `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:856](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L856)

---

### needsUI

• `Optional` **needsUI**: `boolean`

#### Inherited from

CapabilityRequirements.needsUI

#### Defined in

[packages/core/src/models/command.ts:259](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/command.ts#L259)

---

### noAuthOk

• `Optional` **noAuthOk**: `boolean` \| `string`[]

#### Inherited from

CapabilityRequirements.noAuthOk

#### Defined in

[packages/core/src/models/command.ts:261](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/command.ts#L261)

---

### noHelp

• `Optional` **noHelp**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:819](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L819)

---

### noHelpAlias

• `Optional` **noHelpAlias**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:822](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L822)

---

### oneof

• `Optional` **oneof**: [`UsageRow`](kui_shell_core.UsageRow.md)[]

#### Defined in

[packages/core/src/core/usage-error.ts:855](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L855)

---

### onlyEnforceOptions

• `Optional` **onlyEnforceOptions**: `boolean` \| `string`[]

#### Defined in

[packages/core/src/core/usage-error.ts:825](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L825)

---

### optional

• `Optional` **optional**: [`UsageRow`](kui_shell_core.UsageRow.md)[]

#### Defined in

[packages/core/src/core/usage-error.ts:854](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L854)

---

### parents

• `Optional` **parents**: `BreadcrumbLabel`[]

#### Defined in

[packages/core/src/core/usage-error.ts:850](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L850)

---

### preserveCase

• `Optional` **preserveCase**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:849](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L849)

---

### related

• `Optional` **related**: `string`[]

#### Defined in

[packages/core/src/core/usage-error.ts:851](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L851)

---

### required

• `Optional` **required**: [`UsageRow`](kui_shell_core.UsageRow.md)[]

#### Defined in

[packages/core/src/core/usage-error.ts:853](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L853)

---

### requiresLocal

• `Optional` **requiresLocal**: `boolean`

#### Inherited from

CapabilityRequirements.requiresLocal

#### Defined in

[packages/core/src/models/command.ts:260](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/models/command.ts#L260)

---

### sampleInputs

• `Optional` **sampleInputs**: [`UsageRow`](kui_shell_core.UsageRow.md)[]

#### Defined in

[packages/core/src/core/usage-error.ts:843](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L843)

---

### sections

• `Optional` **sections**: `UsageSection`[]

#### Defined in

[packages/core/src/core/usage-error.ts:845](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L845)

---

### strict

• `Optional` **strict**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:838](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L838)

---

### synonymFor

• `Optional` **synonymFor**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:832](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L832)

---

### synonyms

• `Optional` **synonyms**: `string`[]

#### Defined in

[packages/core/src/core/usage-error.ts:833](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L833)

---

### title

• `Optional` **title**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:836](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L836)

## Methods

### fn

▸ `Optional` **fn**(`command`): [`UsageModel`](kui_shell_core.UsageModel.md)

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `command` | `string` |

#### Returns

[`UsageModel`](kui_shell_core.UsageModel.md)

#### Defined in

[packages/core/src/core/usage-error.ts:816](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L816)
