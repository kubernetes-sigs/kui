[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-electron-components](../modules/kui_shell_plugin_electron_components.md) / UpdateChecker

# Class: UpdateChecker

[@kui-shell/plugin-electron-components](../modules/kui_shell_plugin_electron_components.md).UpdateChecker

## Hierarchy

- `PureComponent`<`Props`, `State`\>

  ↳ **`UpdateChecker`**

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_electron_components.UpdateChecker.md#constructor)

### Properties

- [context](kui_shell_plugin_electron_components.UpdateChecker.md#context)
- [props](kui_shell_plugin_electron_components.UpdateChecker.md#props)
- [refs](kui_shell_plugin_electron_components.UpdateChecker.md#refs)
- [state](kui_shell_plugin_electron_components.UpdateChecker.md#state)
- [contextType](kui_shell_plugin_electron_components.UpdateChecker.md#contexttype)

### Methods

- [UNSAFE_componentWillMount](kui_shell_plugin_electron_components.UpdateChecker.md#unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](kui_shell_plugin_electron_components.UpdateChecker.md#unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](kui_shell_plugin_electron_components.UpdateChecker.md#unsafe_componentwillupdate)
- [\_brewUpgrade](kui_shell_plugin_electron_components.UpdateChecker.md#_brewupgrade)
- [checkForUpdates](kui_shell_plugin_electron_components.UpdateChecker.md#checkforupdates)
- [componentDidCatch](kui_shell_plugin_electron_components.UpdateChecker.md#componentdidcatch)
- [componentDidMount](kui_shell_plugin_electron_components.UpdateChecker.md#componentdidmount)
- [componentDidUpdate](kui_shell_plugin_electron_components.UpdateChecker.md#componentdidupdate)
- [componentWillMount](kui_shell_plugin_electron_components.UpdateChecker.md#componentwillmount)
- [componentWillReceiveProps](kui_shell_plugin_electron_components.UpdateChecker.md#componentwillreceiveprops)
- [componentWillUnmount](kui_shell_plugin_electron_components.UpdateChecker.md#componentwillunmount)
- [componentWillUpdate](kui_shell_plugin_electron_components.UpdateChecker.md#componentwillupdate)
- [dulyNoted](kui_shell_plugin_electron_components.UpdateChecker.md#dulynoted)
- [forceUpdate](kui_shell_plugin_electron_components.UpdateChecker.md#forceupdate)
- [getCurrentVersion](kui_shell_plugin_electron_components.UpdateChecker.md#getcurrentversion)
- [getSnapshotBeforeUpdate](kui_shell_plugin_electron_components.UpdateChecker.md#getsnapshotbeforeupdate)
- [initPinger](kui_shell_plugin_electron_components.UpdateChecker.md#initpinger)
- [isUpdateAvailable](kui_shell_plugin_electron_components.UpdateChecker.md#isupdateavailable)
- [popover](kui_shell_plugin_electron_components.UpdateChecker.md#popover)
- [render](kui_shell_plugin_electron_components.UpdateChecker.md#render)
- [setState](kui_shell_plugin_electron_components.UpdateChecker.md#setstate)
- [shouldComponentUpdate](kui_shell_plugin_electron_components.UpdateChecker.md#shouldcomponentupdate)
- [text](kui_shell_plugin_electron_components.UpdateChecker.md#text)

## Constructors

### constructor

• **new UpdateChecker**(`props`)

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `props` | `Props` |

#### Overrides

React.PureComponent&lt;Props, State\&gt;.constructor

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:107](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L107)

## Properties

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

### props

• `Readonly` **props**: `Readonly`<`Props`\> & `Readonly`<`Object`\>

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

| Name          | Type                 |
| :------------ | :------------------- |
| `nextProps`   | `Readonly`<`Props`\> |
| `nextContext` | `any`                |

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

| Name          | Type                 |
| :------------ | :------------------- |
| `nextProps`   | `Readonly`<`Props`\> |
| `nextState`   | `Readonly`<`State`\> |
| `nextContext` | `any`                |

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE_componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:771

---

### \_brewUpgrade

▸ `Private` `Readonly` **\_brewUpgrade**(): `Promise`<`KResponse`<`any`\>\>

#### Returns

`Promise`<`KResponse`<`any`\>\>

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:157](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L157)

---

### checkForUpdates

▸ `Private` **checkForUpdates**(): `void`

Ping the release feed to check for the latest release

#### Returns

`void`

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:129](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L129)

---

### componentDidCatch

▸ `Optional` **componentDidCatch**(`error`, `errorInfo`): `void`

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

#### Parameters

| Name        | Type        |
| :---------- | :---------- |
| `error`     | `Error`     |
| `errorInfo` | `ErrorInfo` |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentDidCatch

#### Defined in

node_modules/@types/react/index.d.ts:640

---

### componentDidMount

▸ **componentDidMount**(): `void`

#### Returns

`void`

#### Overrides

React.PureComponent.componentDidMount

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:208](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L208)

---

### componentDidUpdate

▸ `Optional` **componentDidUpdate**(`prevProps`, `prevState`, `snapshot?`): `void`

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

#### Parameters

| Name        | Type                 |
| :---------- | :------------------- |
| `prevProps` | `Readonly`<`Props`\> |
| `prevState` | `Readonly`<`State`\> |
| `snapshot?` | `any`                |

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

| Name          | Type                 |
| :------------ | :------------------- |
| `nextProps`   | `Readonly`<`Props`\> |
| `nextContext` | `any`                |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:726

---

### componentWillUnmount

▸ **componentWillUnmount**(): `void`

Bye!

#### Returns

`void`

#### Overrides

React.PureComponent.componentWillUnmount

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:213](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L213)

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

| Name          | Type                 |
| :------------ | :------------------- |
| `nextProps`   | `Readonly`<`Props`\> |
| `nextState`   | `Readonly`<`State`\> |
| `nextContext` | `any`                |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:756

---

### dulyNoted

▸ `Private` **dulyNoted**(): `Promise`<`void`\>

User has acknoledged the notification

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:245](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L245)

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

### getCurrentVersion

▸ `Private` **getCurrentVersion**(): `Promise`<`void`\>

What version are we running?

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:193](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L193)

---

### getSnapshotBeforeUpdate

▸ `Optional` **getSnapshotBeforeUpdate**(`prevProps`, `prevState`): `any`

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

#### Parameters

| Name        | Type                 |
| :---------- | :------------------- |
| `prevProps` | `Readonly`<`Props`\> |
| `prevState` | `Readonly`<`State`\> |

#### Returns

`any`

#### Inherited from

React.PureComponent.getSnapshotBeforeUpdate

#### Defined in

node_modules/@types/react/index.d.ts:676

---

### initPinger

▸ `Private` **initPinger**(): `Timeout`

Initialize a timer that periodically checks for updates

#### Returns

`Timeout`

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:122](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L122)

---

### isUpdateAvailable

▸ `Private` **isUpdateAvailable**(): `boolean`

Given current state, is an update available?

#### Returns

`boolean`

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:220](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L220)

---

### popover

▸ `Private` **popover**(`entryForLatestVersion`): `Object`

#### Parameters

| Name                             | Type     |
| :------------------------------- | :------- |
| `entryForLatestVersion`          | `Object` |
| `entryForLatestVersion.content`  | `string` |
| `entryForLatestVersion.download` | `string` |
| `entryForLatestVersion.title`    | `string` |
| `entryForLatestVersion.updated`  | `string` |
| `entryForLatestVersion.version`  | `string` |

#### Returns

`Object`

| Name            | Type                     |
| :-------------- | :----------------------- |
| `bodyContent`   | `Element`                |
| `className`     | `string`                 |
| `headerContent` | `Element`                |
| `maxWidth`      | `string`                 |
| `onHide`        | () => `Promise`<`void`\> |

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:159](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L159)

---

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

React.PureComponent.render

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:257](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L257)

---

### setState

▸ **setState**<`K`\>(`state`, `callback?`): `void`

#### Type parameters

| Name | Type                  |
| :--- | :-------------------- |
| `K`  | extends keyof `State` |

#### Parameters

| Name        | Type                                                                                                                                       |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `state`     | `State` \| (`prevState`: `Readonly`<`State`\>, `props`: `Readonly`<`Props`\>) => `State` \| `Pick`<`State`, `K`\> \| `Pick`<`State`, `K`\> |
| `callback?` | () => `void`                                                                                                                               |

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

| Name          | Type                 |
| :------------ | :------------------- |
| `nextProps`   | `Readonly`<`Props`\> |
| `nextState`   | `Readonly`<`State`\> |
| `nextContext` | `any`                |

#### Returns

`boolean`

#### Inherited from

React.PureComponent.shouldComponentUpdate

#### Defined in

node_modules/@types/react/index.d.ts:630

---

### text

▸ `Private` **text**(): `string`

Text for update available notification

#### Returns

`string`

#### Defined in

[plugins/plugin-electron-components/src/components/UpdateChecker.tsx:240](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-electron-components/src/components/UpdateChecker.tsx#L240)
