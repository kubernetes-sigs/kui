[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / CommandCompleteEvent

# Interface: CommandCompleteEvent<R, T\>

[@kui-shell/core](../modules/kui_shell_core.md).CommandCompleteEvent

## Type parameters

| Name | Type                                                                                                               |
| :--- | :----------------------------------------------------------------------------------------------------------------- |
| `R`  | extends [`KResponse`](../modules/kui_shell_core.md#kresponse)[`KResponse`](../modules/kui_shell_core.md#kresponse) |
| `T`  | extends ` ResponseType``ResponseType `                                                                             |

## Table of contents

### Properties

- [argvNoOptions](kui_shell_core.CommandCompleteEvent.md#argvnooptions)
- [cancelled](kui_shell_core.CommandCompleteEvent.md#cancelled)
- [command](kui_shell_core.CommandCompleteEvent.md#command)
- [completeTime](kui_shell_core.CommandCompleteEvent.md#completetime)
- [echo](kui_shell_core.CommandCompleteEvent.md#echo)
- [evaluatorOptions](kui_shell_core.CommandCompleteEvent.md#evaluatoroptions)
- [execOptions](kui_shell_core.CommandCompleteEvent.md#execoptions)
- [execType](kui_shell_core.CommandCompleteEvent.md#exectype)
- [execUUID](kui_shell_core.CommandCompleteEvent.md#execuuid)
- [historyIdx](kui_shell_core.CommandCompleteEvent.md#historyidx)
- [parsedOptions](kui_shell_core.CommandCompleteEvent.md#parsedoptions)
- [pipeStages](kui_shell_core.CommandCompleteEvent.md#pipestages)
- [response](kui_shell_core.CommandCompleteEvent.md#response)
- [responseType](kui_shell_core.CommandCompleteEvent.md#responsetype)
- [tab](kui_shell_core.CommandCompleteEvent.md#tab)

## Properties

### argvNoOptions

• **argvNoOptions**: `string`[]

#### Defined in

[packages/core/src/repl/events.ts:44](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L44)

---

### cancelled

• **cancelled**: `boolean`

#### Defined in

[packages/core/src/repl/events.ts:51](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L51)

---

### command

• **command**: `string`

#### Defined in

[packages/core/src/repl/events.ts:43](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L43)

---

### completeTime

• **completeTime**: `number`

#### Defined in

[packages/core/src/repl/events.ts:42](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L42)

---

### echo

• **echo**: `boolean`

#### Defined in

[packages/core/src/repl/events.ts:52](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L52)

---

### evaluatorOptions

• **evaluatorOptions**: [`CommandOptions`](kui_shell_core.CommandOptions.md)

#### Defined in

[packages/core/src/repl/events.ts:53](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L53)

---

### execOptions

• **execOptions**: [`ExecOptions`](kui_shell_core.ExecOptions.md)

#### Defined in

[packages/core/src/repl/events.ts:46](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L46)

---

### execType

• **execType**: [`ExecType`](../enums/kui_shell_core.ExecType.md)

#### Defined in

[packages/core/src/repl/events.ts:50](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L50)

---

### execUUID

• **execUUID**: `string`

#### Defined in

[packages/core/src/repl/events.ts:49](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L49)

---

### historyIdx

• **historyIdx**: `number`

#### Defined in

[packages/core/src/repl/events.ts:58](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L58)

---

### parsedOptions

• **parsedOptions**: [`ParsedOptions`](kui_shell_core.ParsedOptions.md)

#### Defined in

[packages/core/src/repl/events.ts:45](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L45)

---

### pipeStages

• **pipeStages**: `Object`

#### Type declaration

| Name          | Type                                             |
| :------------ | :----------------------------------------------- |
| `prefix?`     | `string`                                         |
| `redirect?`   | `string`                                         |
| `redirector?` | `">"` \| `">>"` \| `"2>&1"` \| `">&"` \| `">>&"` |
| `stages`      | `string`[][]                                     |

#### Defined in

[packages/core/src/repl/events.ts:47](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L47)

---

### response

• **response**: `R`

#### Defined in

[packages/core/src/repl/events.ts:55](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L55)

---

### responseType

• **responseType**: `T`

#### Defined in

[packages/core/src/repl/events.ts:56](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L56)

---

### tab

• **tab**: [`Tab`](kui_shell_core.Tab.md)

#### Defined in

[packages/core/src/repl/events.ts:40](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/repl/events.ts#L40)
