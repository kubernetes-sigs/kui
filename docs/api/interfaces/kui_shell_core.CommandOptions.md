[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / CommandOptions

# Interface: CommandOptions

[@kui-shell/core](../modules/kui_shell_core.md).CommandOptions

## Hierarchy

- `CapabilityRequirements`

  ↳ **`CommandOptions`**

## Table of contents

### Properties

- [docs](kui_shell_core.CommandOptions.md#docs)
- [flags](kui_shell_core.CommandOptions.md#flags)
- [fullscreen](kui_shell_core.CommandOptions.md#fullscreen)
- [height](kui_shell_core.CommandOptions.md#height)
- [hidden](kui_shell_core.CommandOptions.md#hidden)
- [hide](kui_shell_core.CommandOptions.md#hide)
- [incognito](kui_shell_core.CommandOptions.md#incognito)
- [isDirectory](kui_shell_core.CommandOptions.md#isdirectory)
- [isExperimental](kui_shell_core.CommandOptions.md#isexperimental)
- [listen](kui_shell_core.CommandOptions.md#listen)
- [needsUI](kui_shell_core.CommandOptions.md#needsui)
- [noArgs](kui_shell_core.CommandOptions.md#noargs)
- [noAuthOk](kui_shell_core.CommandOptions.md#noauthok)
- [noCoreRedirect](kui_shell_core.CommandOptions.md#nocoreredirect)
- [okOptions](kui_shell_core.CommandOptions.md#okoptions)
- [outputOnly](kui_shell_core.CommandOptions.md#outputonly)
- [override](kui_shell_core.CommandOptions.md#override)
- [plugin](kui_shell_core.CommandOptions.md#plugin)
- [preferReExecute](kui_shell_core.CommandOptions.md#preferreexecute)
- [requiresLocal](kui_shell_core.CommandOptions.md#requireslocal)
- [semiExpand](kui_shell_core.CommandOptions.md#semiexpand)
- [synonymFor](kui_shell_core.CommandOptions.md#synonymfor)
- [usage](kui_shell_core.CommandOptions.md#usage)
- [viewName](kui_shell_core.CommandOptions.md#viewname)
- [viewTransformer](kui_shell_core.CommandOptions.md#viewtransformer)
- [width](kui_shell_core.CommandOptions.md#width)

## Properties

### docs

• `Optional` **docs**: `string`

#### Defined in

[packages/core/src/models/command.ts:85](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L85)

---

### flags

• `Optional` **flags**: `YargsParserFlags`

#### Defined in

[packages/core/src/models/command.ts:64](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L64)

---

### fullscreen

• `Optional` **fullscreen**: `boolean`

#### Inherited from

CapabilityRequirements.fullscreen

#### Defined in

[packages/core/src/models/command.ts:262](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L262)

---

### height

• `Optional` **height**: `number`

#### Defined in

[packages/core/src/models/command.ts:79](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L79)

---

### hidden

• `Optional` **hidden**: `boolean`

#### Defined in

[packages/core/src/models/command.ts:67](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L67)

---

### hide

• `Optional` **hide**: `boolean`

#### Defined in

[packages/core/src/models/command.ts:87](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L87)

---

### incognito

• `Optional` **incognito**: `"popup"`[]

#### Defined in

[packages/core/src/models/command.ts:70](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L70)

---

### isDirectory

• `Optional` **isDirectory**: `boolean`

is this an interior node ("directory", versus a leaf-node with a command handler

#### Defined in

[packages/core/src/models/command.ts:82](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L82)

---

### isExperimental

• `Optional` **isExperimental**: `boolean`

Is the command experimental? e.g. initial release, lack of test coverage

#### Defined in

[packages/core/src/models/command.ts:102](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L102)

---

### listen

• `Optional` **listen**: `CommandListener`

#### Defined in

[packages/core/src/models/command.ts:84](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L84)

---

### needsUI

• `Optional` **needsUI**: `boolean`

#### Inherited from

CapabilityRequirements.needsUI

#### Defined in

[packages/core/src/models/command.ts:259](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L259)

---

### noArgs

• `Optional` **noArgs**: `boolean`

does this command accept no arguments of any sort (neither positional nor optional)?

#### Defined in

[packages/core/src/models/command.ts:55](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L55)

---

### noAuthOk

• `Optional` **noAuthOk**: `boolean` \| `string`[]

#### Inherited from

CapabilityRequirements.noAuthOk

#### Defined in

[packages/core/src/models/command.ts:261](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L261)

---

### noCoreRedirect

• `Optional` **noCoreRedirect**: `boolean`

controller wants to handle redirect

#### Defined in

[packages/core/src/models/command.ts:93](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L93)

---

### okOptions

• `Optional` **okOptions**: `string`[]

#### Defined in

[packages/core/src/models/command.ts:90](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L90)

---

### outputOnly

• `Optional` **outputOnly**: `boolean`

Is the command only want to show output and hide input?

#### Defined in

[packages/core/src/models/command.ts:108](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L108)

---

### override

• `Optional` **override**: [`CommandHandler`](../modules/kui_shell_core.md#commandhandler)<[`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\>, [`ParsedOptions`](kui_shell_core.ParsedOptions.md)\>

#### Defined in

[packages/core/src/models/command.ts:88](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L88)

---

### plugin

• `Optional` **plugin**: `string`

#### Defined in

[packages/core/src/models/command.ts:89](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L89)

---

### preferReExecute

• `Optional` **preferReExecute**: `boolean`

When this command is being replayed, prefer to re-execute if possible

#### Defined in

[packages/core/src/models/command.ts:111](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L111)

---

### requiresLocal

• `Optional` **requiresLocal**: `boolean`

#### Inherited from

CapabilityRequirements.requiresLocal

#### Defined in

[packages/core/src/models/command.ts:260](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L260)

---

### semiExpand

• `Optional` **semiExpand**: `boolean`

Semicolon-expand the command line? Default: true

#### Defined in

[packages/core/src/models/command.ts:58](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L58)

---

### synonymFor

• `Optional` **synonymFor**: `Command`<[`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\>, [`ParsedOptions`](kui_shell_core.ParsedOptions.md)\>

#### Defined in

[packages/core/src/models/command.ts:86](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L86)

---

### usage

• `Optional` **usage**: [`UsageModel`](kui_shell_core.UsageModel.md)

#### Defined in

[packages/core/src/models/command.ts:61](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L61)

---

### viewName

• `Optional` **viewName**: `string`

#### Defined in

[packages/core/src/models/command.ts:73](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L73)

---

### viewTransformer

• `Optional` **viewTransformer**: [`ViewTransformer`](../modules/kui_shell_core.md#viewtransformer)<[`KResponse`](../modules/kui_shell_core.md#kresponse)<`any`\>, [`ParsedOptions`](kui_shell_core.ParsedOptions.md)\>

model to view transformer

#### Defined in

[packages/core/src/models/command.ts:96](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L96)

---

### width

• `Optional` **width**: `number`

#### Defined in

[packages/core/src/models/command.ts:76](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/models/command.ts#L76)
