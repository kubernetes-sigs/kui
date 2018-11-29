# Shell Plugins

The Shell commands are implemented via plugins. This repository
includes a suite of plugins, located in the `app/plugins/` directory.

   - [Sample Plugin](sample-plugin/)
   - [Code Layout](#code-layout)
   - [Activating a New Plugin](#activating-a-new-plugin)
   - [Plugin API](#plugin-api)

If, in the process of development, you add, remove, or otherwise
change the way a command will map to plugins, you **must** re-execute
`(cd dist && node compile.js)`, and then reload the renderer process.

## Code Layout

Plugins must have two top-level files:

  - a `package.json`, which can also be used to import any npm dependencies required by the plugin
  - a `plugin.js` file

The names of these two files are important. Any other files can be named as you wish.

## Activating a new Plugin

To activate a new plugin, copy or symlink it so that it is placed in
the `app/plugins/modules` directory. Then, execute `(cd dist &&
node compile.js)` and reload or relaunch your Shell instance.

## Plugin API

A plugin consists of three parts, some optional.

  1. Registering as a listener for commands. This is done by calling

```javascript
commandTree.listen('/sample/echo', sayHello, { docs: 'Say hello!' })
```

  As a result of this registration, the Shell REPL will respond to `sample echo` with the return value of the `sayHello` handler.

  2. Command handlers. Handlers can return plain strings, which will
 then be printed in the CLI portion of the UI.

  More sophisticated examples can return Promises of values. If the
  value, or promise thereof, evaluates to a whisk entity, then the
  sidecar will be opened to show it.

  If you want the REPL only to print "ok", then `return true`. Lastly,
  if you want the REPL to print an error string in red text, then
  `throw new Error("error message")`

  3. Optionally, a plugin may also export a programmatic API. This API
     export is accomplished by returning a structure. For example:

```javascript
module.exports = (commandTree, prequire) => {
   return {
      sayHello: sayHello
   }
}
```

  Now, other plugins can programmatically invoke your features, rather
  than having to rely on a REPL-style of invocation. To import the
  programmatic API of some other plugin, use the `prequire` method. For example

```javascript
const sayHello = prequire('/wsk-sample-plugin').sayHello
```
