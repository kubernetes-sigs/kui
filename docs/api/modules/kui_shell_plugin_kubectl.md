[Kui API Documentation - v10.8.0](../README.md) / @kui-shell/plugin-kubectl

# Module: @kui-shell/plugin-kubectl

## Table of contents

### Enumerations

- [TrafficLight](../enums/kui_shell_plugin_kubectl.TrafficLight.md)

### Interfaces

- [InvolvedObject](../interfaces/kui_shell_plugin_kubectl.InvolvedObject.md)
- [Job](../interfaces/kui_shell_plugin_kubectl.Job.md)
- [KubeContext](../interfaces/kui_shell_plugin_kubectl.KubeContext.md)
- [KubeItems](../interfaces/kui_shell_plugin_kubectl.KubeItems.md)
- [KubeOptions](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)
- [KubeStatus](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md)
- [KubeStatusCondition](../interfaces/kui_shell_plugin_kubectl.KubeStatusCondition.md)
- [Pod](../interfaces/kui_shell_plugin_kubectl.Pod.md)
- [PodLikeSpec](../interfaces/kui_shell_plugin_kubectl.PodLikeSpec.md)
- [PodList](../interfaces/kui_shell_plugin_kubectl.PodList.md)
- [Resource](../interfaces/kui_shell_plugin_kubectl.Resource.md)
- [Secret](../interfaces/kui_shell_plugin_kubectl.Secret.md)
- [WithRawData](../interfaces/kui_shell_plugin_kubectl.WithRawData.md)
- [WithSummary](../interfaces/kui_shell_plugin_kubectl.WithSummary.md)

### Type aliases

