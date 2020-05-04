# Colors, Icons, Component Libraries in Kui

Kui divides theming into three aspects:

- [Components](#components), such as breadcrumbs and tables.
- [Icons](#icons), such as a trash can icon.
- [Colors](#colors) of the component UI.

Kui strives to make these three orthogonal choices.

## Components

Kui employs a combination of home-grown React components and
components from third-party open source component frameworks. A
selection of the latter components are currently hosted by an SPI,
with support for [Carbon Components](https://www.carbondesignsystem.com) and (partially)
[PatternFly v4](https://www.patternfly.org/v4/). The remaining
third-party components in use are not yet SPI'd.

### How to Choose a Component Provider

Kui uses a [React Context](https://reactjs.org/docs/context.html) to
allow for a choice of component provider. Currently, Carbon Component
Library is the default choice. To inspect or modify this default,
consult
[DefaultKuiConfiguration](../plugins/plugin-client-common/src/components/Client/DefaultKuiConfiguration.ts).

To use Patternfly 4 Library in your client, either modify the default
in your fork, or add `components="patternfly"` to your use of the
`<Kui/>` client component. For example, the following code will set
Kui default client to use Patternfly 4 Library.

```typescript
import { Kui, KuiProps } from '@kui-shell/plugin-client-common'

export default function MyKui(props: KuiProps) {
  return (
    <Kui productName={productName} components="patternfly" {...props}>
      {children}
    </Kui>
  )
}
```

### SPI for Third Party Components

In this table "carbon" stands for Carbon Components, and "pf4" stands for PatternFly v4.

| Component  | Model                                                                         | Implemenatations                                                                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Breadcrumb | [spi](../plugins/plugin-client-common/src/components/spi/Breadcrumb/model.ts) | [carbon](../plugins/plugin-client-common/src/components/spi/Breadcrumb/impl/Carbon.tsx) **\|** [pf4](../plugins/plugin-client-common/src/components/spi/Breadcrumb/impl/PatternFly.tsx) |

## Work In Progress: Third Party Components Not Yet under an SPI

The following is a comprehensive list of the third party components
that are currently hard-wired to use Carbon Components:

- [Badge](../plugins/plugin-client-common/src/components/Views/Sidecar/Badge.tsx)
- [Code Snippet](../plugins/plugin-client-common/src/components/Content/Markdown.tsx)
- [Confirm](../plugins/plugin-client-common/src/components/Views/Confirm.tsx)
- [LeftNavSidecar Content](../plugins/plugin-client-common/src/components/Views/Sidecar/LeftNavSidecar.tsx)
- [Form](../plugins/plugin-kubectl/src/lib/view/modes/Form.tsx)
- [Navigation](../plugins/plugin-client-common/src/components/Views/Sidecar/Navigation/Carbon.tsx)
- [Loading](../plugins/plugin-client-common/src/components/Content/Loading.tsx)
- [Search](../plugins/plugin-client-common/src/components/Client/Search.tsx)
- [TabCompletion](../plugins/plugin-client-common/src/components/Views/Terminal/Block/TabCompletion.tsx)
- [Table](https://github.com/IBM/kui/tree/master/plugins/plugin-client-common/src/components/Content/Table)
- [Terminal Accordian](../plugins/plugin-client-common/src/components/Views/Terminal/ScrollableTerminal.tsx)
- [ToolbarButton's TooltipIcon](../plugins/plugin-client-common/src/components/Views/Sidecar/ToolbarButton.tsx)
- [TopNavSidecar Tabs](../plugins/plugin-client-common/src/components/Views/Sidecar/TopNavSidecar.tsx)
- [TopTabStribe](../plugins/plugin-client-common/src/components/Client/TopTabStripe/Tab.tsx)

The Navigation component currently also supports PatternFly v4
([here](../plugins/plugin-client-common/src/components/Views/Sidecar/Navigation/Patternfly.tsx)),
though is not yet structured under an SPI.

## Icons

Kui has an SPI for icons. You may add new icons or add support for a
new icon library by extending either the interface or the
implementations. The SPI definition is
[here](../plugins/plugin-client-common/src/components/spi/Icons/index.tsx). Under
the
[impl](../plugins/plugin-client-common/src/components/spi/Icons/impl)
subdirectory, you will find the current implementations. The SPI
delegate currently ties the choice of icon provider to the choice of
component provider.

## Colors

Coming soon.
