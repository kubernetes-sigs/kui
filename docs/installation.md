# Installion Guide

This page will help you installing and configuring Kui.

## Prerequisites
**Kui Headless Builds** require Node 8.15.0 or greater.
( To install on your machine, consult the official [NodeJS documentation](https://nodejs.org) .)

You are free to download **Kui Electron Builds** ( [Linux zip](https://linux-zip.kui-shell.org),
[macOS tarball](https://macos-tarball.kui-shell.org),
[win32 zip](https://win32-zip.kui-shell.org) ), which don't require Node.js.

**Note**: Kui Electron Builds are unsigned builds, so you will probably see security warning. They are not as fast as headless builds, and also will result in a "dock bounce" every time you execute a headless build. We don't support terminal access for Kui Electron Builds for now.

## Downloading Kui

We offer both a tarball and a zip download. Choose the one that works
best for your platform; if you can use either, we suggest the tarball,
as it is a smaller download. In either case, the initial download is
small: 2-3 megabytes.

### Getting the tarball

```bash
curl -sL https://tarball.kui-shell.org | tar jxf -
```

### Getting the zip

```bash
curl -sL https://zip.kui-shell.org -o kui.zip
unzip kui.zip
```

### Verifying your installation

```bash
export PATH=$PWD/kui/bin:$PATH
kui version
kui shell
```

These commands validate that `kui` is installed properly: the second
line should print a semver-like version, and the third line should
open a graphical Electron window. The first time you open a graphical
window, you should see a message indicating that the graphical bits
are being downloaded. This is a one-time download of the Electron
components.

(warning: there is currently a superficial bug in the downloader; you
may see the "downloading" message repeated twice)

## Using Kui as a kubectl plugin

If you have a versin of kubectl newer than 1.12, then you have the
option of using Kui as a [kubectl
plugin](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/).
Adding `$PWD/kui/bin` to your PATH will enable `kubectl` to find the
`kui` extension to `kubectl`. You may then execute kubernetes-related
commands via:

```bash
kubectl kui get pods --ui
```

Compare this with the equivalent non-plugin usage of the Kui
kubernetes commands:

```bash
kui kubectl get pods --ui
```

It is your choice. The two usage modes will, as far as kubernetes
commands are concerned, cover the same set of functionality.

## Setting up Kubernetes Authorization

If you have a KUBECONFIG environment variable defined in your
terminal, Kui will pick that up and run with it. If you are using Kui
in a browser context, you can use the command `k8s auth add` command
to inject your configuration YAML and PEM into browser's local
storage.

## Setting up OpenWhisk Authorization

If you are currently a user of Apache OpenWhisk, then your `.wskprops`
file is sufficient to get you started; you may skip over this
section. If you have *not* yet configured your local environment for
use with OpenWhisk, then continue reading.

### Getting an Authorization Key for IBM Cloud

In order to acquire the necessary authorization key, first ensure that
you have
[installed the `ibmcloud` tool](https://console.bluemix.net/docs/cli/index.html#overview);
the older `bluemix/bx` tool will also suffice for this purpose. Then:

```
ibmcloud target --cf
ibmcloud plugin install cloud-functions
ibmcloud wsk list
```

## Next Steps

- [Examples of Kui with Kubernetes](./kubernetes.md)
- [Examples of Kui with Apache OpenWhisk](./openwhisk.md)
- [Examples of Kui with Apache Composer](./composer.md)
- Return to the [README](../README.md)
