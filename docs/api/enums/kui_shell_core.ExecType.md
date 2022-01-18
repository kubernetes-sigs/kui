[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / ExecType

# Enumeration: ExecType

[@kui-shell/core](../modules/kui_shell_core.md).ExecType

"top-level", meaning the user hit enter in the CLI,
"click-handler", meaning that the user clicked on a UI element
"nested", meaning that some evaluator uses the repl in its internal implementation

## Table of contents

### Enumeration members

- [ClickHandler](kui_shell_core.ExecType.md#clickhandler)
- [Nested](kui_shell_core.ExecType.md#nested)
- [Rerun](kui_shell_core.ExecType.md#rerun)
- [TopLevel](kui_shell_core.ExecType.md#toplevel)

## Enumeration members

### ClickHandler

• **ClickHandler** = `1`

#### Defined in

[packages/core/src/models/command.ts:43](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L43)

---

### Nested

• **Nested** = `2`

#### Defined in

[packages/core/src/models/command.ts:44](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L44)

---

### Rerun

• **Rerun** = `3`

#### Defined in

[packages/core/src/models/command.ts:45](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L45)

---

### TopLevel

• **TopLevel** = `0`

#### Defined in

[packages/core/src/models/command.ts:42](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/command.ts#L42)
