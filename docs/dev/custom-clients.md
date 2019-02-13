# Developing a Custom Kui Client

To develop a custom Kui client, you have two choices. First, you may
fork this repository and populate e.g. `clients/my-client`, using [the
default client](../../clients/default) as a starting point. Second,
you may develop your client externally to this repository.

## Developing a client within the Kui repo

If you go this route, you can add plugins of your own by placing them
in the top-level [plugins](../../plugins) directory. It will be more
difficult for you to exclude the plugins that are part of this
repository; there is currently no way to selectively exclude these
plugins. To build clients in this "monorepo" mode, and assuming you
have already cloned-and-owned the default client:

```bash
cd clients/my-client
npm run build:headless
npm run build:electron
npm run build:webpack
```

You needn't build all three flavors of clients; this example is
intended to enumerate the commands.

### Developing a client externally

The advantage of developing your client externally to the main Kui
repository lies in the power you have to pick and choose the plugins,
and plugin versions, you would like to be part of your client. For
example, if you would like to include only the [kubernetes
plugin](../../plugins/plugin-k8s), and bundle some of our own plugins
on top, this is an easy possibility:

```bash
mkdir my-client && cd my-client
npm init -y
npm install --save-dev @kui-shell/builder
npm install --save @kui-shell/core
npm install --save @kui-shell/plugin-k8s
npx kui-init
```

These are all one-time tasks. If you would like to add or delete
plugins in the future, or pin versions of these, you would use normal
`npm` commands to manage the node modules. After this initial setup
step, you are ready to build your clients:

```bash
npx kui-build-headless
npx kui-build-electron
npx kui-build-webpack
```

As above, you needn't build all three flavors of clients; this example
is intended to enumerate the commands.

## Next Steps: Customize!

Now that you have made a decision on how to develop a custom Kui
client, you are ready to begin making customization choices. For more
information on customizing your client, please consult the
[customization guide](customization-guide).
