[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / ExecOptions

# Interface: ExecOptions

[@kui-shell/core](../modules/kui_shell_core.md).ExecOptions

## Table of contents

### Properties

- [alreadyWatching](kui_shell_core.ExecOptions.md#alreadywatching)
- [block](kui_shell_core.ExecOptions.md#block)
- [container](kui_shell_core.ExecOptions.md#container)
- [contextChangeOK](kui_shell_core.ExecOptions.md#contextchangeok)
- [createErrorStream](kui_shell_core.ExecOptions.md#createerrorstream)
- [createOnly](kui_shell_core.ExecOptions.md#createonly)
- [createOutputStream](kui_shell_core.ExecOptions.md#createoutputstream)
- [credentials](kui_shell_core.ExecOptions.md#credentials)
- [custom](kui_shell_core.ExecOptions.md#custom)
- [cwd](kui_shell_core.ExecOptions.md#cwd)
- [data](kui_shell_core.ExecOptions.md#data)
- [delegationOk](kui_shell_core.ExecOptions.md#delegationok)
- [echo](kui_shell_core.ExecOptions.md#echo)
- [entity](kui_shell_core.ExecOptions.md#entity)
- [env](kui_shell_core.ExecOptions.md#env)
- [exec](kui_shell_core.ExecOptions.md#exec)
- [execUUID](kui_shell_core.ExecOptions.md#execuuid)
- [failWithUsage](kui_shell_core.ExecOptions.md#failwithusage)
- [filter](kui_shell_core.ExecOptions.md#filter)
- [history](kui_shell_core.ExecOptions.md#history)
- [insertIdx](kui_shell_core.ExecOptions.md#insertidx)
- [intentional](kui_shell_core.ExecOptions.md#intentional)
- [isDrilldown](kui_shell_core.ExecOptions.md#isdrilldown)
- [isProxied](kui_shell_core.ExecOptions.md#isproxied)
- [leaveBottomStripeAlone](kui_shell_core.ExecOptions.md#leavebottomstripealone)
- [nested](kui_shell_core.ExecOptions.md#nested)
- [nextBlock](kui_shell_core.ExecOptions.md#nextblock)
- [noCoreRedirect](kui_shell_core.ExecOptions.md#nocoreredirect)
- [noDelegation](kui_shell_core.ExecOptions.md#nodelegation)
- [noHeader](kui_shell_core.ExecOptions.md#noheader)
- [noHistory](kui_shell_core.ExecOptions.md#nohistory)
- [noRetry](kui_shell_core.ExecOptions.md#noretry)
- [noSidecarHeader](kui_shell_core.ExecOptions.md#nosidecarheader)
- [noStatus](kui_shell_core.ExecOptions.md#nostatus)
- [parameters](kui_shell_core.ExecOptions.md#parameters)
- [pip](kui_shell_core.ExecOptions.md#pip)
- [pipeStdin](kui_shell_core.ExecOptions.md#pipestdin)
- [placeholder](kui_shell_core.ExecOptions.md#placeholder)
- [preserveBackButton](kui_shell_core.ExecOptions.md#preservebackbutton)
- [quiet](kui_shell_core.ExecOptions.md#quiet)
- [raw](kui_shell_core.ExecOptions.md#raw)
- [rawResponse](kui_shell_core.ExecOptions.md#rawresponse)
- [render](kui_shell_core.ExecOptions.md#render)
- [replSilence](kui_shell_core.ExecOptions.md#replsilence)
- [reportErrors](kui_shell_core.ExecOptions.md#reporterrors)
- [rethrowErrors](kui_shell_core.ExecOptions.md#rethrowerrors)
- [showHeader](kui_shell_core.ExecOptions.md#showheader)
- [tab](kui_shell_core.ExecOptions.md#tab)
- [type](kui_shell_core.ExecOptions.md#type)
- [watch](kui_shell_core.ExecOptions.md#watch)

### Methods

- [onExit](kui_shell_core.ExecOptions.md#onexit)
- [onInit](kui_shell_core.ExecOptions.md#oninit)
- [onReady](kui_shell_core.ExecOptions.md#onready)
- [stderr](kui_shell_core.ExecOptions.md#stderr)
- [stdout](kui_shell_core.ExecOptions.md#stdout)

## Properties

### alreadyWatching

• `Optional` **alreadyWatching**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:89](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L89)

---

### block

• `Optional` **block**: [`Block`](kui_shell_core.Block.md)

#### Defined in

[packages/core/src/models/execOptions.ts:61](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L61)

---

### container

• `Optional` **container**: `Element`

#### Defined in

[packages/core/src/models/execOptions.ts:81](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L81)

---

### contextChangeOK

• `Optional` **contextChangeOK**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:55](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L55)

---

### createErrorStream

• `Optional` **createErrorStream**: `StreamableFactory`

#### Defined in

[packages/core/src/models/execOptions.ts:92](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L92)

---

### createOnly

• `Optional` **createOnly**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:83](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L83)

---

### createOutputStream

• `Optional` **createOutputStream**: `StreamableFactory`

#### Defined in

[packages/core/src/models/execOptions.ts:93](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L93)

---

### credentials

• `Optional` **credentials**: `Record`<`string`, `any`\>

#### Defined in

[packages/core/src/models/execOptions.ts:56](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L56)

---

### custom

• `Optional` **custom**: `any`

#### Defined in

[packages/core/src/models/execOptions.ts:58](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L58)

---

### cwd

• `Optional` **cwd**: `string`

cwd?

#### Defined in

[packages/core/src/models/execOptions.ts:40](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L40)

---

### data

• `Optional` **data**: `string` \| `number` \| `Buffer` \| `Record`<`string`, `any`\>

pass through uninterpreted data

#### Defined in

[packages/core/src/models/execOptions.ts:31](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L31)

---

### delegationOk

• `Optional` **delegationOk**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:50](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L50)

---

### echo

• `Optional` **echo**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:71](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L71)

---

### entity

• `Optional` **entity**: `any`

#### Defined in

[packages/core/src/models/execOptions.ts:108](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L108)

---

### env

• `Optional` **env**: `Record`<`string`, `string`\>

environment variable map

#### Defined in

[packages/core/src/models/execOptions.ts:43](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L43)

---

### exec

• `Optional` **exec**: `"pexec"` \| `"qexec"` \| `"rexec"`

#### Defined in

[packages/core/src/models/execOptions.ts:79](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L79)

---

### execUUID

• `Optional` **execUUID**: `string`

execution UUID

#### Defined in

[packages/core/src/models/execOptions.ts:28](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L28)

---

### failWithUsage

• `Optional` **failWithUsage**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:73](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L73)

---

### filter

• `Optional` **filter**: `any`

#### Defined in

[packages/core/src/models/execOptions.ts:54](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L54)

---

### history

• `Optional` **history**: `number`

#### Defined in

[packages/core/src/models/execOptions.ts:70](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L70)

---

### insertIdx

• `Optional` **insertIdx**: `number`

#### Defined in

[packages/core/src/models/execOptions.ts:90](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L90)

---

### intentional

• `Optional` **intentional**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:66](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L66)

---

### isDrilldown

• `Optional` **isDrilldown**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:60](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L60)

---

### isProxied

• `Optional` **isProxied**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:48](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L48)

---

### leaveBottomStripeAlone

• `Optional` **leaveBottomStripeAlone**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:52](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L52)

---

### nested

• `Optional` **nested**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:72](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L72)

---

### nextBlock

• `Optional` **nextBlock**: `HTMLElement`

#### Defined in

[packages/core/src/models/execOptions.ts:62](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L62)

---

### noCoreRedirect

• `Optional` **noCoreRedirect**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:68](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L68)

---

### noDelegation

• `Optional` **noDelegation**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:49](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L49)

---

### noHeader

• `Optional` **noHeader**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:84](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L84)

---

### noHistory

• `Optional` **noHistory**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:67](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L67)

---

### noRetry

• `Optional` **noRetry**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:87](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L87)

---

### noSidecarHeader

• `Optional` **noSidecarHeader**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:86](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L86)

---

### noStatus

• `Optional` **noStatus**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:85](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L85)

---

### parameters

• `Optional` **parameters**: `any`

#### Defined in

[packages/core/src/models/execOptions.ts:107](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L107)

---

### pip

• `Optional` **pip**: `Object`

#### Type declaration

| Name        | Type     |
| :---------- | :------- |
| `container` | `string` |
| `returnTo`  | `string` |

#### Defined in

[packages/core/src/models/execOptions.ts:69](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L69)

---

### pipeStdin

• `Optional` **pipeStdin**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:96](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L96)

---

### placeholder

• `Optional` **placeholder**: `string`

#### Defined in

[packages/core/src/models/execOptions.ts:63](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L63)

---

### preserveBackButton

• `Optional` **preserveBackButton**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:76](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L76)

---

### quiet

• `Optional` **quiet**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:65](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L65)

---

### raw

• `Optional` **raw**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:82](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L82)

---

### rawResponse

• `Optional` **rawResponse**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:59](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L59)

---

### render

• `Optional` **render**: `boolean`

true, if you wish a qexec to return rendered HTML; default is false, meaning you get the model back on qexec

#### Defined in

[packages/core/src/models/execOptions.ts:46](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L46)

---

### replSilence

• `Optional` **replSilence**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:64](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L64)

---

### reportErrors

• `Optional` **reportErrors**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:75](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L75)

---

### rethrowErrors

• `Optional` **rethrowErrors**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:74](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L74)

---

### showHeader

• `Optional` **showHeader**: `boolean`

#### Defined in

[packages/core/src/models/execOptions.ts:88](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L88)

---

### tab

• `Optional` **tab**: [`Tab`](kui_shell_core.Tab.md)

force execution in a given tab?

#### Defined in

[packages/core/src/models/execOptions.ts:25](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L25)

---

### type

• `Optional` **type**: [`ExecType`](../enums/kui_shell_core.ExecType.md)

#### Defined in

[packages/core/src/models/execOptions.ts:77](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L77)

---

### watch

• `Optional` **watch**: `Object`

pass watch state variables to subcommands being watched

#### Type declaration

| Name          | Type                       |
| :------------ | :------------------------- |
| `accumulator` | `Record`<`string`, `any`\> |
| `iteration`   | `number`                   |

#### Defined in

[packages/core/src/models/execOptions.ts:34](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L34)

## Methods

### onExit

▸ `Optional` **onExit**(`exitCode`): `void`

on job exit, pass the exitCode

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `exitCode` | `number` |

#### Returns

`void`

#### Defined in

[packages/core/src/models/execOptions.ts:105](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L105)

---

### onInit

▸ `Optional` **onInit**(`job`): [`Stream`](../modules/kui_shell_core.md#stream) \| `Promise`<[`Stream`](../modules/kui_shell_core.md#stream)\>

on job init, pass the job, and get back a stdout; i.e. just before the PTY is brought up

#### Parameters

| Name  | Type                                      |
| :---- | :---------------------------------------- |
| `job` | [`Job`](../modules/kui_shell_core.md#job) |

#### Returns

[`Stream`](../modules/kui_shell_core.md#stream) \| `Promise`<[`Stream`](../modules/kui_shell_core.md#stream)\>

#### Defined in

[packages/core/src/models/execOptions.ts:99](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L99)

---

### onReady

▸ `Optional` **onReady**(`job`): `void` \| `Promise`<`void`\>

on job ready, i.e. after the PTY is up, but before any data has been processed

#### Parameters

| Name  | Type                                      |
| :---- | :---------------------------------------- |
| `job` | [`Job`](../modules/kui_shell_core.md#job) |

#### Returns

`void` \| `Promise`<`void`\>

#### Defined in

[packages/core/src/models/execOptions.ts:102](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L102)

---

### stderr

▸ `Optional` **stderr**(`str`): `any`

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `str` | `string` |

#### Returns

`any`

#### Defined in

[packages/core/src/models/execOptions.ts:95](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L95)

---

### stdout

▸ `Optional` **stdout**(`str`): `any`

#### Parameters

| Name  | Type                                                    |
| :---- | :------------------------------------------------------ |
| `str` | [`Streamable`](../modules/kui_shell_core.md#streamable) |

#### Returns

`any`

#### Defined in

[packages/core/src/models/execOptions.ts:94](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/execOptions.ts#L94)
