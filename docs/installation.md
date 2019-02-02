# Installion Guide

This page will help you installing and configuring Kui. 

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
