[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / FancyPipeline

# Class: FancyPipeline

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).FancyPipeline

## Hierarchy

- `PureComponent`<`Props`\>

  ↳ **`FancyPipeline`**

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_client_common.FancyPipeline.md#constructor)

### Properties

- [context](kui_shell_plugin_client_common.FancyPipeline.md#context)
- [props](kui_shell_plugin_client_common.FancyPipeline.md#props)
- [refs](kui_shell_plugin_client_common.FancyPipeline.md#refs)
- [state](kui_shell_plugin_client_common.FancyPipeline.md#state)
- [contextType](kui_shell_plugin_client_common.FancyPipeline.md#contexttype)

### Methods

- [UNSAFE_componentWillMount](kui_shell_plugin_client_common.FancyPipeline.md#unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](kui_shell_plugin_client_common.FancyPipeline.md#unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](kui_shell_plugin_client_common.FancyPipeline.md#unsafe_componentwillupdate)
- [componentDidCatch](kui_shell_plugin_client_common.FancyPipeline.md#componentdidcatch)
- [componentDidMount](kui_shell_plugin_client_common.FancyPipeline.md#componentdidmount)
- [componentDidUpdate](kui_shell_plugin_client_common.FancyPipeline.md#componentdidupdate)
- [componentWillMount](kui_shell_plugin_client_common.FancyPipeline.md#componentwillmount)
- [componentWillReceiveProps](kui_shell_plugin_client_common.FancyPipeline.md#componentwillreceiveprops)
- [componentWillUnmount](kui_shell_plugin_client_common.FancyPipeline.md#componentwillunmount)
- [componentWillUpdate](kui_shell_plugin_client_common.FancyPipeline.md#componentwillupdate)
- [forceUpdate](kui_shell_plugin_client_common.FancyPipeline.md#forceupdate)
- [getSnapshotBeforeUpdate](kui_shell_plugin_client_common.FancyPipeline.md#getsnapshotbeforeupdate)
- [linebreak](kui_shell_plugin_client_common.FancyPipeline.md#linebreak)
- [pipe](kui_shell_plugin_client_common.FancyPipeline.md#pipe)
- [render](kui_shell_plugin_client_common.FancyPipeline.md#render)
- [setState](kui_shell_plugin_client_common.FancyPipeline.md#setstate)
- [shouldComponentUpdate](kui_shell_plugin_client_common.FancyPipeline.md#shouldcomponentupdate)

## Constructors

### constructor

• **new FancyPipeline**(`props`)

#### Parameters

| Name    | Type                            |
| :------ | :------------------------------ |
| `props` | `Props` \| `Readonly`<`Props`\> |

#### Inherited from

React.PureComponent<Props\>.constructor

#### Defined in

node_modules/@types/react/index.d.ts:475

• **new FancyPipeline**(`props`, `context`)

**`deprecated`**

**`see`** https://reactjs.org/docs/legacy-context.html

#### Parameters

| Name      | Type    |
| :-------- | :------ |
| `props`   | `Props` |
| `context` | `any`   |

#### Inherited from

React.PureComponent<Props\>.constructor

#### Defined in

node_modules/@types/react/index.d.ts:480

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

• **state**: `Readonly`<`Object`\>

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

| Name          | Type                  |
| :------------ | :-------------------- |
| `nextProps`   | `Readonly`<`Props`\>  |
| `nextState`   | `Readonly`<`Object`\> |
| `nextContext` | `any`                 |

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE_componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:771

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

| Name        | Type                  |
| :---------- | :-------------------- |
| `prevProps` | `Readonly`<`Props`\>  |
| `prevState` | `Readonly`<`Object`\> |
| `snapshot?` | `any`                 |

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

| Name          | Type                  |
| :------------ | :-------------------- |
| `nextProps`   | `Readonly`<`Props`\>  |
| `nextState`   | `Readonly`<`Object`\> |
| `nextContext` | `any`                 |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:756

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

| Name        | Type                  |
| :---------- | :-------------------- |
| `prevProps` | `Readonly`<`Props`\>  |
| `prevState` | `Readonly`<`Object`\> |

#### Returns

`any`

#### Inherited from

React.PureComponent.getSnapshotBeforeUpdate

#### Defined in

node_modules/@types/react/index.d.ts:676

---

### linebreak

▸ `Private` **linebreak**(): `Element`

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/FancyPipeline.tsx:23](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-client-common/src/components/Views/Terminal/Block/FancyPipeline.tsx#L23)

---

### pipe

▸ `Private` **pipe**(`c`): `Element`

#### Parameters

| Name | Type     |
| :--- | :------- |
| `c`  | `string` |

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/FancyPipeline.tsx:27](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-client-common/src/components/Views/Terminal/Block/FancyPipeline.tsx#L27)

---

### render

▸ **render**(): `Element`

Pretty-print the command line with `pipeStages`
e.g. somePrefix -- foo | bar > baz

#### Returns

`Element`

#### Overrides

React.PureComponent.render

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/FancyPipeline.tsx:35](https://github.com/mra-ruiz/kui/blob/a3b5e3edf/plugins/plugin-client-common/src/components/Views/Terminal/Block/FancyPipeline.tsx#L35)

---

### setState

▸ **setState**<`K`\>(`state`, `callback?`): `void`

#### Type parameters

| Name | Type            |
| :--- | :-------------- |
| `K`  | extends `never` |

#### Parameters

| Name        | Type                                                                                                                                |
| :---------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `state`     | {} \| (`prevState`: `Readonly`<`Object`\>, `props`: `Readonly`<`Props`\>) => {} \| `Pick`<`Object`, `K`\> \| `Pick`<`Object`, `K`\> |
| `callback?` | () => `void`                                                                                                                        |

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

| Name          | Type                  |
| :------------ | :-------------------- |
| `nextProps`   | `Readonly`<`Props`\>  |
| `nextState`   | `Readonly`<`Object`\> |
| `nextContext` | `any`                 |

#### Returns

`boolean`

#### Inherited from

React.PureComponent.shouldComponentUpdate

#### Defined in

node_modules/@types/react/index.d.ts:630
