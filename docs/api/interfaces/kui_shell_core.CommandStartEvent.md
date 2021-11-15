[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / CommandStartEvent

# Interface: CommandStartEvent

[@kui-shell/core](../modules/kui_shell_core.md).CommandStartEvent

## Table of contents

### Properties

- [command](kui_shell_core.CommandStartEvent.md#command)
- [echo](kui_shell_core.CommandStartEvent.md#echo)
- [evaluatorOptions](kui_shell_core.CommandStartEvent.md#evaluatoroptions)
- [execOptions](kui_shell_core.CommandStartEvent.md#execoptions)
- [execType](kui_shell_core.CommandStartEvent.md#exectype)
- [execUUID](kui_shell_core.CommandStartEvent.md#execuuid)
- [pipeStages](kui_shell_core.CommandStartEvent.md#pipestages)
- [redirectDesired](kui_shell_core.CommandStartEvent.md#redirectdesired)
- [route](kui_shell_core.CommandStartEvent.md#route)
- [startTime](kui_shell_core.CommandStartEvent.md#starttime)
- [tab](kui_shell_core.CommandStartEvent.md#tab)

## Properties

### command

• **command**: `string`

#### Defined in

[packages/core/src/repl/events.ts:25](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L25)

---

### echo

• **echo**: `boolean`

#### Defined in

[packages/core/src/repl/events.ts:29](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L29)

---

### evaluatorOptions

• **evaluatorOptions**: [`CommandOptions`](kui_shell_core.CommandOptions.md)

#### Defined in

[packages/core/src/repl/events.ts:30](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L30)

---

### execOptions

• **execOptions**: [`ExecOptions`](kui_shell_core.ExecOptions.md)

#### Defined in

[packages/core/src/repl/events.ts:28](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L28)

---

### execType

• **execType**: [`ExecType`](../enums/kui_shell_core.ExecType.md)

#### Defined in

[packages/core/src/repl/events.ts:27](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L27)

---

### execUUID

• **execUUID**: `string`

#### Defined in

[packages/core/src/repl/events.ts:26](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L26)

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

[packages/core/src/repl/events.ts:31](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L31)

---

### redirectDesired

• **redirectDesired**: `boolean`

The output will be redirected to a file; do not display any live output

#### Defined in

[packages/core/src/repl/events.ts:34](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L34)

---

### route

• **route**: `string`

#### Defined in

[packages/core/src/repl/events.ts:24](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L24)

---

### startTime

• **startTime**: `number`

#### Defined in

[packages/core/src/repl/events.ts:23](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L23)

---

### tab

• **tab**: [`Tab`](kui_shell_core.Tab.md)

#### Defined in

[packages/core/src/repl/events.ts:22](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/repl/events.ts#L22)
