[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / [Events](../modules/kui_shell_core.Events.md) / NewTabRequestEvent

# Interface: NewTabRequestEvent

[@kui-shell/core](../modules/kui_shell_core.md).[Events](../modules/kui_shell_core.Events.md).NewTabRequestEvent

## Table of contents

### Properties

- [background](kui_shell_core.Events.NewTabRequestEvent.md#background)
- [tabs](kui_shell_core.Events.NewTabRequestEvent.md#tabs)

## Properties

### background

• `Optional` **background**: `boolean`

Optionally specify to create the new tab without switching to it

#### Defined in

[packages/core/src/core/events.ts:61](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L61)

---

### tabs

• **tabs**: { `cmdline?`: `string` ; `exec?`: `"pexec"` \| `"qexec"` ; `onClose?`: `string` ; `statusStripeDecoration?`: [`StatusStripeChangeEvent`](../modules/kui_shell_core.Events.md#statusstripechangeevent) ; `title?`: `string` }[]

#### Defined in

[packages/core/src/core/events.ts:63](https://github.com/kubernetes-sigs/kui/blob/kui/packages/core/src/core/events.ts#L63)
