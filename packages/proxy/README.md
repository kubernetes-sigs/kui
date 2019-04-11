# The Kui Proxy

NOTE: Internal consumption only! Don't use this directly!

It is likely that your browser deployment will not have direct API
access to the backend API servers. This could be due to CORS
limitations, for example. To support this use case, Kui includes a
proxy server. Without the proxy in place, the Kubernetes and OpenWhisk
plugins will likely not be functional when serving Kui from a browser.


## The Design

The proxy design leverages a headless build of Kui, hosted in a docker
image, and fronted by a thin [express](https://expressjs.com/) routing
layer. The webpack build then communicates with the proxy to evaluate
the commands.

## Building the webpack client

Consult [the webpack
documentation](../kui-builder/dist/webpack/README.md) to learn
more about setting it up a webpack build.

## Configuring the Proxy Interchange

The webpack client communicates to the proxy via a configuration
currently defined in the `proxyServerConfig` variable located in
[proxy-executor.ts](../../plugins/plugin-proxy-support/src/lib/proxy-executor.ts). This
will be refined in the near future.

## Building the Proxy

The proxy is built into a docker image via:

```bash
npm install
./build.sh
```

This will create an image named kui-proxy.

## Running the Proxy

To run the proxy:

```bash
npm start
```

If you want to add debugging output, set a `DEBUG` environment variable to the value of your choosing:

```bash
DEBUG=* npm start
```
