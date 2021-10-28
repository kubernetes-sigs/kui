[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-git](../modules/kui_shell_plugin_git.md) / CurrentGitBranch

# Class: CurrentGitBranch

[@kui-shell/plugin-git](../modules/kui_shell_plugin_git.md).CurrentGitBranch

## Hierarchy

- `PureComponent`<`Props`, `State`\>

  ↳ **`CurrentGitBranch`**

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_git.CurrentGitBranch.md#constructor)

### Properties

- [\_unmounted](kui_shell_plugin_git.CurrentGitBranch.md#_unmounted)
- [context](kui_shell_plugin_git.CurrentGitBranch.md#context)
- [handler](kui_shell_plugin_git.CurrentGitBranch.md#handler)
- [last](kui_shell_plugin_git.CurrentGitBranch.md#last)
- [props](kui_shell_plugin_git.CurrentGitBranch.md#props)
- [refs](kui_shell_plugin_git.CurrentGitBranch.md#refs)
- [state](kui_shell_plugin_git.CurrentGitBranch.md#state)
- [contextType](kui_shell_plugin_git.CurrentGitBranch.md#contexttype)

### Accessors

- [unmounted](kui_shell_plugin_git.CurrentGitBranch.md#unmounted)

### Methods

- [UNSAFE_componentWillMount](kui_shell_plugin_git.CurrentGitBranch.md#unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](kui_shell_plugin_git.CurrentGitBranch.md#unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](kui_shell_plugin_git.CurrentGitBranch.md#unsafe_componentwillupdate)
- [changeBranch](kui_shell_plugin_git.CurrentGitBranch.md#changebranch)
- [changes](kui_shell_plugin_git.CurrentGitBranch.md#changes)
- [componentDidCatch](kui_shell_plugin_git.CurrentGitBranch.md#componentdidcatch)
- [componentDidMount](kui_shell_plugin_git.CurrentGitBranch.md#componentdidmount)
- [componentDidUpdate](kui_shell_plugin_git.CurrentGitBranch.md#componentdidupdate)
- [componentWillMount](kui_shell_plugin_git.CurrentGitBranch.md#componentwillmount)
- [componentWillReceiveProps](kui_shell_plugin_git.CurrentGitBranch.md#componentwillreceiveprops)
- [componentWillUnmount](kui_shell_plugin_git.CurrentGitBranch.md#componentwillunmount)
- [componentWillUpdate](kui_shell_plugin_git.CurrentGitBranch.md#componentwillupdate)
- [debounce](kui_shell_plugin_git.CurrentGitBranch.md#debounce)
- [forceUpdate](kui_shell_plugin_git.CurrentGitBranch.md#forceupdate)
- [getSnapshotBeforeUpdate](kui_shell_plugin_git.CurrentGitBranch.md#getsnapshotbeforeupdate)
- [popover](kui_shell_plugin_git.CurrentGitBranch.md#popover)
- [popoverBody](kui_shell_plugin_git.CurrentGitBranch.md#popoverbody)
- [popoverHeader](kui_shell_plugin_git.CurrentGitBranch.md#popoverheader)
- [render](kui_shell_plugin_git.CurrentGitBranch.md#render)
- [reportCurrentBranch](kui_shell_plugin_git.CurrentGitBranch.md#reportcurrentbranch)
- [setState](kui_shell_plugin_git.CurrentGitBranch.md#setstate)
- [shouldComponentUpdate](kui_shell_plugin_git.CurrentGitBranch.md#shouldcomponentupdate)
- [statusModel](kui_shell_plugin_git.CurrentGitBranch.md#statusmodel)
- [summary](kui_shell_plugin_git.CurrentGitBranch.md#summary)

## Constructors

### constructor

• **new CurrentGitBranch**(`props`)

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `props` | `Props` |

#### Overrides

React.PureComponent&lt;Props, State\&gt;.constructor

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:39](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L39)

## Properties

### \_unmounted

• `Private` **\_unmounted**: `boolean` = `true`

So we don't handle events after unmounting

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:50](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L50)

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

### handler

• `Private` `Readonly` **handler**: `any`

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:37](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L37)

---

### last

• `Private` **last**: `number`

Avoid recomputation for a flurry of events

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:60](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L60)

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

## Accessors

### unmounted

• `Private` `get` **unmounted**(): `boolean`

#### Returns

`boolean`

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:51](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L51)

• `Private` `set` **unmounted**(`umm`): `void`

#### Parameters

| Name  | Type      |
| :---- | :-------- |
| `umm` | `boolean` |

#### Returns

`void`

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:55](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L55)

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

### changeBranch

▸ `Private` **changeBranch**(): `Element`

#### Returns

`Element`

UI for changing branches

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:230](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L230)

---

### changes

▸ `Private` **changes**(`statusModel`): `Element`

#### Parameters

| Name          | Type                                   |
| :------------ | :------------------------------------- |
| `statusModel` | { `M`: `string` ; `file`: `string` }[] |

#### Returns

`Element`

UI for changes represented by `statusModel`

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:195](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L195)

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

Once we have mounted, we immediately check the current branch,
and schedule an update based on standard REPL events.

#### Returns

`void`

#### Overrides

React.PureComponent.componentDidMount

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:126](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L126)

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

Make sure to unsubscribe!

#### Returns

`void`

#### Overrides

React.PureComponent.componentWillUnmount

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:138](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L138)

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

### debounce

▸ `Private` **debounce**(): `boolean`

#### Returns

`boolean`

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:61](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L61)

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

### popover

▸ `Private` **popover**(): `Object`

#### Returns

`Object`

desired Popover model

| Name            | Type      |
| :-------------- | :-------- |
| `bodyContent`   | `Element` |
| `headerContent` | `Element` |

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:222](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L222)

---

### popoverBody

▸ `Private` **popoverBody**(): `Element`

#### Returns

`Element`

the body for the Popover component

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:157](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L157)

---

### popoverHeader

▸ `Private` **popoverHeader**(): `Element`

#### Returns

`Element`

the header for the Popover component

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:144](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L144)

---

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

React.PureComponent.render

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:238](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L238)

---

### reportCurrentBranch

▸ `Private` **reportCurrentBranch**(): `Promise`<`void`\>

Check the current branch, and the dirtiness thereof.

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:73](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L73)

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

### statusModel

▸ `Private` **statusModel**(): { `M`: `string` ; `file`: `string` }[]

#### Returns

{ `M`: `string` ; `file`: `string` }[]

a model of `git status -s`

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:169](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L169)

---

### summary

▸ `Private` **summary**(`statusModel`): `Element`

#### Parameters

| Name          | Type                                   |
| :------------ | :------------------------------------- |
| `statusModel` | { `M`: `string` ; `file`: `string` }[] |

#### Returns

`Element`

UI that summarizes the `statusModel` changes

#### Defined in

[plugins/plugin-git/src/CurrentGitBranch.tsx:184](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-git/src/CurrentGitBranch.tsx#L184)
