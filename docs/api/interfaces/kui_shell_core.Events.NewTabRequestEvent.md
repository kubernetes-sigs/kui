[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/core](../modules/kui_shell_core.md) / [Events](../modules/kui_shell_core.Events.md) / NewTabRequestEvent

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

[packages/core/src/core/events.ts:65](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/events.ts#L65)

---

### tabs

• **tabs**: { `cmdline?`: `string` ; `exec?`: `"pexec"` \| `"qexec"` ; `onClose?`: `string` ; `replaceCurrentTab?`: `boolean` ; `snapshot?`: `Buffer` ; `statusStripeDecoration?`: [`StatusStripeChangeEvent`](../modules/kui_shell_core.Events.md#statusstripechangeevent) ; `title?`: `string` }[]

#### Defined in

[packages/core/src/core/events.ts:67](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/core/src/core/events.ts#L67)
