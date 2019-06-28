# Packaging up Kui

Beyond local development of Kui, you may want to package and
distribute Kui to others. The code base currently supports three
packaging modes:

- [Headless](#headless-packaging) &mdash; making a lightweight headless release
- [Electron](#electron-packaging) &mdash; building an Electron client app
- [Browser](#browser-packaging) &mdash; building for the browser, using [webpack](https://webpack.js.org/)

## Headless packaging

```bash
> cd clients/default # or: cd clients/[your-customized-client]
> npm run build:headless
> ls dist/headless
Kui-headless.tar.bz2 Kui-headless.zip
```

## Electron packaging

Kui uses
[electron-packager](https://github.com/electron-userland/electron-packager)
for the heavy lifting. The `electron-packager` npm supports building
for Windows, macOS, and Linux. When building an Electron distribution,
the script by default will build for all three platforms.

```bash
> cd clients/default # or: cd clients/[your-customized-client]
> npm run build:electron [target]
> ls dist/electron
Kui-darwin-x64.dmg Kui-darwin-x64.tar.bz2 Kui-win32-x64.zip Kui-linux-x64.tar.bz2
```

To test out builds on your laptop, you may wish only to build for one
platform. You can do so by adding a `target` option, which is one of
`win32`, `mac`, or `linux`. If you only want the Electron
double-clickable, and not the distributables (e.g. the `dmg` and `zip`
files), set the `NO_INSTALLER=true` environment variable when
executing `build.sh`.

## Browser packaging

To build for use in a browser, Kui uses
[webpack](https://webpack.js.org/).

Option A) Build webpack with [proxy support](../../packages/proxy/doc/proxy-architecture.pdf).

```bash
> cd clients/default  # or: cd clients/[your-customized-client]
> npm run build:proxy
> npm run build:webpack # including proxy-related support by default
> ls dist/webpack
... lots of *.bundle.js.br files ...
```

Option B) Build webpack without proxy support

```bash
> cd clients/default  # or: cd clients/[your-customized-client]
> KUI_USE_PROXY=false npm run build:webpack
> ls dist/webpack
... lots of *.bundle.js.br files ...
```

The first time you do so, you will be asked to set up a local https
certificate. You should see the normal openssl series of prompts; make
sure that you provide at least one non-empty answer to the self-signed
certificate prompts, otherwise it will fail in odd ways.

After you have built the webpack bundles, you can test them out
locally:

```bash
> npx kui-run-proxy # only necessary when you need proxy support and you've built the proxy
> npx kui-run-webpack
Visit this url:
https://localhost:9080
```

## Internal Details

See: [Internal Development Details](../../packages/kui-builder/README.md).
