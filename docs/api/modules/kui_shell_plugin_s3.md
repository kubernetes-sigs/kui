[Kui API Documentation - v10.8.0](../README.md) / @kui-shell/plugin-s3

# Module: @kui-shell/plugin-s3

## Table of contents

### Classes

- [UnsupportedS3ProviderError](../classes/kui_shell_plugin_s3.UnsupportedS3ProviderError.md)

### Interfaces

- [MinioConfig](../interfaces/kui_shell_plugin_s3.MinioConfig.md)
- [Mount](../interfaces/kui_shell_plugin_s3.Mount.md)

### Type aliases

- [ProviderInitializer](kui_shell_plugin_s3.md#providerinitializer)
- [S3Provider](kui_shell_plugin_s3.md#s3provider)

### Properties

- [eventBus](kui_shell_plugin_s3.md#eventbus)

### Functions

- [addProviderInitializer](kui_shell_plugin_s3.md#addproviderinitializer)
- [getCurrentMounts](kui_shell_plugin_s3.md#getcurrentmounts)
- [minioConfig](kui_shell_plugin_s3.md#minioconfig)

## Type aliases

### ProviderInitializer

Ƭ **ProviderInitializer**: `Object`

#### Type declaration

| Name        | Type                                                                                                                                                                                                                                  |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mountName` | `string`                                                                                                                                                                                                                              |
| `init`      | (`repl`: `default`, `reinit?`: () => `void`) => [`S3Provider`](kui_shell_plugin_s3.md#s3provider) \| `Promise`<[`S3Provider`](kui_shell_plugin_s3.md#s3provider)\> \| `Promise`<[`S3Provider`](kui_shell_plugin_s3.md#s3provider)[]\> |

#### Defined in

[plugins/plugin-s3/src/providers/model.ts:43](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-s3/src/providers/model.ts#L43)

---

### S3Provider

Ƭ **S3Provider**: `ClientOptions` & { `bucketFilter?`: `BucketFilter` ; `directEndPoint?`: `string` ; `error?`: `Error` ; `isDefault?`: `boolean` ; `listBuckets?`: `ClientOptions` ; `mountName`: `string` ; `publicOnly?`: `boolean` ; `region?`: `string` ; `subdir?`: `string` ; `understandsFolders?`: `boolean` }

#### Defined in

[plugins/plugin-s3/src/providers/model.ts:23](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-s3/src/providers/model.ts#L23)

## Properties

### eventBus

• **eventBus**: `EventBus`

## Functions

### addProviderInitializer

▸ **addProviderInitializer**(`providerInitializers`): `void`

#### Parameters

| Name                   | Type                                                                  |
| :--------------------- | :-------------------------------------------------------------------- |
| `providerInitializers` | [`ProviderInitializer`](kui_shell_plugin_s3.md#providerinitializer)[] |

#### Returns

`void`

#### Defined in

[plugins/plugin-s3/src/providers/index.ts:35](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-s3/src/providers/index.ts#L35)

---

### getCurrentMounts

▸ **getCurrentMounts**(): [`Mount`](../interfaces/kui_shell_plugin_s3.Mount.md)[]

#### Returns

[`Mount`](../interfaces/kui_shell_plugin_s3.Mount.md)[]

a list of the providers, with info about mount status for each

#### Defined in

[plugins/plugin-s3/src/vfs/responders.ts:39](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-s3/src/vfs/responders.ts#L39)

---

### minioConfig

▸ **minioConfig**(`direct?`): `Promise`<[`MinioConfig`](../interfaces/kui_shell_plugin_s3.MinioConfig.md)\>

This takes the S3 providers that we know about, and produces a
model that can be fed into `mc alias set`. Special case: if this
user does not have a configured AWS provider (i.e. we have no AWS
S3 credentials for them), we will create an auth-less entry; this
will allow access to public AWS s3 buckets.

#### Parameters

| Name     | Type      | Default value |
| :------- | :-------- | :------------ |
| `direct` | `boolean` | `false`       |

#### Returns

`Promise`<[`MinioConfig`](../interfaces/kui_shell_plugin_s3.MinioConfig.md)\>

#### Defined in

[plugins/plugin-s3/src/vfs/responders.ts:96](https://github.com/mra-ruiz/kui/blob/76908b178/plugins/plugin-s3/src/vfs/responders.ts#L96)
