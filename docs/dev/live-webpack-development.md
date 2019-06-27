# Live Development of Webpack Clients

If your main target client is the browser, rather than a
double-clickable Electron application, read on. Rather than having to
build a full webpack client on every change, you may run an
incremental webpack build environment.

- [I am developing an external custom client](#as-an-external-client)
- [I am developing as a fork of the main kui repo](#from-the-monorepo)

In either case, once you have the incremental builder running, you can
visit `http://localhost:9080`. If you would like to use a different
port, then make sure the environment variable `KUI_PORT` is set prior
to launching the watcher.

## As an external client

Assuming that you have already configured an external custom client
([read more](custom-clients.md#developing-a-client-externally)), you
would issue these commands:

```
npm install @kui-shell/webpack
npx kui-watch-webpack
```

## From the monorepo

If you are developing a client as a fork of the main Kui monorepo,
then use this command, from the top level of your kui clone:

```
WEBPACK=true npm install
npm run watch:webpack
```

The first command is needed because, by default, an `npm install` does
not install the rather large webpack dependencies.
