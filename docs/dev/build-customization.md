# Kui Build Customization

If you wish to override the default build parameters, you have three
ways to do so. An override directory has this directory structure:

```json
my-overrides/
├── theme.json
├── config.json
├── env.json
├── icons/
├── images/
└── css/
   └── themes/
       └── my-theme.css
```

The first three JSON files consistute the three main components of a
build configuration.  The last three directories are optional, but
give you the opportunity to provide image, icon, and CSS assets that
are associated with your theme.

The top-level JSON files represent:

1. *Theme Overrides* via a `theme.json`. You may specify overrides of
   the [default
   theme](../../packages/kui-builder/defaults/themes/kui.json). For
   example, this [example
   theme](../../packages/kui-builder/examples/build-configs/material-design/theme.json)
   changes the product name to "Kui Fun Shell", and changes the UI
   theme to use a [material design](https://material.io/) color scheme.

2. *Env Overrides* via an `env.json`. It is less likely you would need
   to tweak this; these settings are intended to modify the directory
   structure of a deployed build.

3. *Inject Application Configuration Key-Values* via a `config.json`.
   This will give you the opportunity to inject
   configuration options into your plugin code. Using the
   [example config injection](../../packages/kui-builder/examples/build-configs/material-design/config.json) as an example,
   you would access that example configuration setting via:
   ```typescript
   import { config } from '@kui-shell/core/core/settings'

   if (config['disableProxy']) { ... }
   ```

To specify the override directory, define the `KUI_BUILD_CONFIG`
environment variable to point to your override directory. The
directory [example
overrides](../../packages/kui-builder/examples/build-configs/material-design)
offers an example.

## A webpack Example

To build a webpack image with the example "material" theme:

```bash
export KUI_BUILD_CONFIG=../../examples/build-configs/material-design
cd packages/kui-builder/dist/webpack
./build.sh
```

By default, this script will build using the [default
theme](../../packages/kui-builder/examples/build-configs/default/). By
specifying a value for `KUI_BUILD_CONFIG` you override this default
choice of build configuration.

In other words, the default behavior is equivalent to:

```bash
export KUI_BUILD_CONFIG=../../examples/build-configs/default
cd packages/kui-builder/dist/webpack
./build.sh
```
