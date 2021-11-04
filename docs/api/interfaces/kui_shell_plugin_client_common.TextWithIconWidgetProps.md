[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / TextWithIconWidgetProps

# Interface: TextWithIconWidgetProps

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).TextWithIconWidgetProps

Component-specific Options

## Hierarchy

- [`TextWithIconWidgetOptions`](kui_shell_plugin_client_common.TextWithIconWidgetOptions.md)

  ↳ **`TextWithIconWidgetProps`**

## Table of contents

### Properties

- [className](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#classname)
- [iconIsNarrow](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#iconisnarrow)
- [iconOnclick](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#icononclick)
- [id](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#id)
- [popover](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#popover)
- [position](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#position)
- [text](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#text)
- [textOnclick](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#textonclick)
- [title](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#title)
- [viewLevel](kui_shell_plugin_client_common.TextWithIconWidgetProps.md#viewlevel)

## Properties

### className

• `Optional` **className**: `string`

#### Inherited from

[TextWithIconWidgetOptions](kui_shell_plugin_client_common.TextWithIconWidgetOptions.md).[className](kui_shell_plugin_client_common.TextWithIconWidgetOptions.md#classname)

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:28](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L28)

---

### iconIsNarrow

• `Optional` **iconIsNarrow**: `boolean`

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:40](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L40)

---

### iconOnclick

• `Optional` **iconOnclick**: `string` \| () => `void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:41](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L41)

---

### id

• `Optional` **id**: `string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:43](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L43)

---

### popover

• `Optional` **popover**: `Pick`<`Props`, `"headerContent"` \| `"bodyContent"`\> & `Partial`<`Props`\>

popover properties specified by client

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:46](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L46)

---

### position

• `Optional` **position**: `"bottom"` \| `"top-end"` \| `"top"` \| `"top-start"` \| `"left"` \| `"right"` \| `"auto"`

popover position override specified by container (not client)?

#### Inherited from

[TextWithIconWidgetOptions](kui_shell_plugin_client_common.TextWithIconWidgetOptions.md).[position](kui_shell_plugin_client_common.TextWithIconWidgetOptions.md#position)

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:31](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L31)

---

### text

• **text**: `string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:36](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L36)

---

### textOnclick

• `Optional` **textOnclick**: `string` \| () => `void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:42](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L42)

---

### title

• `Optional` **title**: `string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:39](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L39)

---

### viewLevel

• **viewLevel**: [`ViewLevel`](../modules/kui_shell_plugin_client_common.md#viewlevel)

#### Defined in

[plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx:37](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-client-common/src/components/Client/StatusStripe/TextWithIconWidget.tsx#L37)
