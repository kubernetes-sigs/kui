[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / CommandLine

# Interface: CommandLine<Options\>

[@kui-shell/core](../modules/kui_shell_core.md).CommandLine

This information represents a command line, but split out in
various useful ways.

## Type parameters

| Name      | Type                                               |
| :-------- | :------------------------------------------------- |
| `Options` | [`ParsedOptions`](kui_shell_core.ParsedOptions.md) |

## Hierarchy

- **`CommandLine`**

  ↳ [`Arguments`](kui_shell_core.Arguments.md)

## Table of contents

### Properties

- [argv](kui_shell_core.CommandLine.md#argv)
- [argvNoOptions](kui_shell_core.CommandLine.md#argvnooptions)
- [command](kui_shell_core.CommandLine.md#command)
- [parsedOptions](kui_shell_core.CommandLine.md#parsedoptions)
- [pipeStages](kui_shell_core.CommandLine.md#pipestages)

## Properties

### argv

• **argv**: `string`[]

the result of a whitespace split applied to the `command` string
that pays attention to backslash escaping and quotations

#### Defined in

[packages/core/src/models/command.ts:146](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L146)

---

### argvNoOptions

• **argvNoOptions**: `string`[]

the residual of `argv` without `parsedOptions`

#### Defined in

[packages/core/src/models/command.ts:151](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L151)

---

### command

• **command**: `string`

the raw command string, as given by the user

#### Defined in

[packages/core/src/models/command.ts:141](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L141)

---

### parsedOptions

• **parsedOptions**: `Options`

the dash options parsed out in a way that pays attention to n-ary
options such as `--option key value`

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

#### Defined in

[packages/core/src/models/command.ts:156](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L156)
