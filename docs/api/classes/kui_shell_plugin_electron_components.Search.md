[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-electron-components](../modules/kui_shell_plugin_electron_components.md) / Search

# Class: Search

[@kui-shell/plugin-electron-components](../modules/kui_shell_plugin_electron_components.md).Search

## Hierarchy

- `Component`<`Props`, `State`\>

  ↳ **`Search`**

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_electron_components.Search.md#constructor)

### Properties

- [\_input](kui_shell_plugin_electron_components.Search.md#_input)
- [\_onChange](kui_shell_plugin_electron_components.Search.md#_onchange)
- [\_onClear](kui_shell_plugin_electron_components.Search.md#_onclear)
- [\_onNext](kui_shell_plugin_electron_components.Search.md#_onnext)
- [\_onPrevious](kui_shell_plugin_electron_components.Search.md#_onprevious)
- [context](kui_shell_plugin_electron_components.Search.md#context)
- [props](kui_shell_plugin_electron_components.Search.md#props)
- [refs](kui_shell_plugin_electron_components.Search.md#refs)
- [state](kui_shell_plugin_electron_components.Search.md#state)
- [contextType](kui_shell_plugin_electron_components.Search.md#contexttype)

### Methods

- [UNSAFE_componentWillMount](kui_shell_plugin_electron_components.Search.md#unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](kui_shell_plugin_electron_components.Search.md#unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](kui_shell_plugin_electron_components.Search.md#unsafe_componentwillupdate)
- [\_onRef](kui_shell_plugin_electron_components.Search.md#_onref)
- [componentDidCatch](kui_shell_plugin_electron_components.Search.md#componentdidcatch)
- [componentDidMount](kui_shell_plugin_electron_components.Search.md#componentdidmount)
- [componentDidUpdate](kui_shell_plugin_electron_components.Search.md#componentdidupdate)
- [componentWillMount](kui_shell_plugin_electron_components.Search.md#componentwillmount)
- [componentWillReceiveProps](kui_shell_plugin_electron_components.Search.md#componentwillreceiveprops)
- [componentWillUnmount](kui_shell_plugin_electron_components.Search.md#componentwillunmount)
- [componentWillUpdate](kui_shell_plugin_electron_components.Search.md#componentwillupdate)
- [doFocus](kui_shell_plugin_electron_components.Search.md#dofocus)
- [findInPage](kui_shell_plugin_electron_components.Search.md#findinpage)
- [forceUpdate](kui_shell_plugin_electron_components.Search.md#forceupdate)
- [getSnapshotBeforeUpdate](kui_shell_plugin_electron_components.Search.md#getsnapshotbeforeupdate)
- [hack](kui_shell_plugin_electron_components.Search.md#hack)
- [initEvents](kui_shell_plugin_electron_components.Search.md#initevents)
- [onChange](kui_shell_plugin_electron_components.Search.md#onchange)
- [onClear](kui_shell_plugin_electron_components.Search.md#onclear)
- [onNext](kui_shell_plugin_electron_components.Search.md#onnext)
- [onPrevious](kui_shell_plugin_electron_components.Search.md#onprevious)
- [render](kui_shell_plugin_electron_components.Search.md#render)
- [resultsRender](kui_shell_plugin_electron_components.Search.md#resultsrender)
- [setState](kui_shell_plugin_electron_components.Search.md#setstate)
- [shouldComponentUpdate](kui_shell_plugin_electron_components.Search.md#shouldcomponentupdate)
- [stopFindInPage](kui_shell_plugin_electron_components.Search.md#stopfindinpage)

## Constructors

### constructor

• **new Search**(`props`)

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `props` | `Props` |

#### Overrides

React.Component&lt;Props, State\&gt;.constructor

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:34](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L34)

## Properties

### \_input

• `Private` **\_input**: `HTMLInputElement`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:32](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L32)

---

### \_onChange

• `Private` **\_onChange**: `any`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:80](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L80)

---

### \_onClear

• `Private` `Readonly` **\_onClear**: `any`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:125](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L125)

---

### \_onNext

• `Private` `Readonly` **\_onNext**: `any`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:139](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L139)

---

### \_onPrevious

• `Private` `Readonly` **\_onPrevious**: `any`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:154](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L154)

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

React.Component.context

#### Defined in

node_modules/@types/react/index.d.ts:473

---

### props

• `Readonly` **props**: `Readonly`<`Props`\> & `Readonly`<`Object`\>

#### Inherited from

React.Component.props

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

React.Component.refs

#### Defined in

node_modules/@types/react/index.d.ts:504

---

### state

• **state**: `Readonly`<`State`\>

#### Inherited from

React.Component.state

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

React.Component.contextType

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

React.Component.UNSAFE_componentWillMount

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

React.Component.UNSAFE_componentWillReceiveProps

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

React.Component.UNSAFE_componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:771

---

### \_onRef

▸ `Private` `Readonly` **\_onRef**(`c`): `void`

#### Parameters

| Name | Type               |
| :--- | :----------------- |
| `c`  | `HTMLInputElement` |

#### Returns

`void`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:167](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L167)

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

React.Component.componentDidCatch

#### Defined in

node_modules/@types/react/index.d.ts:640

---

### componentDidMount

▸ `Optional` **componentDidMount**(): `void`

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

#### Returns

`void`

#### Inherited from

React.Component.componentDidMount

#### Defined in

node_modules/@types/react/index.d.ts:619

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

React.Component.componentDidUpdate

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

React.Component.componentWillMount

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

React.Component.componentWillReceiveProps

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

React.Component.componentWillUnmount

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

| Name          | Type                 |
| :------------ | :------------------- |
| `nextProps`   | `Readonly`<`Props`\> |
| `nextState`   | `Readonly`<`State`\> |
| `nextContext` | `any`                |

#### Returns

`void`

#### Inherited from

React.Component.componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:756

---

### doFocus

▸ `Private` **doFocus**(): `void`

#### Returns

`void`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:119](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L119)

---

### findInPage

▸ `Private` **findInPage**(`options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                |
| :--------- | :------------------ |
| `options?` | `FindInPageOptions` |

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:92](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L92)

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

React.Component.forceUpdate

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

| Name        | Type                 |
| :---------- | :------------------- |
| `prevProps` | `Readonly`<`Props`\> |
| `prevState` | `Readonly`<`State`\> |

#### Returns

`any`

#### Inherited from

React.Component.getSnapshotBeforeUpdate

#### Defined in

node_modules/@types/react/index.d.ts:676

---

### hack

▸ `Private` **hack**(): `void`

findInPage api seems to result in a loss of focus

#### Returns

`void`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:112](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L112)

---

### initEvents

▸ `Private` **initEvents**(): `void`

#### Returns

`void`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:57](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L57)

---

### onChange

▸ `Private` **onChange**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:81](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L81)

---

### onClear

▸ `Private` **onClear**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:126](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L126)

---

### onNext

▸ `Private` **onNext**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:140](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L140)

---

### onPrevious

▸ `Private` **onPrevious**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:155](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L155)

---

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

React.Component.render

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:182](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L182)

---

### resultsRender

▸ `Private` **resultsRender**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:174](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L174)

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

React.Component.setState

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

React.Component.shouldComponentUpdate

#### Defined in

node_modules/@types/react/index.d.ts:630

---

### stopFindInPage

▸ `Private` **stopFindInPage**(): `Promise`<`void`\>

stop findInPage, and clear selections in page

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-electron-components/src/components/Search.tsx:48](https://github.com/mra-ruiz/kui/blob/27e887ab4/plugins/plugin-electron-components/src/components/Search.tsx#L48)