- [Deployment](kui_shell_plugin_kubectl.md#deployment)
- [KubePartial](kui_shell_plugin_kubectl.md#kubepartial)
- [KubeResource](kui_shell_plugin_kubectl.md#kuberesource)
- [KubeResourceWithSummary](kui_shell_plugin_kubectl.md#kuberesourcewithsummary)

### Properties

- [apiVersion](kui_shell_plugin_kubectl.md#apiversion)
- [kubectl](kui_shell_plugin_kubectl.md#kubectl)
- [logsMode](kui_shell_plugin_kubectl.md#logsmode)

### Variables

- [Parser](kui_shell_plugin_kubectl.md#parser)
- [defaultFlags](kui_shell_plugin_kubectl.md#defaultflags)

### Functions

- [computeDurations](kui_shell_plugin_kubectl.md#computedurations)
- [describer](kui_shell_plugin_kubectl.md#describer)
- [doCreate](kui_shell_plugin_kubectl.md#docreate)
- [doDelete](kui_shell_plugin_kubectl.md#dodelete)
- [doExecRaw](kui_shell_plugin_kubectl.md#doexecraw)
- [doExecWithMarkdown](kui_shell_plugin_kubectl.md#doexecwithmarkdown)
- [doExecWithPty](kui_shell_plugin_kubectl.md#doexecwithpty)
- [doExecWithRadioTable](kui_shell_plugin_kubectl.md#doexecwithradiotable)
- [doExecWithStatus](kui_shell_plugin_kubectl.md#doexecwithstatus)
- [doExecWithStdout](kui_shell_plugin_kubectl.md#doexecwithstdout)
- [doExecWithStdoutViaPty](kui_shell_plugin_kubectl.md#doexecwithstdoutviapty)
- [doExecWithTable](kui_shell_plugin_kubectl.md#doexecwithtable)
- [doGet](kui_shell_plugin_kubectl.md#doget)
- [doHelp](kui_shell_plugin_kubectl.md#dohelp)
- [doNativeExec](kui_shell_plugin_kubectl.md#donativeexec)
- [doRun](kui_shell_plugin_kubectl.md#dorun)
- [emitKubectlConfigChangeEvent](kui_shell_plugin_kubectl.md#emitkubectlconfigchangeevent)
- [fetchFileString](kui_shell_plugin_kubectl.md#fetchfilestring)
- [flags](kui_shell_plugin_kubectl.md#flags)
- [formatTable](kui_shell_plugin_kubectl.md#formattable)
- [fqn](kui_shell_plugin_kubectl.md#fqn)
- [fqnOf](kui_shell_plugin_kubectl.md#fqnof)
- [getAllContexts](kui_shell_plugin_kubectl.md#getallcontexts)
- [getAsMMRTransformer](kui_shell_plugin_kubectl.md#getasmmrtransformer)
- [getCommandFromArgs](kui_shell_plugin_kubectl.md#getcommandfromargs)
- [getContainer](kui_shell_plugin_kubectl.md#getcontainer)
- [getCurrentContext](kui_shell_plugin_kubectl.md#getcurrentcontext)
- [getCurrentContextName](kui_shell_plugin_kubectl.md#getcurrentcontextname)
- [getCurrentDefaultContextName](kui_shell_plugin_kubectl.md#getcurrentdefaultcontextname)
- [getCurrentDefaultNamespace](kui_shell_plugin_kubectl.md#getcurrentdefaultnamespace)
- [getKind](kui_shell_plugin_kubectl.md#getkind)
- [getLabel](kui_shell_plugin_kubectl.md#getlabel)
- [getLabelForArgv](kui_shell_plugin_kubectl.md#getlabelforargv)
- [getNamespace](kui_shell_plugin_kubectl.md#getnamespace)
- [getNamespaceForArgv](kui_shell_plugin_kubectl.md#getnamespaceforargv)
- [getPodsCommand](kui_shell_plugin_kubectl.md#getpodscommand)
- [getTabState](kui_shell_plugin_kubectl.md#gettabstate)
- [getTransformer](kui_shell_plugin_kubectl.md#gettransformer)
- [getter](kui_shell_plugin_kubectl.md#getter)
- [hasLabel](kui_shell_plugin_kubectl.md#haslabel)
- [isCrudableKubeResource](kui_shell_plugin_kubectl.md#iscrudablekuberesource)
- [isDeployment](kui_shell_plugin_kubectl.md#isdeployment)
- [isForAllNamespaces](kui_shell_plugin_kubectl.md#isforallnamespaces)
- [isHelpRequest](kui_shell_plugin_kubectl.md#ishelprequest)
- [isJob](kui_shell_plugin_kubectl.md#isjob)
- [isKubeItems](kui_shell_plugin_kubectl.md#iskubeitems)
- [isKubeItemsOfKind](kui_shell_plugin_kubectl.md#iskubeitemsofkind)
- [isKubeResource](kui_shell_plugin_kubectl.md#iskuberesource)
- [isPod](kui_shell_plugin_kubectl.md#ispod)
- [isPodList](kui_shell_plugin_kubectl.md#ispodlist)
- [isSecret](kui_shell_plugin_kubectl.md#issecret)
- [isTableRequest](kui_shell_plugin_kubectl.md#istablerequest)
- [isUsage](kui_shell_plugin_kubectl.md#isusage)
- [isWatchRequest](kui_shell_plugin_kubectl.md#iswatchrequest)
- [offKubectlConfigChangeEvents](kui_shell_plugin_kubectl.md#offkubectlconfigchangeevents)
- [onKubectlConfigChangeEvents](kui_shell_plugin_kubectl.md#onkubectlconfigchangeevents)
- [parseName](kui_shell_plugin_kubectl.md#parsename)
- [preprocessTable](kui_shell_plugin_kubectl.md#preprocesstable)
- [registerApplySubcommands](kui_shell_plugin_kubectl.md#registerapplysubcommands)
- [registerConfig](kui_shell_plugin_kubectl.md#registerconfig)
- [registerEdit](kui_shell_plugin_kubectl.md#registeredit)
- [stringToTable](kui_shell_plugin_kubectl.md#stringtotable)
- [watchRequestFrom](kui_shell_plugin_kubectl.md#watchrequestfrom)
- [withHelp](kui_shell_plugin_kubectl.md#withhelp)
- [withKubeconfigFrom](kui_shell_plugin_kubectl.md#withkubeconfigfrom)
- [withNamespaceBreadcrumb](kui_shell_plugin_kubectl.md#withnamespacebreadcrumb)

## Type aliases

### Deployment

Ƭ **Deployment**: `Deployment1` \| `Deployment2`

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:421](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L421)

---

### KubePartial

Ƭ **KubePartial**<`R`\>: `Omit`<`R`, `"apiVersion"` \| `"kind"`\>

#### Type parameters

| Name | Type                                                                                                                         |
| :--- | :--------------------------------------------------------------------------------------------------------------------------- |
| `R`  | extends [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)[`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource) |

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:544](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L544)

---

### KubeResource

Ƭ **KubeResource**<`Status`, `Metadata`\>: `ResourceWithMetadata` & [`WithRawData`](../interfaces/kui_shell_plugin_kubectl.WithRawData.md) & { `apiVersion`: `string` ; `isKubeResource`: `true` ; `isSimulacrum?`: `boolean` ; `kind`: `string` ; `metadata?`: `Metadata` ; `originatingCommand`: `Arguments`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> ; `spec?`: `any` ; `status?`: `Status` }

The basic Kubernetes resource

#### Type parameters

| Name       | Type                                                                 |
| :--------- | :------------------------------------------------------------------- |
| `Status`   | [`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md) |
| `Metadata` | `KubeMetadata`                                                       |

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:194](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L194)

---

### KubeResourceWithSummary

Ƭ **KubeResourceWithSummary**<`Status`\>: [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<`Status`\> & [`WithSummary`](../interfaces/kui_shell_plugin_kubectl.WithSummary.md)

`KubeResourceWithSummary` allows plugins to provide their own
Summary. Otherwise lib/views/modes/summary will try to fetch one
automatically.

#### Type parameters

| Name     | Type                                                                 |
| :------- | :------------------------------------------------------------------- |
| `Status` | [`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md) |

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:238](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L238)

## Properties

### apiVersion

• **apiVersion**: `"github.com/kui-shell/plugin-kubectl/v1alpha1"`

---

### kubectl

• **kubectl**: `string`

---

### logsMode

• **logsMode**: `"logs"`

## Variables

### Parser

• **Parser**: `Object`

memory and cpu parsing

#### Type declaration

| Name               | Type                                             |
| :----------------- | :----------------------------------------------- |
| `cpuFraction`      | (`str`: `string`) => `number`                    |
| `cpuShare`         | (`str`: `string`) => `number`                    |
| `formatAsBytes`    | (`mem`: `number`) => `string`                    |
| `formatAsCpu`      | (`cpu`: `number`) => `string`                    |
| `fractionOfMemory` | (`num`: `string`, `denom`: `string`) => `string` |
| `memShare`         | (`str`: `string`) => `number`                    |
| `reformatAsBytes`  | (`mem`: `string`) => `string`                    |

#### Defined in

[plugins/plugin-kubectl/src/lib/util/parse.ts:144](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/util/parse.ts#L144)

---

### defaultFlags

• **defaultFlags**: `CommandOptions`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/flags.ts:66](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/flags.ts#L66)

## Functions

### computeDurations

▸ **computeDurations**<`T`\>(`table`): `T`

Turn START and END columns into a DURATION column.

TODO Kubectl gurus: Is there a way to get this directly from a
jsonpath or go-template? I think so from the latter?

#### Type parameters

| Name | Type                                           |
| :--- | :--------------------------------------------- |
| `T`  | extends `Table`<`Row`\> \| `KResponse`<`any`\> |

#### Parameters

| Name    | Type |
| :------ | :--- |
| `table` | `T`  |

#### Returns

`T`

#### Defined in

[plugins/plugin-kubectl/src/lib/view/formatTable.ts:513](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/view/formatTable.ts#L513)

---

### describer

▸ **describer**(`registrar`, `command`, `cli?`): `void`

Register a command listener

#### Parameters

| Name        | Type               | Default value |
| :---------- | :----------------- | :------------ |
| `registrar` | `CommandRegistrar` | `undefined`   |
| `command`   | `string`           | `undefined`   |
| `cli`       | `string`           | `command`     |

#### Returns

`void`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/describe.ts:48](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/describe.ts#L48)

---

### doCreate

▸ `Const` **doCreate**(`verb`, `command?`): (`args`: `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>) => `Promise`<`string` \| `number` \| `boolean` \| `HTMLElement` \| `Error` \| `MarkdownResponse` \| `ReactResponse` \| `MixedResponse` \| `CommentaryResponse` \| `TabLayoutModificationResponse`<`NewSplitRequest`\> \| `XtermResponse` \| `default` \| `RandomErrorResponse1` \| `RandomErrorResponse2` \| `Table`<`Row`\> \| `AbortableResponse`<`ScalarResponse`<`Row`\>\> \| `NavResponse` \| `RadioTable` \| `UsageModel` \| `MetadataBearing`<`any`\> \| `RawResponse`<`any`\> \| `MetadataBearing`<`any`\>[]\>

#### Parameters

| Name      | Type                    | Default value |
| :-------- | :---------------------- | :------------ |
| `verb`    | `"create"` \| `"apply"` | `undefined`   |
| `command` | `string`                | `'kubectl'`   |

#### Returns

`fn`

▸ (`args`): `Promise`<`string` \| `number` \| `boolean` \| `HTMLElement` \| `Error` \| `MarkdownResponse` \| `ReactResponse` \| `MixedResponse` \| `CommentaryResponse` \| `TabLayoutModificationResponse`<`NewSplitRequest`\> \| `XtermResponse` \| `default` \| `RandomErrorResponse1` \| `RandomErrorResponse2` \| `Table`<`Row`\> \| `AbortableResponse`<`ScalarResponse`<`Row`\>\> \| `NavResponse` \| `RadioTable` \| `UsageModel` \| `MetadataBearing`<`any`\> \| `RawResponse`<`any`\> \| `MetadataBearing`<`any`\>[]\>

##### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

##### Returns

`Promise`<`string` \| `number` \| `boolean` \| `HTMLElement` \| `Error` \| `MarkdownResponse` \| `ReactResponse` \| `MixedResponse` \| `CommentaryResponse` \| `TabLayoutModificationResponse`<`NewSplitRequest`\> \| `XtermResponse` \| `default` \| `RandomErrorResponse1` \| `RandomErrorResponse2` \| `Table`<`Row`\> \| `AbortableResponse`<`ScalarResponse`<`Row`\>\> \| `NavResponse` \| `RadioTable` \| `UsageModel` \| `MetadataBearing`<`any`\> \| `RawResponse`<`any`\> \| `MetadataBearing`<`any`\>[]\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/create.ts:34](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/create.ts#L34)

---

### doDelete

▸ `Const` **doDelete**(`command?`): (`args`: `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>) => `Promise`<`string` \| `number` \| `boolean` \| `HTMLElement` \| `Error` \| `MarkdownResponse` \| `ReactResponse` \| `MixedResponse` \| `CommentaryResponse` \| `TabLayoutModificationResponse`<`NewSplitRequest`\> \| `XtermResponse` \| `default` \| `RandomErrorResponse1` \| `RandomErrorResponse2` \| `Table`<`Row`\> \| `AbortableResponse`<`ScalarResponse`<`Row`\>\> \| `NavResponse` \| `RadioTable` \| `UsageModel` \| `MetadataBearing`<`any`\> \| `RawResponse`<`any`\> \| `MetadataBearing`<`any`\>[]\>

#### Parameters

| Name      | Type     | Default value |
| :-------- | :------- | :------------ |
| `command` | `string` | `'kubectl'`   |

#### Returns

`fn`

▸ (`args`): `Promise`<`string` \| `number` \| `boolean` \| `HTMLElement` \| `Error` \| `MarkdownResponse` \| `ReactResponse` \| `MixedResponse` \| `CommentaryResponse` \| `TabLayoutModificationResponse`<`NewSplitRequest`\> \| `XtermResponse` \| `default` \| `RandomErrorResponse1` \| `RandomErrorResponse2` \| `Table`<`Row`\> \| `AbortableResponse`<`ScalarResponse`<`Row`\>\> \| `NavResponse` \| `RadioTable` \| `UsageModel` \| `MetadataBearing`<`any`\> \| `RawResponse`<`any`\> \| `MetadataBearing`<`any`\>[]\>

##### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

##### Returns

`Promise`<`string` \| `number` \| `boolean` \| `HTMLElement` \| `Error` \| `MarkdownResponse` \| `ReactResponse` \| `MixedResponse` \| `CommentaryResponse` \| `TabLayoutModificationResponse`<`NewSplitRequest`\> \| `XtermResponse` \| `default` \| `RandomErrorResponse1` \| `RandomErrorResponse2` \| `Table`<`Row`\> \| `AbortableResponse`<`ScalarResponse`<`Row`\>\> \| `NavResponse` \| `RadioTable` \| `UsageModel` \| `MetadataBearing`<`any`\> \| `RawResponse`<`any`\> \| `MetadataBearing`<`any`\>[]\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/delete.ts:41](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/delete.ts#L41)

---

### doExecRaw

▸ **doExecRaw**(`command`, `parsedOptions`, `execOptions`): `Promise`<`string`\>

A convenience wrapper over `doNativeExec` that extracts only
stdout, and discards the exit code and stderr.

#### Parameters

| Name            | Type                                                                   |
| :-------------- | :--------------------------------------------------------------------- |
| `command`       | `string`                                                               |
| `parsedOptions` | [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |
| `execOptions`   | `ExecOptions`                                                          |

#### Returns

`Promise`<`string`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/raw.ts:163](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/raw.ts#L163)

---

### doExecWithMarkdown

▸ **doExecWithMarkdown**(`args`, `exec?`): `Promise`<`NavResponse`\>

#### Parameters

| Name    | Type                                                                                     |
| :------ | :--------------------------------------------------------------------------------------- |
| `args`  | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |
| `exec?` | `string`                                                                                 |

#### Returns

`Promise`<`NavResponse`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/exec-to-markdown.ts:24](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/exec-to-markdown.ts#L24)

---

### doExecWithPty

▸ **doExecWithPty**<`Content`, `Response`, `O`\>(`args`, `prepare?`, `exec?`): `Promise`<`string` \| `Response`\>

Execute the given command using a pty

#### Type parameters

| Name       | Type                                                                                                                                                 |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Content`  | `void`                                                                                                                                               |
| `Response` | extends `KResponse`<`Content`\>`KResponse`<`Content`\>                                                                                               |
| `O`        | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name      | Type                  | Default value |
| :-------- | :-------------------- | :------------ |
| `args`    | `EvaluatorArgs`<`O`\> | `undefined`   |
| `prepare` | `Prepare`<`O`\>       | `NoPrepare`   |
| `exec?`   | `string`              | `undefined`   |

#### Returns

`Promise`<`string` \| `Response`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/exec.ts:107](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/exec.ts#L107)

---

### doExecWithRadioTable

▸ **doExecWithRadioTable**<`Resource`\>(`resources`, `defaultSelectedIdx`, `onSelect`, `__namedParameters?`): `Promise`<`RadioTable` \| `void`\>

#### Type parameters

| Name       | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Resource` | extends `MetadataBearing`<`void`, `Resource`\> & [`WithRawData`](../interfaces/kui_shell_plugin_kubectl.WithRawData.md)<`void`, `Resource`\> & { `apiVersion`: `string` ; `isKubeResource`: `true` ; `isSimulacrum?`: `boolean` ; `kind`: `string` ; `metadata?`: `KubeMetadata` ; `originatingCommand`: `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> ; `spec?`: `any` ; `status?`: [`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md) } |

#### Parameters

| Name                                | Type                                                   |
| :---------------------------------- | :----------------------------------------------------- |
| `resources`                         | `Resource`[]                                           |
| `defaultSelectedIdx`                | `number`                                               |
| `onSelect`                          | (`name`: `string`, `resource`: `Resource`) => `string` |
| `__namedParameters`                 | `Object`                                               |
| `__namedParameters.nameColumnTitle` | `string`                                               |
| `__namedParameters.title`           | `string`                                               |

#### Returns

`Promise`<`RadioTable` \| `void`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/exec.ts:282](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/exec.ts#L282)

---

### doExecWithStatus

▸ `Const` **doExecWithStatus**<`O`\>(`verb`, `finalState`, `command?`, `prepareForExec?`, `prepareForStatus?`): (`args`: `EvaluatorArgs`<`O`\>) => `Promise`<`KubeTableResponse`\>

Execute a command, and then execute the status command which will
poll until the given FinalState is reached.

#### Type parameters

| Name | Type                                                                           |
| :--- | :----------------------------------------------------------------------------- |
| `O`  | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name               | Type                     | Default value             |
| :----------------- | :----------------------- | :------------------------ |
| `verb`             | `string`                 | `undefined`               |
| `finalState`       | `FinalState`             | `undefined`               |
| `command`          | `string`                 | `'kubectl'`               |
| `prepareForExec`   | `Prepare`<`O`\>          | `NoPrepare`               |
| `prepareForStatus` | `PrepareForStatus`<`O`\> | `DefaultPrepareForStatus` |

#### Returns

`fn`

▸ (`args`): `Promise`<`KubeTableResponse`\>

##### Parameters

| Name   | Type                  |
| :----- | :-------------------- |
| `args` | `EvaluatorArgs`<`O`\> |

##### Returns

`Promise`<`KubeTableResponse`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/exec.ts:259](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/exec.ts#L259)

---

### doExecWithStdout

▸ **doExecWithStdout**<`O`\>(`args`, `prepare?`, `exec?`): `Promise`<`string`\>

Behaves as does `exec`, except that it projects out just the
`stdout` part -- thus ignoring the exit `code` and `stderr`.

#### Type parameters

| Name | Type                                                                           |
| :--- | :----------------------------------------------------------------------------- |
| `O`  | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name      | Type                  | Default value |
| :-------- | :-------------------- | :------------ |
| `args`    | `EvaluatorArgs`<`O`\> | `undefined`   |
| `prepare` | `Prepare`<`O`\>       | `NoPrepare`   |
| `exec?`   | `string`              | `undefined`   |

#### Returns

`Promise`<`string`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/exec.ts:86](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/exec.ts#L86)

---

### doExecWithStdoutViaPty

▸ **doExecWithStdoutViaPty**<`O`\>(`args`, `prepare?`): `Promise`<`string`\>

Execute the given command using a pty, but return a string

#### Type parameters

| Name | Type                                                                                                                                                 |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `O`  | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name      | Type                  | Default value |
| :-------- | :-------------------- | :------------ |
| `args`    | `EvaluatorArgs`<`O`\> | `undefined`   |
| `prepare` | `Prepare`<`O`\>       | `NoPrepare`   |

#### Returns

`Promise`<`string`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/exec.ts:158](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/exec.ts#L158)

---

### doExecWithTable

▸ **doExecWithTable**<`O`\>(`args`, `prepare?`, `command?`, `__namedParameters?`): `Promise`<`Table` \| `MixedResponse`\>

Behaves as does `exec`, except that it projects out just the
`stdout` part and parses it into a Table model.

#### Type parameters

| Name | Type                                                                           |
| :--- | :----------------------------------------------------------------------------- |
| `O`  | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name                            | Type                  | Default value |
| :------------------------------ | :-------------------- | :------------ |
| `args`                          | `EvaluatorArgs`<`O`\> | `undefined`   |
| `prepare`                       | `Prepare`<`O`\>       | `NoPrepare`   |
| `command`                       | `string`              | `'kubectl'`   |
| `__namedParameters`             | `Object`              | `{}`          |
| `__namedParameters.entityType?` | `string`              | `undefined`   |
| `__namedParameters.nameColumn?` | `string`              | `undefined`   |
| `__namedParameters.usePty?`     | `boolean`             | `undefined`   |
| `__namedParameters.verb?`       | `string`              | `undefined`   |

#### Returns

`Promise`<`Table` \| `MixedResponse`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/exec.ts:223](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/exec.ts#L223)

---

### doGet

▸ `Const` **doGet**(`command`): (`args`: `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>) => `Promise`<`KResponse`<`any`\>\>

This is the main handler for `kubectl get`. Here, we act as a
dispatcher: in `kubectl` a `get` can mean either get-as-table,
get-as-entity, or get-as-custom, depending on the `-o` flag.

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `command` | `string` |

#### Returns

`fn`

▸ (`args`): `Promise`<`KResponse`<`any`\>\>

##### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

##### Returns

`Promise`<`KResponse`<`any`\>\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/get.ts:331](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/get.ts#L331)

---

### doHelp

▸ **doHelp**<`O`\>(`command`, `args`, `prepare?`): `Promise`<`KResponse`\>

#### Type parameters

| Name | Type                                                                           |
| :--- | :----------------------------------------------------------------------------- |
| `O`  | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name      | Type                  | Default value |
| :-------- | :-------------------- | :------------ |
| `command` | `string`              | `undefined`   |
| `args`    | `EvaluatorArgs`<`O`\> | `undefined`   |
| `prepare` | `Prepare`<`O`\>       | `NoPrepare`   |

#### Returns

`Promise`<`KResponse`\>

#### Defined in

[plugins/plugin-kubectl/src/lib/util/help.ts:467](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/util/help.ts#L467)

---

### doNativeExec

▸ **doNativeExec**(`args`): `Promise`<`RawResponse`\>

#### Parameters

| Name   | Type   |
| :----- | :----- |
| `args` | `Args` |

#### Returns

`Promise`<`RawResponse`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/raw.ts:134](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/raw.ts#L134)

---

### doRun

▸ `Const` **doRun**(`command?`): (`args`: `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>) => `Promise`<`KResponse`<`any`\>\>

#### Parameters

| Name      | Type     | Default value |
| :-------- | :------- | :------------ |
| `command` | `string` | `'kubectl'`   |

#### Returns

`fn`

▸ (`args`): `Promise`<`KResponse`<`any`\>\>

##### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

##### Returns

`Promise`<`KResponse`<`any`\>\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/run.ts:40](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/run.ts#L40)

---

### emitKubectlConfigChangeEvent

▸ **emitKubectlConfigChangeEvent**(`type`, `namespace?`, `context?`): `void`

#### Parameters

| Name         | Type                                                     |
| :----------- | :------------------------------------------------------- |
| `type`       | `"SetNamespaceOrContext"` \| `"CreateOrDeleteNamespace"` |
| `namespace?` | `string`                                                 |
| `context?`   | `string`                                                 |

#### Returns

`void`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/config.ts:39](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/config.ts#L39)

---

### fetchFileString

▸ **fetchFileString**(`args`, `url`, `headers?`): `Promise`<(`void` \| `string`)[]\>

same as fetchFile, but returning a string rather than a Buffer

#### Parameters

| Name       | Type                          |
| :--------- | :---------------------------- |
| `args`     | `ContextArgs`                 |
| `url`      | `string`                      |
| `headers?` | `Record`<`string`, `string`\> |

#### Returns

`Promise`<(`void` \| `string`)[]\>

#### Defined in

[plugins/plugin-kubectl/src/lib/util/fetch-file.ts:300](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/util/fetch-file.ts#L300)

---

### flags

▸ **flags**(`booleans?`): `CommandOptions`

#### Parameters

| Name       | Type       | Default value |
| :--------- | :--------- | :------------ |
| `booleans` | `string`[] | `[]`          |

#### Returns

`CommandOptions`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/flags.ts:44](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/flags.ts#L44)

---

### formatTable

▸ `Const` **formatTable**<`O`\>(`command`, `verb`, `entityTypeFromCommandLine`, `args`, `preTable`, `nameColumn?`): `Promise`<`Table`<`Row`\>\>

#### Type parameters

| Name | Type                                                                           |
| :--- | :----------------------------------------------------------------------------- |
| `O`  | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name                        | Type                  | Default value |
| :-------------------------- | :-------------------- | :------------ |
| `command`                   | `string`              | `undefined`   |
| `verb`                      | `string`              | `undefined`   |
| `entityTypeFromCommandLine` | `string`              | `undefined`   |
| `args`                      | `EvaluatorArgs`<`O`\> | `undefined`   |
| `preTable`                  | `Pair`[][]            | `undefined`   |
| `nameColumn`                | `string`              | `'NAME'`      |

#### Returns

`Promise`<`Table`<`Row`\>\>

#### Defined in

[plugins/plugin-kubectl/src/lib/view/formatTable.ts:210](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/view/formatTable.ts#L210)

---

### fqn

▸ **fqn**(`apiVersion`, `kind`, `name`, `namespace`): `string`

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `apiVersion` | `string` |
| `kind`       | `string` |
| `name`       | `string` |
| `namespace`  | `string` |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/fqn.ts:93](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/fqn.ts#L93)

---

### fqnOf

▸ **fqnOf**(`resource`): `string`

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/fqn.ts:101](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/fqn.ts#L101)

---

### getAllContexts

▸ **getAllContexts**(`__namedParameters`): `Promise`<[`KubeContext`](../interfaces/kui_shell_plugin_kubectl.KubeContext.md)[]\>

#### Parameters

| Name                     | Type      |
| :----------------------- | :-------- |
| `__namedParameters`      | `Object`  |
| `__namedParameters.REPL` | `default` |

#### Returns

`Promise`<[`KubeContext`](../interfaces/kui_shell_plugin_kubectl.KubeContext.md)[]\>

a list of `KubeContext` for all known contexts

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/contexts.ts:68](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/contexts.ts#L68)

---

### getAsMMRTransformer

▸ **getAsMMRTransformer**(`args`, `resource`): `Promise`<`MultiModalResponse`<[`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)\>\>

`kubectl get` as entity response

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `args`     | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>                                                          |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Returns

`Promise`<`MultiModalResponse`<[`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)\>\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/get.ts:183](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/get.ts#L183)

---

### getCommandFromArgs

▸ `Const` **getCommandFromArgs**(`args`): `string`

#### Parameters

| Name   | Type                                                          |
| :----- | :------------------------------------------------------------ |
| `args` | `Pick`<`EvaluatorArgs`<`ParsedOptions`\>, `"argvNoOptions"`\> |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/lib/util/util.ts:115](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/util/util.ts#L115)

---

### getContainer

▸ **getContainer**(`args`, `verb`): `string`

e.g. for kubectl logs

#### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |
| `verb` | `string`                                                                                 |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:229](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L229)

---

### getCurrentContext

▸ **getCurrentContext**(`__namedParameters`): `Promise`<[`KubeContext`](../interfaces/kui_shell_plugin_kubectl.KubeContext.md)\>

#### Parameters

| Name                     | Type      |
| :----------------------- | :-------- |
| `__namedParameters`      | `Object`  |
| `__namedParameters.REPL` | `default` |

#### Returns

`Promise`<[`KubeContext`](../interfaces/kui_shell_plugin_kubectl.KubeContext.md)\>

a `KubeContext` representing the current context

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/contexts.ts:56](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/contexts.ts#L56)

---

### getCurrentContextName

▸ **getCurrentContextName**(`__namedParameters`): `Promise`<`string`\>

#### Parameters

| Name                     | Type      |
| :----------------------- | :-------- |
| `__namedParameters`      | `Object`  |
| `__namedParameters.REPL` | `default` |

#### Returns

`Promise`<`string`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/contexts.ts:72](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/contexts.ts#L72)

---

### getCurrentDefaultContextName

▸ **getCurrentDefaultContextName**(`__namedParameters`): `string` \| `Promise`<`string`\>

#### Parameters

| Name                | Type          |
| :------------------ | :------------ |
| `__namedParameters` | `ContextArgs` |

#### Returns

`string` \| `Promise`<`string`\>

the relevant context for the given args/command line

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/contexts.ts:105](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/contexts.ts#L105)

---

### getCurrentDefaultNamespace

▸ **getCurrentDefaultNamespace**(`args`): `Promise`<`string`\>

#### Parameters

| Name   | Type          |
| :----- | :------------ |
| `args` | `ContextArgs` |

#### Returns

`Promise`<`string`\>

the relevant namespace for the given args/command line

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/contexts.ts:128](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/contexts.ts#L128)

---

### getKind

▸ **getKind**(`command`, `args`, `kindAsProvidedByUser`): `Promise`<`string`\>

#### Parameters

| Name                   | Type                              | Description    |
| :--------------------- | :-------------------------------- | :------------- |
| `command`              | `string`                          | -              |
| `args`                 | `EvaluatorArgs`<`ParsedOptions`\> | -              |
| `kindAsProvidedByUser` | `string`                          | e.g. pod or po |

#### Returns

`Promise`<`string`\>

e.g. Pod

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/explain.ts:329](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/explain.ts#L329)

---

### getLabel

▸ **getLabel**(`__namedParameters`): `string`

#### Parameters

| Name                | Type                                                                                                                 |
| :------------------ | :------------------------------------------------------------------------------------------------------------------- |
| `__namedParameters` | `Pick`<`EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>, `"parsedOptions"`\> |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:144](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L144)

---

### getLabelForArgv

▸ **getLabelForArgv**(`args`): `string`

#### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:169](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L169)

---

### getNamespace

▸ **getNamespace**(`args`): `Promise`<`string`\>

#### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

#### Returns

`Promise`<`string`\>

the namespace as expressed in the command line, or the default from context

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:206](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L206)

---

### getNamespaceForArgv

▸ **getNamespaceForArgv**(`args`): `string`

A variant of getNamespace where you _only_ want to use what was
provided by the user in their command line.

#### Parameters

| Name   | Type                                                                                                                 |
| :----- | :------------------------------------------------------------------------------------------------------------------- |
| `args` | `Pick`<`EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>, `"parsedOptions"`\> |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:214](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L214)

---

### getPodsCommand

▸ **getPodsCommand**(`resource`, `args?`): `string`

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |
| `args?`    | `Pick`<`EvaluatorArgs`<`ParsedOptions`\>, `"argvNoOptions"`\>                                                                                     |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/lib/view/modes/pods.ts:25](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/view/modes/pods.ts#L25)

---

### getTabState

▸ **getTabState**(`tab`, `key`): `any`

#### Parameters

| Name  | Type      |
| :---- | :-------- |
| `tab` | `default` |
| `key` | `string`  |

#### Returns

`any`

#### Defined in

[plugins/plugin-kubectl/src/tab-state.ts:27](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/tab-state.ts#L27)

---

### getTransformer

▸ **getTransformer**(`args`, `response`): `Promise`<`ReturnType`<typeof [`getAsMMRTransformer`](kui_shell_plugin_kubectl.md#getasmmrtransformer)\> \| `Table`\>

KubeResource -> MultiModalResponse view transformer

#### Parameters

| Name       | Type                                                                                     |
| :--------- | :--------------------------------------------------------------------------------------- |
| `args`     | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |
| `response` | `KResponse`<`any`\>                                                                      |

#### Returns

`Promise`<`ReturnType`<typeof [`getAsMMRTransformer`](kui_shell_plugin_kubectl.md#getasmmrtransformer)\> \| `Table`\>

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/get.ts:402](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/get.ts#L402)

---

### getter

▸ **getter**(`registrar`, `command`, `cli?`): `void`

Register a command listener

#### Parameters

| Name        | Type               | Default value |
| :---------- | :----------------- | :------------ |
| `registrar` | `CommandRegistrar` | `undefined`   |
| `command`   | `string`           | `undefined`   |
| `cli`       | `string`           | `command`     |

#### Returns

`void`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/get.ts:465](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/get.ts#L465)

---

### hasLabel

▸ **hasLabel**(`args`): `boolean`

Due to deficiencies in yargs-parser (used by @kui-shell/core), the
form -lapp=name (i.e. without a whitespace after the -l) is not
parsed properly.

#### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

#### Returns

`boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:183](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L183)

---

### isCrudableKubeResource

▸ **isCrudableKubeResource**(`entity`): entity is KubeResource<KubeStatus, KubeMetadata\>

is the command response a kube resource that can responds to "kubectl delete", etc.?

#### Parameters

| Name     | Type                       |
| :------- | :------------------------- |
| `entity` | `MetadataBearing`<`void`\> |

#### Returns

entity is KubeResource<KubeStatus, KubeMetadata\>

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:530](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L530)

---

### isDeployment

▸ **isDeployment**(`resource`): resource is Deployment

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Returns

resource is Deployment

whether the given resource is an instance of a Deployment

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:427](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L427)

---

### isForAllNamespaces

▸ **isForAllNamespaces**(`parsedOptions`): `boolean`

#### Parameters

| Name            | Type                                                                   |
| :-------------- | :--------------------------------------------------------------------- |
| `parsedOptions` | [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Returns

`boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:317](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L317)

---

### isHelpRequest

▸ **isHelpRequest**(`args`): `boolean`

#### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

#### Returns

`boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:112](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L112)

---

### isJob

▸ **isJob**(`resource`): resource is Job

#### Parameters

| Name       | Type                                                                                                                                                                                   |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resource` | `Pick`<[`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\>, `"apiVersion"` \| `"kind"`\> |

#### Returns

resource is Job

whether the given resource is an instance of a Deploymemt

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:399](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L399)

---

### isKubeItems

▸ **isKubeItems**(`resource`): resource is KubeItems<KubeResource<KubeStatus, KubeMetadata\>\>

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Returns

resource is KubeItems<KubeResource<KubeStatus, KubeMetadata\>\>

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:552](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L552)

---

### isKubeItemsOfKind

▸ **isKubeItemsOfKind**<`Item`\>(`resource`, `isOfKind`): resource is KubeItems<Item\>

#### Type parameters

| Name   | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Item` | extends `MetadataBearing`<`void`, `Item`\> & [`WithRawData`](../interfaces/kui_shell_plugin_kubectl.WithRawData.md)<`void`, `Item`\> & { `apiVersion`: `string` ; `isKubeResource`: `true` ; `isSimulacrum?`: `boolean` ; `kind`: `string` ; `metadata?`: `KubeMetadata` ; `originatingCommand`: `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> ; `spec?`: `any` ; `status?`: [`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md) }[`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Parameters

| Name       | Type                                                                                                                                                                        |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\>                           |
| `isOfKind` | (`item`: [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\>) => item is Item |

#### Returns

resource is KubeItems<Item\>

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:560](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L560)

---

### isKubeResource

▸ **isKubeResource**(`entity`): entity is KubeResource<KubeStatus, KubeMetadata\>

is the command response a Kubernetes resource? note: excluding any ones we simulate in kubeui

#### Parameters

| Name     | Type                                              |
| :------- | :------------------------------------------------ |
| `entity` | `MetadataBearing`<`void`\> \| `KResponse`<`any`\> |

#### Returns

entity is KubeResource<KubeStatus, KubeMetadata\>

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:214](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L214)

---

### isPod

▸ **isPod**(`resource`): resource is Pod

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Returns

resource is Pod

whether the given resource is an instance of a Pod

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:335](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L335)

---

### isPodList

▸ **isPodList**(`resource`): resource is PodList

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Returns

resource is PodList

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:556](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L556)

---

### isSecret

▸ **isSecret**(`resource`): resource is Secret<Record<string, any\>\>

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Returns

resource is Secret<Record<string, any\>\>

#### Defined in

[plugins/plugin-kubectl/src/lib/model/resource.ts:760](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/model/resource.ts#L760)

---

### isTableRequest

▸ **isTableRequest**(`args`): `boolean`

#### Parameters

| Name   | Type                                                                                                                 |
| :----- | :------------------------------------------------------------------------------------------------------------------- |
| `args` | `Pick`<`EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>, `"parsedOptions"`\> |

#### Returns

`boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:118](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L118)

---

### isUsage

▸ `Const` **isUsage**(`args`): `boolean`

#### Parameters

| Name   | Type                                                                                     |
| :----- | :--------------------------------------------------------------------------------------- |
| `args` | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> |

#### Returns

`boolean`

#### Defined in

[plugins/plugin-kubectl/src/lib/util/help.ts:465](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/util/help.ts#L465)

---

### isWatchRequest

▸ **isWatchRequest**(`args`): `boolean`

#### Parameters

| Name   | Type                                                                                                                 |
| :----- | :------------------------------------------------------------------------------------------------------------------- |
| `args` | `Pick`<`EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>, `"parsedOptions"`\> |

#### Returns

`boolean`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:122](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L122)

---

### offKubectlConfigChangeEvents

▸ **offKubectlConfigChangeEvents**(`handler`): `void`

#### Parameters

| Name      | Type      |
| :-------- | :-------- |
| `handler` | `Handler` |

#### Returns

`void`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/config.ts:55](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/config.ts#L55)

---

### onKubectlConfigChangeEvents

▸ **onKubectlConfigChangeEvents**(`handler`): `void`

#### Parameters

| Name      | Type      |
| :-------- | :-------- |
| `handler` | `Handler` |

#### Returns

`void`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/config.ts:51](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/config.ts#L51)

---

### parseName

▸ **parseName**(`resource`): { `app`: `string` ; `name`: `string` ; `nameHash`: `string` ; `version`: `string` } \| { `app`: `undefined` ; `name`: `string` ; `nameHash`: `string` ; `version`: `string` } \| { `app`: `undefined` ; `name`: `undefined` ; `nameHash`: `undefined` ; `version`: `undefined` }

Separate the app and generated parts of a resource name

#### Parameters

| Name       | Type                                                                                                                                              |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource` | [`KubeResource`](kui_shell_plugin_kubectl.md#kuberesource)<[`KubeStatus`](../interfaces/kui_shell_plugin_kubectl.KubeStatus.md), `KubeMetadata`\> |

#### Returns

{ `app`: `string` ; `name`: `string` ; `nameHash`: `string` ; `version`: `string` } \| { `app`: `undefined` ; `name`: `string` ; `nameHash`: `string` ; `version`: `string` } \| { `app`: `undefined` ; `name`: `undefined` ; `nameHash`: `undefined` ; `version`: `undefined` }

#### Defined in

[plugins/plugin-kubectl/src/lib/util/name.ts:23](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/util/name.ts#L23)

---

### preprocessTable

▸ `Const` **preprocessTable**(`raw`): `Pair`[][][]

Find the column splits

#### Parameters

| Name  | Type       |
| :---- | :--------- |
| `raw` | `string`[] |

#### Returns

`Pair`[][][]

#### Defined in

[plugins/plugin-kubectl/src/lib/view/formatTable.ts:147](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/view/formatTable.ts#L147)

---

### registerApplySubcommands

▸ **registerApplySubcommands**(`registrar`, `cmd`): `void`

#### Parameters

| Name        | Type               |
| :---------- | :----------------- |
| `registrar` | `CommandRegistrar` |
| `cmd`       | `string`           |

#### Returns

`void`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/apply-subcommands.ts:108](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/apply-subcommands.ts#L108)

---

### registerConfig

▸ **registerConfig**(`registrar`, `cmd`): `void`

#### Parameters

| Name        | Type               |
| :---------- | :----------------- |
| `registrar` | `CommandRegistrar` |
| `cmd`       | `string`           |

#### Returns

`void`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/config.ts:101](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/config.ts#L101)

---

### registerEdit

▸ **registerEdit**(`registrar`, `cmd`): `void`

#### Parameters

| Name        | Type               |
| :---------- | :----------------- |
| `registrar` | `CommandRegistrar` |
| `cmd`       | `string`           |

#### Returns

`void`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/edit.ts:279](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/edit.ts#L279)

---

### stringToTable

▸ `Const` **stringToTable**<`O`\>(`decodedResult`, `stderr`, `args`, `command?`, `verb?`, `entityType?`, `nameColumn?`): `Promise`<`KubeTableResponse`\>

Display the given string as a REPL table

#### Type parameters

| Name | Type                                                                           |
| :--- | :----------------------------------------------------------------------------- |
| `O`  | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name            | Type                  |
| :-------------- | :-------------------- |
| `decodedResult` | `string`              |
| `stderr`        | `string`              |
| `args`          | `EvaluatorArgs`<`O`\> |
| `command?`      | `string`              |
| `verb?`         | `string`              |
| `entityType?`   | `string`              |
| `nameColumn?`   | `string`              |

#### Returns

`Promise`<`KubeTableResponse`\>

#### Defined in

[plugins/plugin-kubectl/src/lib/view/formatTable.ts:459](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/view/formatTable.ts#L459)

---

### watchRequestFrom

▸ **watchRequestFrom**(`args`, `forceWatch?`): `""` \| `"--watch"` \| `"-w"` \| `"--watch-only"`

#### Parameters

| Name         | Type                                                                                     | Default value |
| :----------- | :--------------------------------------------------------------------------------------- | :------------ |
| `args`       | `EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\> | `undefined`   |
| `forceWatch` | `boolean`                                                                                | `false`       |

#### Returns

`""` \| `"--watch"` \| `"-w"` \| `"--watch-only"`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:126](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L126)

---

### withHelp

▸ **withHelp**<`O`\>(`args`): `string` \| `number` \| `boolean` \| `HTMLElement` \| `Error` \| `MarkdownResponse` \| `ReactResponse` \| `MixedResponse` \| `CommentaryResponse` \| `TabLayoutModificationResponse`<`NewSplitRequest`\> \| `XtermResponse` \| `default` \| `RandomErrorResponse1` \| `RandomErrorResponse2` \| `Table`<`Row`\> & `Partial`<`WithSourceReferences`\> \| `AbortableResponse`<`ScalarResponse`<`Row`\>\> \| `NavResponse` \| `RadioTable` \| `UsageModel` \| `MetadataBearing`<`any`\> \| `RawResponse`<`any`\> \| `MetadataBearing`<`any`\>[] \| `Promise`<`KResponse`<`any`\>\>

Wrap the given command handler `this` with a help dispatcher.

#### Type parameters

| Name | Type                                                                           |
| :--- | :----------------------------------------------------------------------------- |
| `O`  | extends [`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md) |

#### Parameters

| Name   | Type                  |
| :----- | :-------------------- |
| `args` | `EvaluatorArgs`<`O`\> |

#### Returns

`string` \| `number` \| `boolean` \| `HTMLElement` \| `Error` \| `MarkdownResponse` \| `ReactResponse` \| `MixedResponse` \| `CommentaryResponse` \| `TabLayoutModificationResponse`<`NewSplitRequest`\> \| `XtermResponse` \| `default` \| `RandomErrorResponse1` \| `RandomErrorResponse2` \| `Table`<`Row`\> & `Partial`<`WithSourceReferences`\> \| `AbortableResponse`<`ScalarResponse`<`Row`\>\> \| `NavResponse` \| `RadioTable` \| `UsageModel` \| `MetadataBearing`<`any`\> \| `RawResponse`<`any`\> \| `MetadataBearing`<`any`\>[] \| `Promise`<`KResponse`<`any`\>\>

#### Defined in

[plugins/plugin-kubectl/src/lib/util/help.ts:487](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/util/help.ts#L487)

---

### withKubeconfigFrom

▸ **withKubeconfigFrom**(`args`, `cmdline`): `string`

Copy over any kubeconfig/context/cluster/namespace specifications from the given args

#### Parameters

| Name      | Type                                                                                                                 |
| :-------- | :------------------------------------------------------------------------------------------------------------------- |
| `args`    | `Pick`<`EvaluatorArgs`<[`KubeOptions`](../interfaces/kui_shell_plugin_kubectl.KubeOptions.md)\>, `"parsedOptions"`\> |
| `cmdline` | `string`                                                                                                             |

#### Returns

`string`

#### Defined in

[plugins/plugin-kubectl/src/controller/kubectl/options.ts:322](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/controller/kubectl/options.ts#L322)

---

### withNamespaceBreadcrumb

▸ **withNamespaceBreadcrumb**(`ns`, `table`): `MixedResponse` \| `Table`<`Row`\>

Change the namespace breadcrumb of the given maybe-Table

#### Parameters

| Name    | Type                               |
| :------ | :--------------------------------- |
| `ns`    | `string`                           |
| `table` | `MixedResponse` \| `Table`<`Row`\> |

#### Returns

`MixedResponse` \| `Table`<`Row`\>

#### Defined in

[plugins/plugin-kubectl/src/lib/view/formatTable.ts:602](https://github.com/kubernetes-sigs/kui/blob/kui/plugins/plugin-kubectl/src/lib/view/formatTable.ts#L602)
