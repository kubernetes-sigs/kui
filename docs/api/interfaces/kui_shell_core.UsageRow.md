[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / UsageRow

# Interface: UsageRow

[@kui-shell/core](../modules/kui_shell_core.md).UsageRow

## Table of contents

### Properties

- [advanced](kui_shell_core.UsageRow.md#advanced)
- [alias](kui_shell_core.UsageRow.md#alias)
- [aliases](kui_shell_core.UsageRow.md#aliases)
- [allowed](kui_shell_core.UsageRow.md#allowed)
- [allowedIsPrefixMatch](kui_shell_core.UsageRow.md#allowedisprefixmatch)
- [available](kui_shell_core.UsageRow.md#available)
- [boolean](kui_shell_core.UsageRow.md#boolean)
- [booleanOK](kui_shell_core.UsageRow.md#booleanok)
- [command](kui_shell_core.UsageRow.md#command)
- [commandPrefix](kui_shell_core.UsageRow.md#commandprefix)
- [commandSuffix](kui_shell_core.UsageRow.md#commandsuffix)
- [consumesPositional](kui_shell_core.UsageRow.md#consumespositional)
- [defaultValue](kui_shell_core.UsageRow.md#defaultvalue)
- [dir](kui_shell_core.UsageRow.md#dir)
- [docs](kui_shell_core.UsageRow.md#docs)
- [example](kui_shell_core.UsageRow.md#example)
- [file](kui_shell_core.UsageRow.md#file)
- [header](kui_shell_core.UsageRow.md#header)
- [hidden](kui_shell_core.UsageRow.md#hidden)
- [implicitOK](kui_shell_core.UsageRow.md#implicitok)
- [label](kui_shell_core.UsageRow.md#label)
- [name](kui_shell_core.UsageRow.md#name)
- [narg](kui_shell_core.UsageRow.md#narg)
- [noclick](kui_shell_core.UsageRow.md#noclick)
- [notNeededIfImplicit](kui_shell_core.UsageRow.md#notneededifimplicit)
- [numeric](kui_shell_core.UsageRow.md#numeric)
- [partial](kui_shell_core.UsageRow.md#partial)
- [positional](kui_shell_core.UsageRow.md#positional)
- [synonyms](kui_shell_core.UsageRow.md#synonyms)
- [title](kui_shell_core.UsageRow.md#title)

## Properties

### advanced

• `Optional` **advanced**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:777](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L777)

---

### alias

• `Optional` **alias**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:746](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L746)

---

### aliases

• `Optional` **aliases**: `string`[]

#### Defined in

[packages/core/src/core/usage-error.ts:775](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L775)

---

### allowed

• `Optional` **allowed**: (`string` \| `number` \| `boolean`)[]

#### Defined in

[packages/core/src/core/usage-error.ts:791](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L791)

---

### allowedIsPrefixMatch

• `Optional` **allowedIsPrefixMatch**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:788](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L788)

---

### available

• `Optional` **available**: [`UsageRow`](kui_shell_core.UsageRow.md)[]

#### Defined in

[packages/core/src/core/usage-error.ts:785](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L785)

---

### boolean

• `Optional` **boolean**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:767](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L767)

---

### booleanOK

• `Optional` **booleanOK**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:764](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L764)

---

### command

• `Optional` **command**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:741](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L741)

---

### commandPrefix

• `Optional` **commandPrefix**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:739](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L739)

---

### commandSuffix

• `Optional` **commandSuffix**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:740](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L740)

---

### consumesPositional

• `Optional` **consumesPositional**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:758](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L758)

---

### defaultValue

• `Optional` **defaultValue**: `string` \| `number` \| `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:784](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L784)

---

### dir

• `Optional` **dir**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:779](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L779)

---

### docs

• `Optional` **docs**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:782](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L782)

---

### example

• `Optional` **example**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:778](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L778)

---

### file

• `Optional` **file**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:773](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L773)

---

### header

• `Optional` **header**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:781](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L781)

---

### hidden

• `Optional` **hidden**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:776](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L776)

---

### implicitOK

• `Optional` **implicitOK**: `string`[]

#### Defined in

[packages/core/src/core/usage-error.ts:752](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L752)

---

### label

• `Optional` **label**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:743](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L743)

---

### name

• `Optional` **name**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:742](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L742)

---

### narg

• `Optional` **narg**: `number`

#### Defined in

[packages/core/src/core/usage-error.ts:749](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L749)

---

### noclick

• `Optional` **noclick**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:744](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L744)

---

### notNeededIfImplicit

• `Optional` **notNeededIfImplicit**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:755](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L755)

---

### numeric

• `Optional` **numeric**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:770](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L770)

---

### partial

• `Optional` **partial**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:783](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L783)

---

### positional

• `Optional` **positional**: `boolean`

#### Defined in

[packages/core/src/core/usage-error.ts:761](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L761)

---

### synonyms

• `Optional` **synonyms**: `string`[]

#### Defined in

[packages/core/src/core/usage-error.ts:745](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L745)

---

### title

• `Optional` **title**: `string`

#### Defined in

[packages/core/src/core/usage-error.ts:780](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/core/usage-error.ts#L780)
