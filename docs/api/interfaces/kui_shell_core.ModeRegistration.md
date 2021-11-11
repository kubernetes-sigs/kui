[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / ModeRegistration

# Interface: ModeRegistration<Resource\>

[@kui-shell/core](../modules/kui_shell_core.md).ModeRegistration

Interpretation: if the resource passes the given "when" filter,
then add the given sidecar mode

## Type parameters

| Name       | Type                                                                     |
| :--------- | :----------------------------------------------------------------------- |
| `Resource` | extends [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md) |

## Table of contents

### Properties

- [mode](kui_shell_core.ModeRegistration.md#mode)
- [when](kui_shell_core.ModeRegistration.md#when)

## Properties

### mode

• **mode**: [`ModeDeclaration`](../modules/kui_shell_core.md#modedeclaration)<`Resource`\>

#### Defined in

[packages/core/src/webapp/views/registrar/modes.ts:40](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/views/registrar/modes.ts#L40)

---

### when

• **when**: [`ModeFilter`](../modules/kui_shell_core.md#modefilter)<`Resource`\>

#### Defined in

[packages/core/src/webapp/views/registrar/modes.ts:39](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/webapp/views/registrar/modes.ts#L39)
