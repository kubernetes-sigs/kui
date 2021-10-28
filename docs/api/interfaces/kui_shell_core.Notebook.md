[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / Notebook

# Interface: Notebook

[@kui-shell/core](../modules/kui_shell_core.md).Notebook

## Table of contents

### Properties

- [apiVersion](kui_shell_core.Notebook.md#apiversion)
- [kind](kui_shell_core.Notebook.md#kind)
- [metadata](kui_shell_core.Notebook.md#metadata)

## Properties

### apiVersion

• **apiVersion**: `"kui-shell/v1"`

#### Defined in

[packages/core/src/repl/events.ts:73](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/repl/events.ts#L73)

---

### kind

• **kind**: `"Notebook"`

#### Defined in

[packages/core/src/repl/events.ts:74](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/repl/events.ts#L74)

---

### metadata

• `Optional` **metadata**: `Object`

#### Type declaration

| Name               | Type      |
| :----------------- | :-------- |
| `description?`     | `string`  |
| `name?`            | `string`  |
| `preferReExecute?` | `boolean` |

#### Defined in

[packages/core/src/repl/events.ts:75](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/packages/core/src/repl/events.ts#L75)
