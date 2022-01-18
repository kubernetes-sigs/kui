[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / InputProvider

# Class: InputProvider<S\>

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).InputProvider

## Type parameters

| Name | Type                                                                                                                                                                                            |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `S`  | extends [`InputProviderState`](../interfaces/kui_shell_plugin_client_common.InputProviderState.md) = [`InputProviderState`](../interfaces/kui_shell_plugin_client_common.InputProviderState.md) |

## Hierarchy

- `PureComponent`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops), `S`\>

  ↳ **`InputProvider`**

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_client_common.InputProvider.md#constructor)

### Properties

- [\_cancelReEdit](kui_shell_plugin_client_common.InputProvider.md#_cancelreedit)
- [context](kui_shell_plugin_client_common.InputProvider.md#context)
- [props](kui_shell_plugin_client_common.InputProvider.md#props)
- [refs](kui_shell_plugin_client_common.InputProvider.md#refs)
- [state](kui_shell_plugin_client_common.InputProvider.md#state)
- [contextType](kui_shell_plugin_client_common.InputProvider.md#contexttype)

### Methods

- [UNSAFE_componentWillMount](kui_shell_plugin_client_common.InputProvider.md#unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](kui_shell_plugin_client_common.InputProvider.md#unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](kui_shell_plugin_client_common.InputProvider.md#unsafe_componentwillupdate)
- [cancelReEdit](kui_shell_plugin_client_common.InputProvider.md#cancelreedit)
- [componentDidCatch](kui_shell_plugin_client_common.InputProvider.md#componentdidcatch)
- [componentDidMount](kui_shell_plugin_client_common.InputProvider.md#componentdidmount)
- [componentDidUpdate](kui_shell_plugin_client_common.InputProvider.md#componentdidupdate)
- [componentWillMount](kui_shell_plugin_client_common.InputProvider.md#componentwillmount)
- [componentWillReceiveProps](kui_shell_plugin_client_common.InputProvider.md#componentwillreceiveprops)
- [componentWillUnmount](kui_shell_plugin_client_common.InputProvider.md#componentwillunmount)
- [componentWillUpdate](kui_shell_plugin_client_common.InputProvider.md#componentwillupdate)
- [contextContent](kui_shell_plugin_client_common.InputProvider.md#contextcontent)
- [forceUpdate](kui_shell_plugin_client_common.InputProvider.md#forceupdate)
- [getSnapshotBeforeUpdate](kui_shell_plugin_client_common.InputProvider.md#getsnapshotbeforeupdate)
- [input](kui_shell_plugin_client_common.InputProvider.md#input)
- [isearchPrompt](kui_shell_plugin_client_common.InputProvider.md#isearchprompt)
- [normalPrompt](kui_shell_plugin_client_common.InputProvider.md#normalprompt)
- [prompt](kui_shell_plugin_client_common.InputProvider.md#prompt)
- [promptLeft](kui_shell_plugin_client_common.InputProvider.md#promptleft)
- [promptRight](kui_shell_plugin_client_common.InputProvider.md#promptright)
- [render](kui_shell_plugin_client_common.InputProvider.md#render)
- [setState](kui_shell_plugin_client_common.InputProvider.md#setstate)
- [shouldComponentUpdate](kui_shell_plugin_client_common.InputProvider.md#shouldcomponentupdate)
- [sourceRef](kui_shell_plugin_client_common.InputProvider.md#sourceref)
- [status](kui_shell_plugin_client_common.InputProvider.md#status)

## Constructors

### constructor

• **new InputProvider**<`S`\>(`props`)

#### Type parameters

| Name | Type                                                                                                                                                                                            |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `S`  | extends [`InputProviderState`](../interfaces/kui_shell_plugin_client_common.InputProviderState.md) = [`InputProviderState`](../interfaces/kui_shell_plugin_client_common.InputProviderState.md) |

#### Parameters

| Name    | Type                                                                                                                                                                                            |
| :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `props` | [`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops) \| `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> |

#### Inherited from

React.PureComponent<Props, S\>.constructor

#### Defined in

node_modules/@types/react/index.d.ts:481

• **new InputProvider**<`S`\>(`props`, `context`)

**`deprecated`**

**`see`** https://reactjs.org/docs/legacy-context.html

#### Type parameters

| Name | Type                                                                                                                                                                                            |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `S`  | extends [`InputProviderState`](../interfaces/kui_shell_plugin_client_common.InputProviderState.md) = [`InputProviderState`](../interfaces/kui_shell_plugin_client_common.InputProviderState.md) |

#### Parameters

| Name      | Type                                                                                    |
| :-------- | :-------------------------------------------------------------------------------------- |
| `props`   | [`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops) |
| `context` | `any`                                                                                   |

#### Inherited from

React.PureComponent<Props, S\>.constructor

#### Defined in

node_modules/@types/react/index.d.ts:486

## Properties

### \_cancelReEdit

• `Private` `Readonly` **\_cancelReEdit**: `any`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:207](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L207)

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

node_modules/@types/react/index.d.ts:479

---

### props

• `Readonly` **props**: `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> & `Readonly`<{ `children?`: `ReactNode` }\>

#### Inherited from

React.PureComponent.props

#### Defined in

node_modules/@types/react/index.d.ts:504

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

node_modules/@types/react/index.d.ts:510

---

### state

• **state**: `Readonly`<`S`\>

#### Inherited from

React.PureComponent.state

#### Defined in

node_modules/@types/react/index.d.ts:505

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

node_modules/@types/react/index.d.ts:461

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

node_modules/@types/react/index.d.ts:717

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

| Name          | Type                                                                                                 |
| :------------ | :--------------------------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> |
| `nextContext` | `any`                                                                                                |

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE_componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:749

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

| Name          | Type                                                                                                 |
| :------------ | :--------------------------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> |
| `nextState`   | `Readonly`<`S`\>                                                                                     |
| `nextContext` | `any`                                                                                                |

#### Returns

`void`

#### Inherited from

React.PureComponent.UNSAFE_componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:777

---

### cancelReEdit

▸ `Protected` **cancelReEdit**(): `void`

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:199](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L199)

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

node_modules/@types/react/index.d.ts:646

---

### componentDidMount

▸ `Optional` **componentDidMount**(): `void`

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

#### Returns

`void`

#### Inherited from

React.PureComponent.componentDidMount

#### Defined in

node_modules/@types/react/index.d.ts:625

---

### componentDidUpdate

▸ `Optional` **componentDidUpdate**(`prevProps`, `prevState`, `snapshot?`): `void`

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

#### Parameters

| Name        | Type                                                                                                 |
| :---------- | :--------------------------------------------------------------------------------------------------- |
| `prevProps` | `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> |
| `prevState` | `Readonly`<`S`\>                                                                                     |
| `snapshot?` | `any`                                                                                                |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentDidUpdate

#### Defined in

node_modules/@types/react/index.d.ts:688

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

node_modules/@types/react/index.d.ts:703

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

| Name          | Type                                                                                                 |
| :------------ | :--------------------------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> |
| `nextContext` | `any`                                                                                                |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:732

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

node_modules/@types/react/index.d.ts:641

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

| Name          | Type                                                                                                 |
| :------------ | :--------------------------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> |
| `nextState`   | `Readonly`<`S`\>                                                                                     |
| `nextContext` | `any`                                                                                                |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillUpdate

#### Defined in

node_modules/@types/react/index.d.ts:762

---

### contextContent

▸ `Protected` **contextContent**(`insideBrackets?`): `ReactNode`

#### Parameters

| Name             | Type        |
| :--------------- | :---------- |
| `insideBrackets` | `ReactNode` |

#### Returns

`ReactNode`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:209](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L209)

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

node_modules/@types/react/index.d.ts:496

---

### getSnapshotBeforeUpdate

▸ `Optional` **getSnapshotBeforeUpdate**(`prevProps`, `prevState`): `any`

Runs before React applies the result of `render` to the document, and
returns an object to be given to componentDidUpdate. Useful for saving
things such as scroll position before `render` causes changes to it.

Note: the presence of getSnapshotBeforeUpdate prevents any of the deprecated
lifecycle events from running.

#### Parameters

| Name        | Type                                                                                                 |
| :---------- | :--------------------------------------------------------------------------------------------------- |
| `prevProps` | `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> |
| `prevState` | `Readonly`<`S`\>                                                                                     |

#### Returns

`any`

#### Inherited from

React.PureComponent.getSnapshotBeforeUpdate

#### Defined in

node_modules/@types/react/index.d.ts:682

---

### input

▸ `Protected` `Abstract` **input**(): `any`

this is what the InputProvider needs to provide, minimially

#### Returns

`any`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:193](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L193)

---

### isearchPrompt

▸ `Protected` **isearchPrompt**(): `Element`

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:272](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L272)

---

### normalPrompt

▸ `Protected` **normalPrompt**(): `Element`

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:276](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L276)

---

### prompt

▸ `Protected` **prompt**(): `Element`

the "xxx >" prompt part of the input section

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:294](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L294)

---

### promptLeft

▸ `Protected` **promptLeft**(): `Element`

the "xxx" part of "xxx >" of the prompt

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:231](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L231)

---

### promptRight

▸ `Protected` **promptRight**(): `Element`

the ">" part of "xxx >" of the prompt

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:249](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L249)

---

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

React.PureComponent.render

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:322](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L322)

---

### setState

▸ **setState**<`K`\>(`state`, `callback?`): `void`

#### Type parameters

| Name | Type                                     |
| :--- | :--------------------------------------- |
| `K`  | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name        | Type                                                                                                                                                                                                   |
| :---------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `state`     | `S` \| (`prevState`: `Readonly`<`S`\>, `props`: `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\>) => `S` \| `Pick`<`S`, `K`\> \| `Pick`<`S`, `K`\> |
| `callback?` | () => `void`                                                                                                                                                                                           |

#### Returns

`void`

#### Inherited from

React.PureComponent.setState

#### Defined in

node_modules/@types/react/index.d.ts:491

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

| Name          | Type                                                                                                 |
| :------------ | :--------------------------------------------------------------------------------------------------- |
| `nextProps`   | `Readonly`<[`InputProviderProps`](../modules/kui_shell_plugin_client_common.md#inputproviderprops)\> |
| `nextState`   | `Readonly`<`S`\>                                                                                     |
| `nextContext` | `any`                                                                                                |

#### Returns

`boolean`

#### Inherited from

React.PureComponent.shouldComponentUpdate

#### Defined in

node_modules/@types/react/index.d.ts:636

---

### sourceRef

▸ `Private` **sourceRef**(): `Element`

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:307](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L307)

---

### status

▸ `Protected` **status**(): `void`

rendered to the left of the input element

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx:197](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Views/Terminal/Block/Input.tsx#L197)
