[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md) / TabContent

# Class: TabContent

[@kui-shell/plugin-client-common](../modules/kui_shell_plugin_client_common.md).TabContent

TabContent
---------------- <Tab/> from here down
| ST | |
| | |
| | |
| | |
| | |
| | |

---

ST: <ScrollableTerminal/>

## Hierarchy

- `PureComponent`<`Props`, `State`\>

  ↳ **`TabContent`**

## Table of contents

### Constructors

- [constructor](kui_shell_plugin_client_common.TabContent.md#constructor)

### Properties

- [\_firstRenderDone](kui_shell_plugin_client_common.TabContent.md#_firstrenderdone)
- [activateHandlers](kui_shell_plugin_client_common.TabContent.md#activatehandlers)
- [cleaners](kui_shell_plugin_client_common.TabContent.md#cleaners)
- [context](kui_shell_plugin_client_common.TabContent.md#context)
- [props](kui_shell_plugin_client_common.TabContent.md#props)
- [refs](kui_shell_plugin_client_common.TabContent.md#refs)
- [state](kui_shell_plugin_client_common.TabContent.md#state)
- [contextType](kui_shell_plugin_client_common.TabContent.md#contexttype)

### Methods

- [UNSAFE_componentWillMount](kui_shell_plugin_client_common.TabContent.md#unsafe_componentwillmount)
- [UNSAFE_componentWillReceiveProps](kui_shell_plugin_client_common.TabContent.md#unsafe_componentwillreceiveprops)
- [UNSAFE_componentWillUpdate](kui_shell_plugin_client_common.TabContent.md#unsafe_componentwillupdate)
- [\_onClear](kui_shell_plugin_client_common.TabContent.md#_onclear)
- [\_resetSplitLayout](kui_shell_plugin_client_common.TabContent.md#_resetsplitlayout)
- [\_toggleAttribute](kui_shell_plugin_client_common.TabContent.md#_toggleattribute)
- [\_toggleBottomStripMode](kui_shell_plugin_client_common.TabContent.md#_togglebottomstripmode)
- [\_toggleLeftStripMode](kui_shell_plugin_client_common.TabContent.md#_toggleleftstripmode)
- [body](kui_shell_plugin_client_common.TabContent.md#body)
- [bottom](kui_shell_plugin_client_common.TabContent.md#bottom)
- [children](kui_shell_plugin_client_common.TabContent.md#children)
- [componentDidCatch](kui_shell_plugin_client_common.TabContent.md#componentdidcatch)
- [componentDidMount](kui_shell_plugin_client_common.TabContent.md#componentdidmount)
- [componentDidUpdate](kui_shell_plugin_client_common.TabContent.md#componentdidupdate)
- [componentWillMount](kui_shell_plugin_client_common.TabContent.md#componentwillmount)
- [componentWillReceiveProps](kui_shell_plugin_client_common.TabContent.md#componentwillreceiveprops)
- [componentWillUnmount](kui_shell_plugin_client_common.TabContent.md#componentwillunmount)
- [componentWillUpdate](kui_shell_plugin_client_common.TabContent.md#componentwillupdate)
- [defaultLoading](kui_shell_plugin_client_common.TabContent.md#defaultloading)
- [forceUpdate](kui_shell_plugin_client_common.TabContent.md#forceupdate)
- [getSnapshotBeforeUpdate](kui_shell_plugin_client_common.TabContent.md#getsnapshotbeforeupdate)
- [graft](kui_shell_plugin_client_common.TabContent.md#graft)
- [initTab](kui_shell_plugin_client_common.TabContent.md#inittab)
- [onOffline](kui_shell_plugin_client_common.TabContent.md#onoffline)
- [oneTimeInit](kui_shell_plugin_client_common.TabContent.md#onetimeinit)
- [proxyDisconnectNotice](kui_shell_plugin_client_common.TabContent.md#proxydisconnectnotice)
- [render](kui_shell_plugin_client_common.TabContent.md#render)
- [setEditMode](kui_shell_plugin_client_common.TabContent.md#seteditmode)
- [setState](kui_shell_plugin_client_common.TabContent.md#setstate)
- [shouldComponentUpdate](kui_shell_plugin_client_common.TabContent.md#shouldcomponentupdate)
- [tabClassName](kui_shell_plugin_client_common.TabContent.md#tabclassname)
- [terminal](kui_shell_plugin_client_common.TabContent.md#terminal)
- [toggleEditMode](kui_shell_plugin_client_common.TabContent.md#toggleeditmode)
- [delayedFocus](kui_shell_plugin_client_common.TabContent.md#delayedfocus)
- [getDerivedStateFromProps](kui_shell_plugin_client_common.TabContent.md#getderivedstatefromprops)
- [onSessionInitError](kui_shell_plugin_client_common.TabContent.md#onsessioniniterror)

## Constructors

### constructor

• **new TabContent**(`props`)

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `props` | `Props` |

#### Overrides

React.PureComponent&lt;Props, State\&gt;.constructor

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:113](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L113)

## Properties

### \_firstRenderDone

• `Private` **\_firstRenderDone**: `boolean` = `false`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:94](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L94)

---

### activateHandlers

• `Private` **activateHandlers**: (`isActive`: `boolean`) => `void`[] = `[]`

switching back or away from this tab

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:99](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L99)

---

### cleaners

• `Private` `Readonly` **cleaners**: `Cleaner`[] = `[]`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:96](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L96)

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

• `Readonly` **props**: `Readonly`<`Props`\> & `Readonly`<{ `children?`: `ReactNode` }\>

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

• **state**: `Readonly`<`State`\>

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

| Name          | Type                 |
| :------------ | :------------------- |
| `nextProps`   | `Readonly`<`Props`\> |
| `nextContext` | `any`                |

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

node_modules/@types/react/index.d.ts:777

---

### \_onClear

▸ `Private` `Readonly` **\_onClear**(): `void`

Request to clear the contents of the ScrollableTerminal

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:314](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L314)

---

### \_resetSplitLayout

▸ `Private` `Readonly` **\_resetSplitLayout**(): `void`

Reset any notion of left strip etc.

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:297](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L297)

---

### \_toggleAttribute

▸ `Private` `Readonly` **\_toggleAttribute**(`attr`): `void`

Toggle attribute on Tab DOM

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `attr` | `string` |

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:307](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L307)

---

### \_toggleBottomStripMode

▸ `Private` `Readonly` **\_toggleBottomStripMode**(): `void`

Enter/exit mode where one split is displayed along the bottom

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:303](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L303)

---

### \_toggleLeftStripMode

▸ `Private` `Readonly` **\_toggleLeftStripMode**(): `void`

Enter/exit mode where one split is displayed along the left

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:300](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L300)

---

### body

▸ `Private` **body**(): `Element`

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:414](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L414)

---

### bottom

▸ `Private` **bottom**(): `ReactElement`<`WithTabUUID` & `WithTab`<`Tab`\>, `string` \| `JSXElementConstructor`<`any`\>\>

Graft on the tab uuid

#### Returns

`ReactElement`<`WithTabUUID` & `WithTab`<`Tab`\>, `string` \| `JSXElementConstructor`<`any`\>\>

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:393](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L393)

---

### children

▸ `Private` **children**(): `Object`

Graft on the REPL focus management

#### Returns

`Object`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:384](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L384)

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

▸ **componentDidMount**(): `void`

#### Returns

`void`

#### Overrides

React.PureComponent.componentDidMount

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:151](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L151)

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

| Name          | Type                 |
| :------------ | :------------------- |
| `nextProps`   | `Readonly`<`Props`\> |
| `nextContext` | `any`                |

#### Returns

`void`

#### Inherited from

React.PureComponent.componentWillReceiveProps

#### Defined in

node_modules/@types/react/index.d.ts:732

---

### componentWillUnmount

▸ **componentWillUnmount**(): `void`

#### Returns

`void`

#### Overrides

React.PureComponent.componentWillUnmount

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:286](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L286)

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

node_modules/@types/react/index.d.ts:762

---

### defaultLoading

▸ `Private` **defaultLoading**(): `string`

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:291](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L291)

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

| Name        | Type                 |
| :---------- | :------------------- |
| `prevProps` | `Readonly`<`Props`\> |
| `prevState` | `Readonly`<`State`\> |

#### Returns

`any`

#### Inherited from

React.PureComponent.getSnapshotBeforeUpdate

#### Defined in

node_modules/@types/react/index.d.ts:682

---

### graft

▸ `Private` **graft**(`node`, `key?`): `Object`

#### Parameters

| Name   | Type        |
| :----- | :---------- |
| `node` | `ReactNode` |
| `key?` | `number`    |

#### Returns

`Object`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:370](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L370)

---

### initTab

▸ `Private` **initTab**(`tab`): `void`

#### Parameters

| Name  | Type  |
| :---- | :---- |
| `tab` | `Tab` |

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:237](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L237)

---

### onOffline

▸ `Private` **onOffline**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:192](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L192)

---

### oneTimeInit

▸ `Private` **oneTimeInit**(): `Object`

#### Returns

`Object`

| Name          | Type     |
| :------------ | :------- |
| `sessionInit` | `string` |

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:210](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L210)

---

### proxyDisconnectNotice

▸ `Private` **proxyDisconnectNotice**(): `Element`

Use client-provided (or default) proxy disconnected notice, if warranted

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:352](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L352)

---

### render

▸ **render**(): `Element`

#### Returns

`Element`

#### Overrides

React.PureComponent.render

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:451](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L451)

---

### setEditMode

▸ `Private` `Readonly` **setEditMode**(`value`): () => `void`

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `value` | `boolean` |

#### Returns

`fn`

▸ (): `void`

##### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:107](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L107)

---

### setState

▸ **setState**<`K`\>(`state`, `callback?`): `void`

#### Type parameters

| Name | Type                                                                                                                                                                                                           |
| :--- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `K`  | extends `"active"` \| keyof `WithTab`<`RefObject`<`Tab`\>\> \| `"sessionInit"` \| `"sessionInitError"` \| `"showSessionInitDone"` \| `"hasLeftStrip"` \| `"hasBottomStrip"` \| `"_terminal"` \| `"mutability"` |

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

node_modules/@types/react/index.d.ts:636

---

### tabClassName

▸ `Private` **tabClassName**(): `string`

Construct the `className` property of the tab element

#### Returns

`string`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:406](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L406)

---

### terminal

▸ `Private` **terminal**(): `Element`

#### Returns

`Element`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:323](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L323)

---

### toggleEditMode

▸ `Private` `Readonly` **toggleEditMode**(): `void`

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:101](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L101)

---

### delayedFocus

▸ `Static` **delayedFocus**(`state`, `delayMillis?`): `void`

#### Parameters

| Name          | Type     | Default value |
| :------------ | :------- | :------------ |
| `state`       | `State`  | `undefined`   |
| `delayMillis` | `number` | `300`         |

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:141](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L141)

---

### getDerivedStateFromProps

▸ `Static` **getDerivedStateFromProps**(`props`, `state`): `State`

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `props` | `Props` |
| `state` | `State` |

#### Returns

`State`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:128](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L128)

---

### onSessionInitError

▸ `Static` `Private` **onSessionInitError**(`uuid`, `sessionInitError`): `void`

#### Parameters

| Name               | Type     |
| :----------------- | :------- |
| `uuid`             | `string` |
| `sessionInitError` | `Error`  |

#### Returns

`void`

#### Defined in

[plugins/plugin-client-common/src/components/Client/TabContent.tsx:206](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-client-common/src/components/Client/TabContent.tsx#L206)
