# Colors, Icons, Component Libraries in Kui

Kui divides theming into three aspects: colors, icons, and components.
FOr the latter two, Kui currently supports [Carbon Component
Library](https://www.carbondesignsystem.com) and (partially)
PatternFly v4, via React.

## Colors

TODO

## Components

## Carbon Components

The are fully supported in Kui for the following components:

- [Badge](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Sidecar/Badge.tsx)
- [Breadcrumb](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Breadcrumb/Carbon.tsx)
- [Code Snippet](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Content/Markdown.tsx)
- [Confirm](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Confirm.tsx)
- [LeftNavSidecar Content](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Sidecar/LeftNavSidecar.tsx)
- [Form](https://github.com/IBM/kui/blob/master/plugins/plugin-kubectl/src/lib/view/modes/Form.tsx)
- [Navigation](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Sidecar/Navigation/Carbon.tsx)
- [Loading](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Content/Loading.tsx)
- [Search](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Client/Search.tsx)
- [TabCompletion](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Terminal/Block/TabCompletion.tsx)
- [Table](https://github.com/IBM/kui/tree/master/plugins/plugin-client-common/src/components/Content/Table)
- [Terminal Accordian](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Terminal/ScrollableTerminal.tsx)
- [ToolbarButton's TooltipIcon](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Sidecar/ToolbarButton.tsx)
- [TopNavSidecar Tabs](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Sidecar/TopNavSidecar.tsx)
- [TopTabStribe](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Client/TopTabStripe/Tab.tsx)

Kui also prototypically supports [Patternfly 4 Libray](https://www.patternfly.org/v4/) for [Breadcrumb](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Breadcrumb/Patternfly.tsx) and [Navigation](https://github.com/IBM/kui/blob/master/plugins/plugin-client-common/src/components/Views/Sidecar/Navigation/Patternfly.tsx) components.

Kui uses [React Context](https://reactjs.org/docs/context.html) for choosing between the component libraries to use. Currently, Carbon Component Library is the default choice. To use Patternfly 4 Library in your client, you can add `components="patternfly"` to the `<Kui/>` client component. For example, the following code will set Kui default client to use Patternfly 4 Library.

plugins/plugin-client-default/src/index.tsx

```typescript
export default function renderMain(props: KuiProps) {
  return (
    <Kui productName={productName} components="patternfly" {...props}>
      {children}
    </Kui>
  )
}
```

## Icon SPI

Kui has an SPI for icons. You may add new icons or add support for a
new icon library by extending either the interface or the
implementations. The SPI definition is
[here](../plugins/plugin-client-common/src/components/spi/Icons/index.tsx). Under
the
[impl](../plugins/plugin-client-common/src/components/spi/Icons/impl)
subdirectory, you will find the current implementations. The SPI
delegate currently ties the choice of icon provider to the choice of
component provider.
