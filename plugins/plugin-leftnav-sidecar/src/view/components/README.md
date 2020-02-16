# Kui Sidecar View Components

This plugin offers two ways to present sidecar information: either
with left-hand navigation or top-tab navigation. In either case, the
views are framed with a `<TitleBar/>`, and the content of each tab is
rendered by `<KuiContent/>`.

In the case of top-tab navigation, the view is further composed of a
header region and `<Toolbar/>` region. The ASCII art below is an
attempt to illustrate the nesting structure of the components.

- [LeftNavSidecar](#LeftNavSidecar)
- [TopNavSidecar](#TopNavSidecar)
- [TitleBar](#TitleBar)

## Sidecar Views

### LeftNavSidecar

```
/**
 *
 * LeftNavSidecar
 * -------------------------
 * | <TitleBar/>           |
 * -------------------------
 * | A1   |                |
 * |  a1  | <Content>      |
 * |  a2  |  <KuiContent/> |
 * | B1   | </Content>     |
 * |  b1  |                |
 * |  b2  |                |
 * -------------------------
 *  ^^^^^ <SideNav/>
 *   A1, B1: <SideNavMenu/>
 *   a1, b1: <SideNavMenuItem/>
 *
 */
```

### TopNavSidecar

```
/**
 *
 * TopNavSidecar
 * -----------------------
 * | <TitleBar/>         |
 * -----------------------
 * | nameHash?           |
 * | name                |
 * |---------------------|
 * | Tab | Tab |  ...    | <Tab/> from here down
 * |---------------------|
 * | <Toolbar/>          |   <ToolbarContainer/> from here down
 * |---------------------|
 * | <KuiContent/>       |
 * |                     |
 * -----------------------
 *
 */
```

## TitleBar

```
/**
 * TitleBar
 * ---------------------------------
 * | Kind | Namespace    S | M m x |
 * ---------------------------------
 *  S: Screenshot button
 *  M: Maximize/Restore button [!props.fixedWith]
 *  m: Minimize button [!props.fixedWith]
 *  x: Close button
 *
 *  Kind: props.kind
 *  Namespace: props.namespace
 */
```
