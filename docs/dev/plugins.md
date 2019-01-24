# Kui Plugins

The Kui commands are implemented via plugins. This repository
includes a suite of plugins, located in the `plugins/` directory.

   - [Sample Plugin](plugin-sample/)
   - [Code Layout](#code-layout)
   - [Activating a New Plugin](#activating-a-new-plugin)
   - [Plugin API](#plugin-api)

If, in the process of development, you add, remove, or otherwise
change the way a command will map to plugins, you **must** re-execute
`npm run compile`, and then reload the renderer process.

Plugins must be named as `plugin-` followed by any name you like. The prefix `plugin-` is very important.

## Code Layout

Plugins must have a top-level file:

  - a `package.json`, which can also be used to import any npm dependencies required by the plugin.

Plugins must have a top-level directory:

  - `src/`, which has all the TypeScript source code of the plugin.

Tests of the plugin must be placed in:

  - `src/test/{customized-test-unit-name}/` directory.

Any non-TypeScript code should be placed outside of `src/` directory.

For example:

```sh
plugin-sample/
├── src/
│   ├── test/
│   │   ├── sample-test1/
│   │   │   ├── test-command1.ts
│   │   │   └── test-command2.ts
│   │   └── sample-test2/
│   │       └── test-command3.ts
│   └── lib/
│       ├── command1.ts  
│       ├── command2.ts  
│       └── command3.ts  
│
├── tests/
│   ├── lib/
│       ├── lib1.js
│   │   └── lib2.js
│   └── data/
│       ├── data1.json
│       └── data2.js
│
├── package.json
│
... other files ...
```

## Activating a new Plugin

To activate a new plugin, copy or symlink it so that it is placed in
the `plugins/` directory. Then, execute `npm run compile` and reload or relaunch your Kui instance.

## Plugin API

A plugin consists of three parts, some optional.

  1. Registering as a listener for commands. This is done by calling

```typescript
commandTree.listen('/sample/echo', sayHello, { docs: 'Say hello!' })
```

  As a result of this registration, the Kui REPL will respond to `sample echo` with the return value of the `sayHello` handler.

  2. Command handlers. Handlers can return plain strings, which will
 then be printed in the CLI portion of the UI.

  More sophisticated examples can return Promises of values. If the
  value, or promise thereof, evaluates to a whisk entity, then the
  sidecar will be opened to show it.

  If you want the REPL only to print "ok", then `return true`. Lastly,
  if you want the REPL to print an error string in red text, then
  `throw new Error("error message")`

  Now, other plugins can programmatically invoke your features, rather
  than having to rely on a REPL-style of invocation. To import the
  programmatic API of some other plugin, use the `prequire` method. For example

```typescript
const sayHello = prequire('/wsk-sample-plugin').sayHello
```
