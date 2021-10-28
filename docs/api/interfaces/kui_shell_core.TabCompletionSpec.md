[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / TabCompletionSpec

# Interface: TabCompletionSpec

[@kui-shell/core](../modules/kui_shell_core.md).TabCompletionSpec

A registrar for enumerators

## Table of contents

### Properties

- [toBeCompleted](kui_shell_core.TabCompletionSpec.md#tobecompleted)
- [toBeCompletedIdx](kui_shell_core.TabCompletionSpec.md#tobecompletedidx)

## Properties

### toBeCompleted

• **toBeCompleted**: `string`

The prefix of the to-be-completed parameter that has been typed
so far.

#### Defined in

[packages/core/src/repl/tab-completion.ts:29](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/repl/tab-completion.ts#L29)

---

### toBeCompletedIdx

• **toBeCompletedIdx**: `number`

An index into CommandLine.argv, or -1 if it is the trailing
argument that is to be completed.

#### Defined in

[packages/core/src/repl/tab-completion.ts:35](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/repl/tab-completion.ts#L35)
