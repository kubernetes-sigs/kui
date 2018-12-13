# Installion Guide

This page will help you installing and configuring Kui. 

## Downloading Kui

We offer both a tarball and a zip download. Choose the one that works
best for your platform; if you can use either, we suggest the tarball,
as it is a smaller download. In either case, the initial download is
small: 2-3 megabytes.

### Download the tarball

```bash
curl -sL https://tarball.kui-shell.org | tar jxf -
```

### Downloading the zip

```bash
curl -sL https://zip.kui-shell.org -o kui.zip
```

### Verifying your installation

```bash
export PATH=kui/bin:$PATH
kubectl kui version
kubectl kui shell
```

Adding `kui/bin` to your PATH will enable `kubectl` to find the `kui`
extension to `kubectl`. The last two commands will validate that `kui`
is installed properly; the last one should open a graphical Electron
window.

## Setting up Kubernetes Authorization

If you have a KUBECONFIG environment variable defined in your
terminal, Kui will pick that up and run with it. In a browser context,
you can use the command `k8s auth add` command to inject your
configuration YAML and PEM into the browser local storage.

## Setting up OpenWhisk Authorization

If you are currently a user of OpenWhisk, then your `.wskprops` file
is sufficient to get you started; you may skip over this section. If
you have *not* yet configured your local environment for use with
OpenWhisk, then continue reading.

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

- [Examples of using Kui with Kubernetes](./kubernetes.md)
- [Examples of using Kui with Apache OpenWhisk](./openwhisk.md)
- [Examples of using Kui with Apache Composer](./composer.md)
- Return to the [README](../README.md)
