[Kui API Documentation - v11.0.0](../README.md) / [@kui-shell/test](../modules/kui_shell_test.md) / [Common](../modules/kui_shell_test.Common.md) / ISuite

# Interface: ISuite

[@kui-shell/test](../modules/kui_shell_test.md).[Common](../modules/kui_shell_test.Common.md).ISuite

## Hierarchy

- `Suite`

  ↳ **`ISuite`**

## Table of contents

### Properties

- [\_kuiDestroyAfter](kui_shell_test.Common.ISuite.md#_kuidestroyafter)
- [app](kui_shell_test.Common.ISuite.md#app)
- [ctx](kui_shell_test.Common.ISuite.md#ctx)
- [delayed](kui_shell_test.Common.ISuite.md#delayed)
- [file](kui_shell_test.Common.ISuite.md#file)
- [parent](kui_shell_test.Common.ISuite.md#parent)
- [pending](kui_shell_test.Common.ISuite.md#pending)
- [root](kui_shell_test.Common.ISuite.md#root)
- [suites](kui_shell_test.Common.ISuite.md#suites)
- [tests](kui_shell_test.Common.ISuite.md#tests)
- [title](kui_shell_test.Common.ISuite.md#title)

### Methods

- [\_createHook](kui_shell_test.Common.ISuite.md#_createhook)
- [addListener](kui_shell_test.Common.ISuite.md#addlistener)
- [addSuite](kui_shell_test.Common.ISuite.md#addsuite)
- [addTest](kui_shell_test.Common.ISuite.md#addtest)
- [afterAll](kui_shell_test.Common.ISuite.md#afterall)
- [afterEach](kui_shell_test.Common.ISuite.md#aftereach)
- [bail](kui_shell_test.Common.ISuite.md#bail)
- [beforeAll](kui_shell_test.Common.ISuite.md#beforeall)
- [beforeEach](kui_shell_test.Common.ISuite.md#beforeeach)
- [clone](kui_shell_test.Common.ISuite.md#clone)
- [dispose](kui_shell_test.Common.ISuite.md#dispose)
- [eachTest](kui_shell_test.Common.ISuite.md#eachtest)
- [emit](kui_shell_test.Common.ISuite.md#emit)
- [eventNames](kui_shell_test.Common.ISuite.md#eventnames)
- [fullTitle](kui_shell_test.Common.ISuite.md#fulltitle)
- [getMaxListeners](kui_shell_test.Common.ISuite.md#getmaxlisteners)
- [isPending](kui_shell_test.Common.ISuite.md#ispending)
- [listenerCount](kui_shell_test.Common.ISuite.md#listenercount)
- [listeners](kui_shell_test.Common.ISuite.md#listeners)
- [off](kui_shell_test.Common.ISuite.md#off)
- [on](kui_shell_test.Common.ISuite.md#on)
- [once](kui_shell_test.Common.ISuite.md#once)
- [prependListener](kui_shell_test.Common.ISuite.md#prependlistener)
- [prependOnceListener](kui_shell_test.Common.ISuite.md#prependoncelistener)
- [rawListeners](kui_shell_test.Common.ISuite.md#rawlisteners)
- [removeAllListeners](kui_shell_test.Common.ISuite.md#removealllisteners)
- [removeListener](kui_shell_test.Common.ISuite.md#removelistener)
- [retries](kui_shell_test.Common.ISuite.md#retries)
- [run](kui_shell_test.Common.ISuite.md#run)
- [setMaxListeners](kui_shell_test.Common.ISuite.md#setmaxlisteners)
- [slow](kui_shell_test.Common.ISuite.md#slow)
- [timeout](kui_shell_test.Common.ISuite.md#timeout)
- [titlePath](kui_shell_test.Common.ISuite.md#titlepath)
- [total](kui_shell_test.Common.ISuite.md#total)

## Properties

### \_kuiDestroyAfter

• `Optional` **\_kuiDestroyAfter**: `boolean`

#### Defined in

[packages/test/src/api/common.ts:44](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/common.ts#L44)

---

### app

• **app**: `Application`

#### Defined in

[packages/test/src/api/common.ts:43](https://github.com/kubernetes-sigs/kui/blob/kui/packages/test/src/api/common.ts#L43)

---

### ctx

• **ctx**: `Context`

#### Inherited from

Suite.ctx

#### Defined in

node_modules/@types/mocha/index.d.ts:1766

---

### delayed

• **delayed**: `boolean`

#### Inherited from

Suite.delayed

#### Defined in

node_modules/@types/mocha/index.d.ts:1772

---

### file

• `Optional` **file**: `string`

#### Inherited from

Suite.file

#### Defined in

node_modules/@types/mocha/index.d.ts:1770

---

### parent

• **parent**: `Suite`

#### Inherited from

Suite.parent

#### Defined in

node_modules/@types/mocha/index.d.ts:1773

---

### pending

• **pending**: `boolean`

#### Inherited from

Suite.pending

#### Defined in

node_modules/@types/mocha/index.d.ts:1769

---

### root

• **root**: `boolean`

#### Inherited from

Suite.root

#### Defined in

node_modules/@types/mocha/index.d.ts:1771

---

### suites

• **suites**: `Suite`[]

#### Inherited from

Suite.suites

#### Defined in

node_modules/@types/mocha/index.d.ts:1767

---

### tests

• **tests**: `Test`[]

#### Inherited from

Suite.tests

#### Defined in

node_modules/@types/mocha/index.d.ts:1768

---

### title

• **title**: `string`

#### Inherited from

Suite.title

#### Defined in

node_modules/@types/mocha/index.d.ts:1774

## Methods

### \_createHook

▸ `Protected` **\_createHook**(`title`, `fn?`): `Hook`

Generic hook-creator.

#### Parameters

| Name    | Type                  |
| :------ | :-------------------- |
| `title` | `string`              |
| `fn?`   | `Func` \| `AsyncFunc` |

#### Returns

`Hook`

#### Inherited from

Suite.\_createHook

#### Defined in

node_modules/@types/mocha/index.d.ts:2029

---

### addListener

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeAll"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2036

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterAll"`               |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2047

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeEach"`             |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2058

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterEach"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2069

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                         |
| :--------- | :--------------------------- |
| `event`    | `"suite"`                    |
| `listener` | (`suite`: `Suite`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2080

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"test"`                   |
| `listener` | (`test`: `Test`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2091

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"run"`      |
| `listener` | () => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2102

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"pre-require"`                                                           |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2113

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                            |
| :--------- | :-------------------------------------------------------------- |
| `event`    | `"require"`                                                     |
| `listener` | (`module`: `any`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2124

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"post-require"`                                                          |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2135

▸ **addListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string`                       |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2146

---

### addSuite

▸ **addSuite**(`suite`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Add a test `suite`.

**`see`** https://mochajs.org/api/Mocha.Suite.html#addSuite

#### Parameters

| Name    | Type    |
| :------ | :------ |
| `suite` | `Suite` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addSuite

#### Defined in

node_modules/@types/mocha/index.d.ts:1972

---

### addTest

▸ **addTest**(`test`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Add a `test` to this suite.

**`see`** https://mochajs.org/api/Mocha.Suite.html#addTest

#### Parameters

| Name   | Type   |
| :----- | :----- |
| `test` | `Test` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.addTest

#### Defined in

node_modules/@types/mocha/index.d.ts:1979

---

### afterAll

▸ **afterAll**(`fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` after running tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#afterAll

#### Parameters

| Name  | Type   |
| :---- | :----- |
| `fn?` | `Func` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.afterAll

#### Defined in

node_modules/@types/mocha/index.d.ts:1888

▸ **afterAll**(`fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` after running tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#afterAll

#### Parameters

| Name  | Type        |
| :---- | :---------- |
| `fn?` | `AsyncFunc` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.afterAll

#### Defined in

node_modules/@types/mocha/index.d.ts:1895

▸ **afterAll**(`title`, `fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` after running tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#afterAll

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `title` | `string` |
| `fn?`   | `Func`   |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.afterAll

#### Defined in

node_modules/@types/mocha/index.d.ts:1902

▸ **afterAll**(`title`, `fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` after running tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#afterAll

#### Parameters

| Name    | Type        |
| :------ | :---------- |
| `title` | `string`    |
| `fn?`   | `AsyncFunc` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.afterAll

#### Defined in

node_modules/@types/mocha/index.d.ts:1909

---

### afterEach

▸ **afterEach**(`fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` after each test case.

**`see`** https://mochajs.org/api/Mocha.Suite.html#afterEach

#### Parameters

| Name  | Type   |
| :---- | :----- |
| `fn?` | `Func` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.afterEach

#### Defined in

node_modules/@types/mocha/index.d.ts:1944

▸ **afterEach**(`fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` after each test case.

**`see`** https://mochajs.org/api/Mocha.Suite.html#afterEach

#### Parameters

| Name  | Type        |
| :---- | :---------- |
| `fn?` | `AsyncFunc` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.afterEach

#### Defined in

node_modules/@types/mocha/index.d.ts:1951

▸ **afterEach**(`title`, `fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` after each test case.

**`see`** https://mochajs.org/api/Mocha.Suite.html#afterEach

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `title` | `string` |
| `fn?`   | `Func`   |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.afterEach

#### Defined in

node_modules/@types/mocha/index.d.ts:1958

▸ **afterEach**(`title`, `fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` after each test case.

**`see`** https://mochajs.org/api/Mocha.Suite.html#afterEach

#### Parameters

| Name    | Type        |
| :------ | :---------- |
| `title` | `string`    |
| `fn?`   | `AsyncFunc` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.afterEach

#### Defined in

node_modules/@types/mocha/index.d.ts:1965

---

### bail

▸ **bail**(): `boolean`

Get whether to bail after first error.

**`see`** https://mochajs.org/api/Mocha.Suite.html#bail

#### Returns

`boolean`

#### Inherited from

Suite.bail

#### Defined in

node_modules/@types/mocha/index.d.ts:1839

▸ **bail**(`bail`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Set whether to bail after first error.

**`see`** https://mochajs.org/api/Mocha.Suite.html#bail

#### Parameters

| Name   | Type      |
| :----- | :-------- |
| `bail` | `boolean` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.bail

#### Defined in

node_modules/@types/mocha/index.d.ts:1846

---

### beforeAll

▸ **beforeAll**(`fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` before running tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#beforeAll

#### Parameters

| Name  | Type   |
| :---- | :----- |
| `fn?` | `Func` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.beforeAll

#### Defined in

node_modules/@types/mocha/index.d.ts:1860

▸ **beforeAll**(`fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` before running tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#beforeAll

#### Parameters

| Name  | Type        |
| :---- | :---------- |
| `fn?` | `AsyncFunc` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.beforeAll

#### Defined in

node_modules/@types/mocha/index.d.ts:1867

▸ **beforeAll**(`title`, `fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` before running tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#beforeAll

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `title` | `string` |
| `fn?`   | `Func`   |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.beforeAll

#### Defined in

node_modules/@types/mocha/index.d.ts:1874

▸ **beforeAll**(`title`, `fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` before running tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#beforeAll

#### Parameters

| Name    | Type        |
| :------ | :---------- |
| `title` | `string`    |
| `fn?`   | `AsyncFunc` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.beforeAll

#### Defined in

node_modules/@types/mocha/index.d.ts:1881

---

### beforeEach

▸ **beforeEach**(`fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` before each test case.

**`see`** https://mochajs.org/api/Mocha.Suite.html#beforeEach

#### Parameters

| Name  | Type   |
| :---- | :----- |
| `fn?` | `Func` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.beforeEach

#### Defined in

node_modules/@types/mocha/index.d.ts:1916

▸ **beforeEach**(`fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` before each test case.

**`see`** https://mochajs.org/api/Mocha.Suite.html#beforeEach

#### Parameters

| Name  | Type        |
| :---- | :---------- |
| `fn?` | `AsyncFunc` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.beforeEach

#### Defined in

node_modules/@types/mocha/index.d.ts:1923

▸ **beforeEach**(`title`, `fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` before each test case.

**`see`** https://mochajs.org/api/Mocha.Suite.html#beforeEach

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `title` | `string` |
| `fn?`   | `Func`   |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.beforeEach

#### Defined in

node_modules/@types/mocha/index.d.ts:1930

▸ **beforeEach**(`title`, `fn?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Run `fn(test[, done])` before each test case.

**`see`** https://mochajs.org/api/Mocha.Suite.html#beforeEach

#### Parameters

| Name    | Type        |
| :------ | :---------- |
| `title` | `string`    |
| `fn?`   | `AsyncFunc` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.beforeEach

#### Defined in

node_modules/@types/mocha/index.d.ts:1937

---

### clone

▸ **clone**(): `Suite`

Return a clone of this `Suite`.

**`see`** https://mochajs.org/api/Mocha.Suite.html#clone

#### Returns

`Suite`

#### Inherited from

Suite.clone

#### Defined in

node_modules/@types/mocha/index.d.ts:1790

---

### dispose

▸ **dispose**(): `void`

Cleans all references from this suite and all child suites.

https://mochajs.org/api/suite#dispose

#### Returns

`void`

#### Inherited from

Suite.dispose

#### Defined in

node_modules/@types/mocha/index.d.ts:1986

---

### eachTest

▸ **eachTest**(`fn`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Iterates through each suite recursively to find all tests. Applies a
function in the format `fn(test)`.

**`see`** https://mochajs.org/api/Mocha.Suite.html#eachTest

#### Parameters

| Name | Type                       |
| :--- | :------------------------- |
| `fn` | (`test`: `Test`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.eachTest

#### Defined in

node_modules/@types/mocha/index.d.ts:2017

---

### emit

▸ **emit**(`name`, `hook`): `boolean`

#### Parameters

| Name   | Type          |
| :----- | :------------ |
| `name` | `"beforeAll"` |
| `hook` | `Hook`        |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2040

▸ **emit**(`name`, `hook`): `boolean`

#### Parameters

| Name   | Type         |
| :----- | :----------- |
| `name` | `"afterAll"` |
| `hook` | `Hook`       |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2051

▸ **emit**(`name`, `hook`): `boolean`

#### Parameters

| Name   | Type           |
| :----- | :------------- |
| `name` | `"beforeEach"` |
| `hook` | `Hook`         |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2062

▸ **emit**(`name`, `hook`): `boolean`

#### Parameters

| Name   | Type          |
| :----- | :------------ |
| `name` | `"afterEach"` |
| `hook` | `Hook`        |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2073

▸ **emit**(`name`, `suite`): `boolean`

#### Parameters

| Name    | Type      |
| :------ | :-------- |
| `name`  | `"suite"` |
| `suite` | `Suite`   |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2084

▸ **emit**(`name`, `test`): `boolean`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `name` | `"test"` |
| `test` | `Test`   |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2095

▸ **emit**(`name`): `boolean`

#### Parameters

| Name   | Type    |
| :----- | :------ |
| `name` | `"run"` |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2106

▸ **emit**(`name`, `context`, `file`, `mocha`): `boolean`

#### Parameters

| Name      | Type            |
| :-------- | :-------------- |
| `name`    | `"pre-require"` |
| `context` | `MochaGlobals`  |
| `file`    | `string`        |
| `mocha`   | `Mocha`         |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2117

▸ **emit**(`name`, `module`, `file`, `mocha`): `boolean`

#### Parameters

| Name     | Type        |
| :------- | :---------- |
| `name`   | `"require"` |
| `module` | `any`       |
| `file`   | `string`    |
| `mocha`  | `Mocha`     |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2128

▸ **emit**(`name`, `context`, `file`, `mocha`): `boolean`

#### Parameters

| Name      | Type             |
| :-------- | :--------------- |
| `name`    | `"post-require"` |
| `context` | `MochaGlobals`   |
| `file`    | `string`         |
| `mocha`   | `Mocha`          |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2139

▸ **emit**(`name`, ...`args`): `boolean`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `name`    | `string` |
| `...args` | `any`[]  |

#### Returns

`boolean`

#### Inherited from

Suite.emit

#### Defined in

node_modules/@types/mocha/index.d.ts:2150

---

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

Suite.eventNames

#### Defined in

node_modules/@types/node/globals.d.ts:633

---

### fullTitle

▸ **fullTitle**(): `string`

Return the full title generated by recursively concatenating the parent's
full title.

**`see`** https://mochajs.org/api/Mocha.Suite.html#.Suite#fullTitle

#### Returns

`string`

#### Inherited from

Suite.fullTitle

#### Defined in

node_modules/@types/mocha/index.d.ts:1994

---

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

Suite.getMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:625

---

### isPending

▸ **isPending**(): `boolean`

Check if this suite or its parent suite is marked as pending.

**`see`** https://mochajs.org/api/Mocha.Suite.html#isPending

#### Returns

`boolean`

#### Inherited from

Suite.isPending

#### Defined in

node_modules/@types/mocha/index.d.ts:1853

---

### listenerCount

▸ **listenerCount**(`type`): `number`

#### Parameters

| Name   | Type                 |
| :----- | :------------------- |
| `type` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

Suite.listenerCount

#### Defined in

node_modules/@types/node/globals.d.ts:629

---

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name    | Type                 |
| :------ | :------------------- |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

Suite.listeners

#### Defined in

node_modules/@types/node/globals.d.ts:626

---

### off

▸ **off**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string` \| `symbol`           |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.off

#### Defined in

node_modules/@types/node/globals.d.ts:622

---

### on

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeAll"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2034

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterAll"`               |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2045

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeEach"`             |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2056

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterEach"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2067

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                         |
| :--------- | :--------------------------- |
| `event`    | `"suite"`                    |
| `listener` | (`suite`: `Suite`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2078

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"test"`                   |
| `listener` | (`test`: `Test`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2089

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"run"`      |
| `listener` | () => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2100

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"pre-require"`                                                           |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2111

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                            |
| :--------- | :-------------------------------------------------------------- |
| `event`    | `"require"`                                                     |
| `listener` | (`module`: `any`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2122

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"post-require"`                                                          |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2133

▸ **on**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string`                       |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.on

#### Defined in

node_modules/@types/mocha/index.d.ts:2144

---

### once

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeAll"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2035

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterAll"`               |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2046

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeEach"`             |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2057

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterEach"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2068

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                         |
| :--------- | :--------------------------- |
| `event`    | `"suite"`                    |
| `listener` | (`suite`: `Suite`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2079

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"test"`                   |
| `listener` | (`test`: `Test`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2090

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"run"`      |
| `listener` | () => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2101

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"pre-require"`                                                           |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2112

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                            |
| :--------- | :-------------------------------------------------------------- |
| `event`    | `"require"`                                                     |
| `listener` | (`module`: `any`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2123

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"post-require"`                                                          |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2134

▸ **once**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string`                       |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.once

#### Defined in

node_modules/@types/mocha/index.d.ts:2145

---

### prependListener

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeAll"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2038

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterAll"`               |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2049

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeEach"`             |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2060

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterEach"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2071

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                         |
| :--------- | :--------------------------- |
| `event`    | `"suite"`                    |
| `listener` | (`suite`: `Suite`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2082

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"test"`                   |
| `listener` | (`test`: `Test`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2093

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"run"`      |
| `listener` | () => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2104

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"pre-require"`                                                           |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2115

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                            |
| :--------- | :-------------------------------------------------------------- |
| `event`    | `"require"`                                                     |
| `listener` | (`module`: `any`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2126

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"post-require"`                                                          |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2137

▸ **prependListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string`                       |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2148

---

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeAll"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2039

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterAll"`               |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2050

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeEach"`             |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2061

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterEach"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2072

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                         |
| :--------- | :--------------------------- |
| `event`    | `"suite"`                    |
| `listener` | (`suite`: `Suite`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2083

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"test"`                   |
| `listener` | (`test`: `Test`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2094

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"run"`      |
| `listener` | () => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2105

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"pre-require"`                                                           |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2116

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                            |
| :--------- | :-------------------------------------------------------------- |
| `event`    | `"require"`                                                     |
| `listener` | (`module`: `any`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2127

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"post-require"`                                                          |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2138

▸ **prependOnceListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string`                       |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.prependOnceListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2149

---

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name    | Type                 |
| :------ | :------------------- |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

Suite.rawListeners

#### Defined in

node_modules/@types/node/globals.d.ts:627

---

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name     | Type                 |
| :------- | :------------------- |
| `event?` | `string` \| `symbol` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeAllListeners

#### Defined in

node_modules/@types/node/globals.d.ts:623

---

### removeListener

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeAll"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2037

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterAll"`               |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2048

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"beforeEach"`             |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2059

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"afterEach"`              |
| `listener` | (`hook`: `Hook`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2070

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                         |
| :--------- | :--------------------------- |
| `event`    | `"suite"`                    |
| `listener` | (`suite`: `Suite`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2081

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"test"`                   |
| `listener` | (`test`: `Test`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2092

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"run"`      |
| `listener` | () => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2103

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"pre-require"`                                                           |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2114

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                            |
| :--------- | :-------------------------------------------------------------- |
| `event`    | `"require"`                                                     |
| `listener` | (`module`: `any`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2125

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                                                                      |
| :--------- | :------------------------------------------------------------------------ |
| `event`    | `"post-require"`                                                          |
| `listener` | (`context`: `MochaGlobals`, `file`: `string`, `mocha`: `Mocha`) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2136

▸ **removeListener**(`event`, `listener`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `string`                       |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.removeListener

#### Defined in

node_modules/@types/mocha/index.d.ts:2147

---

### retries

▸ **retries**(): `number`

Get number of times to retry a failed test.

**`see`** https://mochajs.org/api/Mocha.Suite.html#retries

#### Returns

`number`

#### Inherited from

Suite.retries

#### Defined in

node_modules/@types/mocha/index.d.ts:1811

▸ **retries**(`n`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Set number of times to retry a failed test.

**`see`** https://mochajs.org/api/Mocha.Suite.html#retries

#### Parameters

| Name | Type                 |
| :--- | :------------------- |
| `n`  | `string` \| `number` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.retries

#### Defined in

node_modules/@types/mocha/index.d.ts:1818

---

### run

▸ **run**(): `void`

This will run the root suite if we happen to be running in delayed mode.

**`see`** https://mochajs.org/api/Mocha.Suite.html#run

#### Returns

`void`

#### Inherited from

Suite.run

#### Defined in

node_modules/@types/mocha/index.d.ts:2024

---

### setMaxListeners

▸ **setMaxListeners**(`n`): [`ISuite`](kui_shell_test.Common.ISuite.md)

#### Parameters

| Name | Type     |
| :--- | :------- |
| `n`  | `number` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.setMaxListeners

#### Defined in

node_modules/@types/node/globals.d.ts:624

---

### slow

▸ **slow**(): `number`

Get slow `ms`.

**`see`** https://mochajs.org/api/Mocha.Suite.html#slow

#### Returns

`number`

#### Inherited from

Suite.slow

#### Defined in

node_modules/@types/mocha/index.d.ts:1825

▸ **slow**(`ms`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Set slow `ms` or short-hand such as "2s".

**`see`** https://mochajs.org/api/Mocha.Suite.html#slow

#### Parameters

| Name | Type                 |
| :--- | :------------------- |
| `ms` | `string` \| `number` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.slow

#### Defined in

node_modules/@types/mocha/index.d.ts:1832

---

### timeout

▸ **timeout**(): `number`

Get timeout `ms`.

**`see`** https://mochajs.org/api/Mocha.Suite.html#timeout

#### Returns

`number`

#### Inherited from

Suite.timeout

#### Defined in

node_modules/@types/mocha/index.d.ts:1797

▸ **timeout**(`ms`): [`ISuite`](kui_shell_test.Common.ISuite.md)

Set timeout `ms` or short-hand such as "2s".

**`see`** https://mochajs.org/api/Mocha.Suite.html#timeout

#### Parameters

| Name | Type                 |
| :--- | :------------------- |
| `ms` | `string` \| `number` |

#### Returns

[`ISuite`](kui_shell_test.Common.ISuite.md)

#### Inherited from

Suite.timeout

#### Defined in

node_modules/@types/mocha/index.d.ts:1804

---

### titlePath

▸ **titlePath**(): `string`[]

Return the title path generated by recursively concatenating the parent's
title path.

**`see`** https://mochajs.org/api/Mocha.Suite.html#.Suite#titlePath

#### Returns

`string`[]

#### Inherited from

Suite.titlePath

#### Defined in

node_modules/@types/mocha/index.d.ts:2002

---

### total

▸ **total**(): `number`

Return the total number of tests.

**`see`** https://mochajs.org/api/Mocha.Suite.html#.Suite#total

#### Returns

`number`

#### Inherited from

Suite.total

#### Defined in

node_modules/@types/mocha/index.d.ts:2009
