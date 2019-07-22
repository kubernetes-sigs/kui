# Crafting a Custom Kui Client

To develop a client, you have two choices. First, you may fork this
repository and populate `clients/my-client`, using [the default
client](../../clients/default) as a starting point. Second, you may
develop your client externally to this repository. For more
information on development choice, please consult the [custom client
guide](custom-clients.md).

The remainder of this document describes how to customize your client.
You may customize the configuration of your clients in several ways:

- choose a subset of previously published plugins to incorporate
- implement new plugins
- specify a custom theme
- inject build-time configuration parameters into the running clients

The directory structure of a custom client will look something like this:

```bash
my-kui
├── plugins/
│   └── my-plugin/
├── theme/
│   ├── theme.json
│   ├── css/
│   ├── icons/
│   └── images/
```

The last three subdirectories are optional. They give you the
opportunity to provide assets, such as your custom icon, that are
associated with your theme.

## Setup

To get started making your custom Kui client, follow this
template:

```bash
mkdir my-kui && cd my-kui
npm init -y
npm install --save-dev @kui-shell/builder
npm install --save @kui-shell/core
npx kui-init
```

You may mix in additional Kui plugins by adding more `npm install --save` lines. For example, a useful plugin is
`@kui-shell/core-support` which adds the help system and the
screenshot capability to the electron builds. You now should have a
directory structure such as shown above.

## Build and Distribution

Next, to build one or more clients:

```bash
npx kui-build-headless
npx kui-build-electron
npx kui-build-webpack
```

These, respectively, will populate:

```bash
dist
├── electron/
├── headless/
│   └── MyKui-headless.tar.bz2
└── webpack/
```

For example, after building a headless client, you may try:

```bash
tar jxf dist/headless/Kui-headless.tar.bz2
./kui/bin/kui sample hello
hello world
```

## Theming

In `theme.json, you may specify overrides of the [default
theme](../../clients/default/theme/theme.json). For example, this
[example
theme](../../packages/kui-builder/examples/build-configs/material-design/theme.json)
changes the product name to "Kui Fun Shell", and changes the UI
theme to use a [material design](https://material.io/) color
scheme.

## Injecting Custom CSS

You may inject custom CSS files into the index.html build. In your
`theme.json`, define the variable `css` as either a string or an array
of strings. Each string may be either a reference to a file inside of
your `theme/css/` subdirectory, or to a remote URL.

```json
{
  "css": ["my.css", "https://my.cdn.com/my.css"]
}
```

In this example, the former will retrieve a file from
`theme/css/my.css`, and the latter will result in your custom client
fetching the remote CSS file.

If you wish to inject a CSS file only during test execution, preface
the file name with `_test`, e.g. `_test.css`.

## Injecting Build-time Values

Via a `config.json`, you have the opportunity to inject
configuration options into your plugin code. Using the
[example config injection](../../packages/kui-builder/examples/build-configs/material-design/config.json) as an example,
you would access that example configuration setting via:

```typescript
import { config } from '@kui-shell/core/core/settings'

if (config['proxyServer']['enabled']) { ... }
```
