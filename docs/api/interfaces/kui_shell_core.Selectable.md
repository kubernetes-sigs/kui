[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / Selectable

# Interface: Selectable

[@kui-shell/core](../modules/kui_shell_core.md).Selectable

## Table of contents

### Properties

- [onSelect](kui_shell_core.Selectable.md#onselect)
- [onSelectExec](kui_shell_core.Selectable.md#onselectexec)

## Properties

### onSelect

• **onSelect**: `string`

Handler for change of selection. This will be interpreted as a
Kui command line to be executed when the user clicks on the
corresponding row in the UI.

#### Defined in

[packages/core/src/models/RadioTable.ts:43](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/RadioTable.ts#L43)

---

### onSelectExec

• `Optional` **onSelectExec**: `"pexec"` \| `"qexec"`

#### Defined in

[packages/core/src/models/RadioTable.ts:44](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/models/RadioTable.ts#L44)
