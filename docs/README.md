# User Guide

If you have downloaded one of the [pre-built Electron
releases](https://github.com/IBM/kui#installation), double click to
launch Kui. From there, you can use Kui as a normal terminal, with
graphical enhancements. For example, try `kubectl -h`, and you can see
how Kui enhances the help system of `kubectl`.

## Using Kui as a kubectl plugin

You may also use this prebuilt image as a `kubectl` plugin. After
downloading and unpacking Kui, add the unpacked directory to your
PATH. You should now be able to launch Kui from your favorite
terminal. For example, to list your Kubernetes pods:

```sh
kubectl kui get pods
```

Kui also includes graphical enhancements for
[krew](https://github.com/kubernetes-sigs/krew), the Kubernetes plugin
manager: the `krew list`, and `krew info` commands, for example. If
you wish to contribute there, first consult the Developer Guide. Then,
check out the source to the existing krew enhancements, which are
located
[here](https://github.com/IBM/kui/tree/master/plugins/plugin-kubectl/krew).

# Developer Guide

We welcome your contributions! The Kui developer guide is currently
located on the [wiki](https://github.com/IBM/kui/wiki).

## React Component Libraries

Kui uses React Component Libraries to help rendering certain classes of componenets. [Carbon Component Library](https://www.carbondesignsystem.com) are fully supported in Kui for the following components:

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
