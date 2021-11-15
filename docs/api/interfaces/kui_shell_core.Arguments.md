[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / Arguments

# Interface: Arguments<Options\>

[@kui-shell/core](../modules/kui_shell_core.md).Arguments

The full set of data passed to a command handler

## Type parameters

| Name      | Type                                               |
| :-------- | :------------------------------------------------- |
| `Options` | [`ParsedOptions`](kui_shell_core.ParsedOptions.md) |

## Hierarchy

- [`CommandLine`](kui_shell_core.CommandLine.md)<`Options`\>

  ↳ **`Arguments`**

## Table of contents

### Properties

- [REPL](kui_shell_core.Arguments.md#repl)
- [argv](kui_shell_core.Arguments.md#argv)
- [argvNoOptions](kui_shell_core.Arguments.md#argvnooptions)
- [block](kui_shell_core.Arguments.md#block)
- [command](kui_shell_core.Arguments.md#command)
- [createErrorStream](kui_shell_core.Arguments.md#createerrorstream)
- [createOutputStream](kui_shell_core.Arguments.md#createoutputstream)
- [execOptions](kui_shell_core.Arguments.md#execoptions)
- [nextBlock](kui_shell_core.Arguments.md#nextblock)
- [parsedOptions](kui_shell_core.Arguments.md#parsedoptions)
- [pipeStages](kui_shell_core.Arguments.md#pipestages)
- [tab](kui_shell_core.Arguments.md#tab)

## Properties

### REPL

• **REPL**: [`REPL`](kui_shell_core.REPL.md)

#### Defined in

[packages/core/src/models/command.ts:180](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L180)

---

### argv

• **argv**: `string`[]

the result of a whitespace split applied to the `command` string
that pays attention to backslash escaping and quotations

#### Inherited from

[CommandLine](kui_shell_core.CommandLine.md).[argv](kui_shell_core.CommandLine.md#argv)

#### Defined in

[packages/core/src/models/command.ts:146](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L146)

---

### argvNoOptions

• **argvNoOptions**: `string`[]

the residual of `argv` without `parsedOptions`

#### Inherited from

[CommandLine](kui_shell_core.CommandLine.md).[argvNoOptions](kui_shell_core.CommandLine.md#argvnooptions)

#### Defined in

[packages/core/src/models/command.ts:151](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L151)

---

### block

• **block**: `boolean` \| [`Block`](kui_shell_core.Block.md)

EXPERT MODE: The REPL block in which this command was initiated
(rarely used, but useful for more complex UI extensions)

#### Defined in

[packages/core/src/models/command.ts:204](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L204)

---

### command

• **command**: `string`

the raw command string, as given by the user

#### Inherited from

[CommandLine](kui_shell_core.CommandLine.md).[command](kui_shell_core.CommandLine.md#command)

#### Defined in

[packages/core/src/models/command.ts:141](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L141)

---

### createErrorStream

• **createErrorStream**: `StreamableFactory`

Same as createOutputStream, but for stderr

#### Defined in

[packages/core/src/models/command.ts:198](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L198)

---

### createOutputStream

• **createOutputStream**: `StreamableFactory`

Commands can use this to stream output to the UI, rather than
using the normal request-response interaction between the REPL
and the command.

#### Defined in

[packages/core/src/models/command.ts:193](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L193)

---

### execOptions

• **execOptions**: [`ExecOptions`](kui_shell_core.ExecOptions.md)

Optional command channel options that one command can use to
influence the execution of another.

#### Defined in

[packages/core/src/models/command.ts:186](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L186)

---

### nextBlock

• **nextBlock**: `HTMLElement`

EXPERT MODE: The REPL block that will house the _subsequent_
command execution (rarely used, but useful for more complex UI
extensions)

#### Defined in

[packages/core/src/models/command.ts:211](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L211)

---

### parsedOptions

• **parsedOptions**: `Options`

the dash options parsed out in a way that pays attention to n-ary
options such as `--option key value`

#### Inherited from

[CommandLine](kui_shell_core.CommandLine.md).[parsedOptions](kui_shell_core.CommandLine.md#parsedoptions)

#### Defined in

[packages/core/src/models/command.ts:167](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L167)

---

### pipeStages

• **pipeStages**: `Object`

pipeline stages, e.g. if command='a b --foo|c', the pipeStages=[['a','b, '--foo'],'c']

#### Type declaration

| Name          | Type                                             |
| :------------ | :----------------------------------------------- |
| `prefix?`     | `string`                                         |
| `redirect?`   | `string`                                         |
| `redirector?` | `">"` \| `">>"` \| `"2>&1"` \| `">&"` \| `">>&"` |
| `stages`      | `string`[][]                                     |

#### Inherited from

[CommandLine](kui_shell_core.CommandLine.md).[pipeStages](kui_shell_core.CommandLine.md#pipestages)

#### Defined in

[packages/core/src/models/command.ts:156](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L156)

---

### tab

• **tab**: [`Tab`](kui_shell_core.Tab.md)

The tab context in which the command was initiated

#### Defined in

[packages/core/src/models/command.ts:178](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L178)
