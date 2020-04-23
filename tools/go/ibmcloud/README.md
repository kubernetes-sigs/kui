# ibmcloud CLI Plugin for Kui

This directory offers Kui as a plugin to the [`ibmcloud` CLI](https://clis.ng.bluemix.net).

## Prebuilt Binaries

> Coming Soon

## Usage

For example:

```bash
ibmcloud kui kubectl get pods
```

## Building the Plugin Yourself

If you wish to develop the plugin, first
download and install the Bluemix CLI. See instructions [here](https://clis.ng.bluemix.net).

The plugin is written in [go](https://golang.org/), and depends on go
1.12+. To compile the plugin, you may leverage the Makefile:

```bash
$ make
```

This should produce a binary `kui-ibmcloud-plugin`. You may then
install the plugin:

```bash
$ make install
```

To run unit tests:

```bash
$ make test
```

### Building for multiple platforms

If you wish to build for all supported Electron platforms, you may leverage the

```bash
$ make build_all
```
