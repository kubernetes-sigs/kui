[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / Kui

# Class: Kui

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).Kui

Render the main body of our client.

|Notes on Session Initialization|: to provide custom views for
session initialization (only relevant for browser-based hosted
Kui), you can instantiate <Kui/> with these properties (defined in
KuiConfiguration), show here with some sample views:

<Kui
loading={<div className="kui--hero-text">Hold on...</div>}
reinit={<div className="kui--hero-text">Connection broken...</div>}
loadingError={err => <div className="kui--hero-text">{err.toString()}</div>}
loadingDone={<div>Welcome to Kui</div>}
/>

## Hierarchy

- `PureComponent`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops), `State`\>

  ↳ **`Kui`**

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_client_common.Kui.md#constructor)

### Properties

- [\_onTabReady](kui_shell_plugin_client_common.Kui.md#_ontabready)
- [context](kui_shell_plugin_client_common.Kui.md#context)
- [firstTab](kui_shell_plugin_client_common.Kui.md#firsttab)
- [props](kui_shell_plugin_client_common.Kui.md#props)
- [refs](kui_shell_plugin_client_common.Kui.md#refs)
- [state](kui_shell_plugin_client_common.Kui.md#state)
- [contextType](kui_shell_plugin_client_common.Kui.md#contexttype)

### Methods

- [UNSAFE_componentWillMount](kui_shell_plugin_client_common.Kui.md#unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](kui_shell_plugin_client_common.Kui.md#unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](kui_shell_plugin_client_common.Kui.md#unsafe_componentwillupdate)
- [componentDidCatch](kui_shell_plugin_client_common.Kui.md#componentdidcatch)
- [componentDidMount](kui_shell_plugin_client_common.Kui.md#componentdidmount)
- [componentDidUpdate](kui_shell_plugin_client_common.Kui.md#componentdidupdate)
- [componentWillMount](kui_shell_plugin_client_common.Kui.md#componentwillmount)
- [componentWillReceiveProps](kui_shell_plugin_client_common.Kui.md#componentwillreceiveprops)
- [componentWillUnmount](kui_shell_plugin_client_common.Kui.md#componentwillunmount)
- [componentWillUpdate](kui_shell_plugin_client_common.Kui.md#componentwillupdate)
- [defaultFeatureFlag](kui_shell_plugin_client_common.Kui.md#defaultfeatureflag)
- [defaultLoading](kui_shell_plugin_client_common.Kui.md#defaultloading)
- [defaultLoadingDone](kui_shell_plugin_client_common.Kui.md#defaultloadingdone)
- [defaultLoadingError](kui_shell_plugin_client_common.Kui.md#defaultloadingerror)
- [defaultReinit](kui_shell_plugin_client_common.Kui.md#defaultreinit)
- [defaultSessionBehavior](kui_shell_plugin_client_common.Kui.md#defaultsessionbehavior)
- [forceUpdate](kui_shell_plugin_client_common.Kui.md#forceupdate)
- [getSnapshotBeforeUpdate](kui_shell_plugin_client_common.Kui.md#getsnapshotbeforeupdate)
- [onTabReady](kui_shell_plugin_client_common.Kui.md#ontabready)
- [onThemeChange](kui_shell_plugin_client_common.Kui.md#onthemechange)
- [render](kui_shell_plugin_client_common.Kui.md#render)
- [setState](kui_shell_plugin_client_common.Kui.md#setstate)
- [shouldComponentUpdate](kui_shell_plugin_client_common.Kui.md#shouldcomponentupdate)
- [statusStripeProps](kui_shell_plugin_client_common.Kui.md#statusstripeprops)

## Constructors

### constructor

• **new Kui**(`props`)

#### Parameters

| Name    | Type                                                                |
| :------ | :------------------------------------------------------------------ |
| `props` | [`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops) |

#### Overrides

React.PureComponent&lt;Props, State\&gt;.constructor

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:85](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L85)

## Properties

### \_onTabReady

• `Private` `Readonly` **\_onTabReady**: `any`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:271](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L271)

---

### context

• **context**: `any`

If using the new style context, re-declare this in your class to be the
`React.ContextType` of your `static contextType`.
Should be used with type annotation or static contextType.

```ts
static contextType = MyContext
// For TS pre-3.7:
context!: React.ContextType<typeof MyContext>
// For TS 3.7 and above:
declare context: React.ContextType<typeof MyContext>
```

**`see`** https://reactjs.org/docs/context.html

#### Inherited from

React.PureComponent.context

#### Defined in

node_modules/@types/react/index.d.ts:473

---

### firstTab

• `Private` **firstTab**: `boolean` = `true`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:258](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L258)

---

### props

• `Readonly` **props**: `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\> & `Readonly`<`Object`\>

#### Inherited from

React.PureComponent.props

#### Defined in

node_modules/@types/react/index.d.ts:498

---

### refs

• **refs**: `Object`

**`deprecated`**
https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs

#### Index signature

▪ [key: `string`]: `ReactInstance`

#### Inherited from

React.PureComponent.refs

#### Defined in

node_modules/@types/react/index.d.ts:504

---

### state

• **state**: `Readonly`<`State`\>

#### Inherited from

React.PureComponent.state

#### Defined in

node_modules/@types/react/index.d.ts:499

---

### contextType

▪ `Static` `Optional` **contextType**: `Context`<`any`\>

If set, `this.context` will be set at runtime to the current value of the given Context.

Usage:

```ts
type MyContext = number
const Ctx = React.createContext<MyContext>(0)

class Foo extends React.Component {
  static contextType = Ctx
  context!: React.ContextType<typeof Ctx>
  render() {
    return <>My context's value: {this.context}</>
  }
}
```

**`see`** https://reactjs.org/docs/context.html#classcontexttype

#### Inherited from

React.PureComponent.contextType

#### Defined in

node_modules/@types/react/index.d.ts:455

## Methods

### UNSAFE_componentWillMount

▸ `Optional` **UNSAFE_componentWillMount**(): `void`

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE_componentWillMount

#### Defined in

node_modules/@types/react/index.d.ts:711

---

### UNSAFE_componentWillReceiveProps

▸ `Optional` **UNSAFE_componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name          | Type                                                                             |
| :------------ | :------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\> |
| `nextContext` | `any`                                                                            |

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE_componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:743

---

### UNSAFE_componentWillUpdate

▸ `Optional` **UNSAFE_componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

This method will not stop working in React 17.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name          | Type                                                                             |
| :------------ | :------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\> |
| `nextState`   | `Readonly`<`State`\>                                                             |
| `nextContext` | `any`                                                                            |

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE_componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:771

---

### componentDidCatch

▸ **componentDidCatch**(`error`, `errorInfo`): `void`

#### Parameters

| Name        | Type        |
| :---------- | :---------- |
| `error`     | `Error`     |
| `errorInfo` | `ErrorInfo` |

#### Returns

`void`

#### Overrides

React.PureComponent.componentDidCatch

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:254](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L254)

---

### componentDidMount

▸ `Optional` **componentDidMount**(): `void`

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

#### Returns

`void`

#### Inherited from

React.PureComponent.componentDidMount

#### Defined in

node_modules/@types/react/index.d.ts:619

---

### componentDidUpdate

▸ `Optional` **componentDidUpdate**(`prevProps`, `prevState`, `snapshot?`): `void`

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

#### Parameters

| Name        | Type                                                                             |
| :---------- | :------------------------------------------------------------------------------- |
| `prevProps` | `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\> |
| `prevState` | `Readonly`<`State`\>                                                             |
| `snapshot?` | `any`                                                                            |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentDidUpdate

#### Defined in

node_modules/@types/react/index.d.ts:682

---

### componentWillMount

▸ `Optional` **componentWillMount**(): `void`

Called immediately before mounting occurs, and before `Component#render`.
Avoid introducing any side-effects or subscriptions in this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use componentDidMount or the constructor instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#initializing-state

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillMount

#### Defined in

node_modules/@types/react/index.d.ts:697

---

### componentWillReceiveProps

▸ `Optional` **componentWillReceiveProps**(`nextProps`, `nextContext`): `void`

Called when the component may be receiving new props.
React may call this even if props have not changed, so be sure to compare new and existing
props if you only want to handle changes.

Calling `Component#setState` generally does not trigger this method.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use static getDerivedStateFromProps instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name          | Type                                                                             |
| :------------ | :------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\> |
| `nextContext` | `any`                                                                            |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:726

---

### componentWillUnmount

▸ `Optional` **componentWillUnmount**(): `void`

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillUnmount

#### Defined in

node_modules/@types/react/index.d.ts:635

---

### componentWillUpdate

▸ `Optional` **componentWillUpdate**(`nextProps`, `nextState`, `nextContext`): `void`

Called immediately before rendering when new props or state is received. Not called for the initial render.

Note: You cannot call `Component#setState` here.

Note: the presence of getSnapshotBeforeUpdate or getDerivedStateFromProps
prevents this from being invoked.

**`deprecated`** 16.3, use getSnapshotBeforeUpdate instead; will stop working in React 17

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#reading-dom-properties-before-an-update

**`see`** https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#gradual-migration-path

#### Parameters

| Name          | Type                                                                             |
| :------------ | :------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\> |
| `nextState`   | `Readonly`<`State`\>                                                             |
| `nextContext` | `any`                                                                            |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:756

---

### defaultFeatureFlag

▸ `Private` **defaultFeatureFlag**(): `Object`

#### Returns

`Object`

| Name             | Type     |
| :--------------- | :------- |
| `showWelcomeMax` | `number` |
| `sidecarName`    | `string` |

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:162](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L162)

---

### defaultLoading

▸ `Private` **defaultLoading**(): `Element`

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:169](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L169)

---

### defaultLoadingDone

▸ `Private` **defaultLoadingDone**(): (`repl`: `default`) => `Element`

#### Returns

`fn`

▸ (`repl`): `Element`

##### Parameters

| Name   | Type      |
| :----- | :-------- |
| `repl` | `default` |

##### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:189](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L189)

---

### defaultLoadingError

▸ `Private` **defaultLoadingError**(): (`err`: `any`) => `Element`

#### Returns

`fn`

▸ (`err`): `Element`

##### Parameters

| Name  | Type  |
| :---- | :---- |
| `err` | `any` |

##### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:193](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L193)

---

### defaultReinit

▸ `Private` **defaultReinit**(): `Element`

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:175](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L175)

---

### defaultSessionBehavior

▸ `Private` **defaultSessionBehavior**(): `KuiConfiguration`

For browser-based clients, this defines the default UI for
session initialization.

#### Returns

`KuiConfiguration`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:207](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L207)

---

### forceUpdate

▸ **forceUpdate**(`callback?`): `void`

#### Parameters

| Name        | Type         |
| :---------- | :----------- |
| `callback?` | () => `void` |

#### Returns

`void`

#### Inherited from

React.PureComponent.forceUpdate

#### Defined in

node_modules/@types/react/index.d.ts:490

---

### getSnapshotBeforeUpdate

▸ `Optional` **getSnapshotBeforeUpdate**(`prevProps`, `prevState`): `any`

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

#### Parameters

| Name        | Type                                                                             |
| :---------- | :------------------------------------------------------------------------------- |
| `prevProps` | `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\> |
| `prevState` | `Readonly`<`State`\>                                                             |

#### Returns

`any`

#### Inherited from

React.PureComponent.getSnapshotBeforeUpdate

#### Defined in

node_modules/@types/react/index.d.ts:676

---

### onTabReady

▸ `Private` **onTabReady**(): `void`

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:259](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L259)

---

### onThemeChange

▸ `Private` **onThemeChange**(`__namedParameters`): `void`

#### Parameters

| Name                           | Type     |
| :----------------------------- | :------- |
| `__namedParameters`            | `Object` |
| `__namedParameters.themeModel` | `Theme`  |

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:221](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L221)

---

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

React.PureComponent.render

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:273](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L273)

---

### setState

▸ **setState**<`K`\>(`state`, `callback?`): `void`

#### Type parameters

| Name | Type                                                                                                                                                                                                                                |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `K`  | extends keyof `ThemeProperties` \| keyof `InputProps` \| keyof `SessionProps` \| `"productName"` \| keyof `FeatureFlags` \| `"_for_testing_"` \| `"userOverrides"` \| `"isBootstrapped"` \| `"commandLine"` \| `"quietExecCommand"` |

#### Parameters

| Name        | Type                                                                                                                                                                                                   |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`     | `State` \| (`prevState`: `Readonly`<`State`\>, `props`: `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\>) => `State` \| `Pick`<`State`, `K`\> \| `Pick`<`State`, `K`\> |
| `callback?` | () => `void`                                                                                                                                                                                           |

#### Returns

`void`

#### Inherited from

React.PureComponent.setState

#### Defined in

node_modules/@types/react/index.d.ts:485

---

### shouldComponentUpdate

▸ `Optional` **shouldComponentUpdate**(`nextProps`, `nextState`, `nextContext`): `boolean`

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

#### Parameters

| Name          | Type                                                                             |
| :------------ | :------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`KuiProps`](../modules/kui_shell_plugin_client_common.md#kuiprops)\> |
| `nextState`   | `Readonly`<`State`\>                                                             |
| `nextContext` | `any`                                                                            |

#### Returns

`boolean`

#### Inherited from

React.PureComponent.shouldComponentUpdate

#### Defined in

node_modules/@types/react/index.d.ts:630

---

### statusStripeProps

▸ `Private` **statusStripeProps**(): `Props`

Props to pass to StatusStripe. This allows us to set the desired
status stripe color at startup time, rather than seeing the
default color, followed quickly by a change to the color desired
by the controller backing the given `props.commandLine`. The
controller may still want to specialize the status stripe
further, but at least we can avoid that odd
e.g. defaultColor-then-blue effect.

#### Returns

`Props`

#### Defined in

[plugins/plugin-client-common/src/components/Client/Kui.tsx:245](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/Kui.tsx#L245)
