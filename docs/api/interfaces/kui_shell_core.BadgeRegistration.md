[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / BadgeRegistration

# Interface: BadgeRegistration<Resource\>

[@kui-shell/core](../modules/kui_shell_core.md).BadgeRegistration

Interpretation: if the resource passes the given "when" filter,
then add the given sidecar badge

## Type parameters

| Name       | Type                                                                     |
| :--------- | :----------------------------------------------------------------------- |
| `Resource` | extends [`ResourceWithMetadata`](kui_shell_core.ResourceWithMetadata.md) |

## Table of contents

### Properties

- [badge](kui_shell_core.BadgeRegistration.md#badge)
- [when](kui_shell_core.BadgeRegistration.md#when)

## Properties

### badge

• **badge**: [`BadgeSpec`](kui_shell_core.BadgeSpec.md) \| (`resource`: `Resource`, `tab`: [`Tab`](kui_shell_core.Tab.md)) => [`BadgeSpec`](kui_shell_core.BadgeSpec.md)

#### Defined in

[packages/core/src/webapp/views/registrar/badges.ts:44](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/webapp/views/registrar/badges.ts#L44)

---

### when

• **when**: [`ModeFilter`](../modules/kui_shell_core.md#modefilter)<`Resource`\>

#### Defined in

[packages/core/src/webapp/views/registrar/badges.ts:43](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/webapp/views/registrar/badges.ts#L43)
