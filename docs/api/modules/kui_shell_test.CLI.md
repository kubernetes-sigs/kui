[Kui API Documentation - v10.8.0](../README.md) / [@kui-shell/test](kui_shell_test.md) / CLI

# Namespace: CLI

[@kui-shell/test](kui_shell_test.md).CLI

## Table of contents

### Variables

- [timeout](kui_shell_test.CLI.md#timeout)
- [waitTimeout](kui_shell_test.CLI.md#waittimeout)

### Functions

- [command](kui_shell_test.CLI.md#command)
- [commandInSplit](kui_shell_test.CLI.md#commandinsplit)
- [exitCode](kui_shell_test.CLI.md#exitcode)
- [expandLast](kui_shell_test.CLI.md#expandlast)
- [expandNth](kui_shell_test.CLI.md#expandnth)
- [expectInput](kui_shell_test.CLI.md#expectinput)
- [expectInputContext](kui_shell_test.CLI.md#expectinputcontext)
- [expectPriorInput](kui_shell_test.CLI.md#expectpriorinput)
- [getTextContent](kui_shell_test.CLI.md#gettextcontent)
- [grabFocus](kui_shell_test.CLI.md#grabfocus)
- [lastBlock](kui_shell_test.CLI.md#lastblock)
- [makeCustom](kui_shell_test.CLI.md#makecustom)
- [nOfCurrentBlock](kui_shell_test.CLI.md#nofcurrentblock)
- [paste](kui_shell_test.CLI.md#paste)
- [waitForRepl](kui_shell_test.CLI.md#waitforrepl)
- [waitForSession](kui_shell_test.CLI.md#waitforsession)

## Variables

### timeout

• **timeout**: `number`

#### Defined in

[packages/test/src/api/cli.ts:24](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L24)

---

### waitTimeout

• **waitTimeout**: `number`

#### Defined in

[packages/test/src/api/cli.ts:25](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L25)

## Functions

### command

▸ `Const` **command**(`cmd`, `app`, `noNewline?`, `noCopyPaste?`, `noFocus?`, `block?`, `currentPrompt?`): `Promise`<`Object`\>

Execute a CLI command, and return the data-input-count of that command

#### Parameters

| Name            | Type          | Default value |
| :-------------- | :------------ | :------------ |
| `cmd`           | `string`      | `undefined`   |
| `app`           | `Application` | `undefined`   |
| `noNewline`     | `boolean`     | `false`       |
| `noCopyPaste`   | `boolean`     | `undefined`   |
| `noFocus`       | `boolean`     | `false`       |
| `block`         | `string`      | `undefined`   |
| `currentPrompt` | `string`      | `undefined`   |

#### Returns

`Promise`<`Object`\>

#### Defined in

[packages/test/src/api/cli.ts:56](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L56)

---

### commandInSplit

▸ `Const` **commandInSplit**(`cmd`, `app`, `splitIndex`): `Promise`<{ `app`: `Application` = app; `count`: `number` } & { `splitIndex`: `number` }\>

Execute the given command in the given split

#### Parameters

| Name         | Type          |
| :----------- | :------------ |
| `cmd`        | `string`      |
| `app`        | `Application` |
| `splitIndex` | `number`      |

#### Returns

`Promise`<{ `app`: `Application` = app; `count`: `number` } & { `splitIndex`: `number` }\>

#### Defined in

[packages/test/src/api/cli.ts:102](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L102)

---

### exitCode

▸ `Const` **exitCode**(`statusCode`): `string` \| `number`

Exit code code for the given http status code; this is an identity function; for headless mode, there is the -256 part.
See headless.js for the analogous headless implementation.

#### Parameters

| Name         | Type                 |
| :----------- | :------------------- |
| `statusCode` | `string` \| `number` |

#### Returns

`string` \| `number`

#### Defined in

[packages/test/src/api/cli.ts:179](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L179)

---

### expandLast

▸ **expandLast**(`app`, `splitIndex?`, `N?`): `Promise`<`void`\>

Click to expand the last replayed sample output

#### Parameters

| Name         | Type          | Default value |
| :----------- | :------------ | :------------ |
| `app`        | `Application` | `undefined`   |
| `splitIndex` | `number`      | `1`           |
| `N`          | `number`      | `1`           |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/cli.ts:244](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L244)

---

### expandNth

▸ **expandNth**(`app`, `N`, `splitIndex?`): `Promise`<`void`\>

Click to expand the last replayed sample output

#### Parameters

| Name         | Type          | Default value |
| :----------- | :------------ | :------------ |
| `app`        | `Application` | `undefined`   |
| `N`          | `number`      | `undefined`   |
| `splitIndex` | `number`      | `1`           |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/cli.ts:237](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L237)

---

### expectInput

▸ `Const` **expectInput**(`selector`, `expectedText`): (`app`: `Application`) => `Promise`<`Application`\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `selector`     | `string` |
| `expectedText` | `string` |

#### Returns

`fn`

▸ (`app`): `Promise`<`Application`\>

##### Parameters

| Name  | Type          |
| :---- | :------------ |
| `app` | `Application` |

##### Returns

`Promise`<`Application`\>

#### Defined in

[packages/test/src/api/cli.ts:181](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L181)

---

### expectInputContext

▸ **expectInputContext**(`res`, `N`, `expectedText`, `exact?`): `Promise`<`boolean`\>

text repl input context text

#### Parameters

| Name           | Type                                                                    | Default value |
| :------------- | :---------------------------------------------------------------------- | :------------ |
| `res`          | [`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md) | `undefined`   |
| `N`            | `number`                                                                | `undefined`   |
| `expectedText` | `string`                                                                | `undefined`   |
| `exact`        | `boolean`                                                               | `false`       |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[packages/test/src/api/cli.ts:193](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L193)

---

### expectPriorInput

▸ `Const` **expectPriorInput**(`selector`, `expectedText`): (`app`: `Application`) => `Promise`<`Application`\>

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `selector`     | `string` |
| `expectedText` | `string` |

#### Returns

`fn`

▸ (`app`): `Promise`<`Application`\>

##### Parameters

| Name  | Type          |
| :---- | :------------ |
| `app` | `Application` |

##### Returns

`Promise`<`Application`\>

#### Defined in

[packages/test/src/api/cli.ts:199](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L199)

---

### getTextContent

▸ `Const` **getTextContent**(`app`, `selector`): `Promise`<`string`\>

#### Parameters

| Name       | Type          |
| :--------- | :------------ |
| `app`      | `Application` |
| `selector` | `string`      |

#### Returns

`Promise`<`string`\>

#### Defined in

[packages/test/src/api/cli.ts:157](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L157)

---

### grabFocus

▸ `Const` **grabFocus**(`app`, `currentPromptBlock?`, `currentPrompt?`): `Promise`<`boolean` \| `void`\>

grab focus for the repl

#### Parameters

| Name                 | Type          |
| :------------------- | :------------ |
| `app`                | `Application` |
| `currentPromptBlock` | `string`      |
| `currentPrompt`      | `string`      |

#### Returns

`Promise`<`boolean` \| `void`\>

#### Defined in

[packages/test/src/api/cli.ts:28](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L28)

---

### lastBlock

▸ **lastBlock**(`app`, `splitIndex?`, `N?`, `inNotebook?`): `Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

Index of last executed block

#### Parameters

| Name         | Type          | Default value |
| :----------- | :------------ | :------------ |
| `app`        | `Application` | `undefined`   |
| `splitIndex` | `number`      | `1`           |
| `N`          | `number`      | `1`           |
| `inNotebook` | `boolean`     | `false`       |

#### Returns

`Promise`<[`AppAndCount`](../interfaces/kui_shell_test.ReplExpect.AppAndCount.md)\>

#### Defined in

[packages/test/src/api/cli.ts:223](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L223)

---

### makeCustom

▸ `Const` **makeCustom**(`selector`, `expect`, `exact?`): `Object`

wait for the result of a cli.command

#### Parameters

| Name       | Type      |
| :--------- | :-------- |
| `selector` | `string`  |
| `expect`   | `string`  |
| `exact?`   | `boolean` |

#### Returns

`Object`

| Name       | Type      |
| :--------- | :-------- |
| `exact`    | `boolean` |
| `expect`   | `string`  |
| `selector` | `string`  |

#### Defined in

[packages/test/src/api/cli.ts:169](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L169)

---

### nOfCurrentBlock

▸ **nOfCurrentBlock**(`app`, `splitIndex?`): `Promise`<`number`\>

#### Parameters

| Name         | Type          | Default value |
| :----------- | :------------ | :------------ |
| `app`        | `Application` | `undefined`   |
| `splitIndex` | `number`      | `1`           |

#### Returns

`Promise`<`number`\>

the "N" of the current block

#### Defined in

[packages/test/src/api/cli.ts:215](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L215)

---

### paste

▸ `Const` **paste**(`cmd`, `app`, `nLines?`): `Promise`<`Object`\>

#### Parameters

| Name     | Type          | Default value |
| :------- | :------------ | :------------ |
| `cmd`    | `string`      | `undefined`   |
| `app`    | `Application` | `undefined`   |
| `nLines` | `number`      | `1`           |

#### Returns

`Promise`<`Object`\>

#### Defined in

[packages/test/src/api/cli.ts:115](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L115)

---

### waitForRepl

▸ `Const` **waitForRepl**(`app`): `Promise`<`Application`\>

wait for the repl to be active

#### Parameters

| Name  | Type          |
| :---- | :------------ |
| `app` | `Application` |

#### Returns

`Promise`<`Application`\>

#### Defined in

[packages/test/src/api/cli.ts:128](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L128)

---

### waitForSession

▸ `Const` **waitForSession**(`ctx`, `noProxySessionWait?`): `Promise`<`void`\>

Wait, if needed, for a proxy session

#### Parameters

| Name                 | Type                                                      | Default value |
| :------------------- | :-------------------------------------------------------- | :------------ |
| `ctx`                | [`ISuite`](../interfaces/kui_shell_test.Common.ISuite.md) | `undefined`   |
| `noProxySessionWait` | `boolean`                                                 | `false`       |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/test/src/api/cli.ts:141](https://github.com/mra-ruiz/kui/blob/27e887ab4/packages/test/src/api/cli.ts#L141)
