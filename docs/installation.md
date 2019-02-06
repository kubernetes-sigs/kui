# Kui Installation Guide

This page will help you to install and configure Kui. You have a few
installation options; pick the one that best suits your environment.

## Option 1: Lightweight Download

Kui offers a lightweight "headless" download option. The download is
small (2-4 megabytes) and can be used in headless
environments. Headless Kui will automatically download the graphical
components, so this option provides seamless transition to graphics,
and a lightweight, platform-neutral initial download.

**Prerequisites** the headless client require that you have Node.js
8.15.0 or greater already installed on your system.

[Kui-headless.tar.bz2](https://tarball.kui-shell.org) **|** [Kui-headless.zip](https://zip.kui-shell.org)

## Option 2: Double-clickable app Download

You may opt to download an double-clickable platform binary. With this
option, you avoid having to worry about Node.js dependencies.
However, currently, you will not be able to use Kui from your favorite
terminal (support coming soon); you can still use Kui's own command
line after launching the application.

[Kui-MacOS.tar.bz2](https://macos-tarball.kui-shell.org) **|** [Kui-Linux.zip](https://linux-zip.kui-shell.org) **|** [Kui-Windows.zip](https://win32-zip.kui-shell.org)

*Coming soon: MacOS .dmg, Linux .deb, Linux .rpm*

### Important Note on Unsigned Builds

Currently, the Kui double-clickable application builds are not
signed. Therefore, you will likely see a security warning the first
time you launch these Kui builds. If this is a show-stopper for you,
we understand! You may always choose to [git clone and
build](./dev/README.md) Kui yourself.

## Verifying your installation

The following terminal commands help to verify that Kui is
working.

```bash
export PATH=$PWD/kui/bin:$PATH
kui version
kui shell # <-- this should launch the graphical shell
```

The `shell` command should open the graphical shell. The first time
you open a graphical window, you should see a message indicating that
the graphical bits are being downloaded. This is a one-time download
of the Electron components. (*warning*: there is currently a
superficial bug in the downloader; you may see the "downloading"
message repeated twice)

If you have downloaded the double-clickable application, you can try
`version` from Kui's command line.

## Using Kui as a kubectl plugin

If you have a version of kubectl newer than 1.12, then you have the
option of using Kui as a [kubectl
plugin](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/).
Adding `$PWD/kui/bin` to your PATH will enable `kubectl` to find the
`kui` extension to `kubectl`. You may then execute kubernetes-related
commands via:

```bash
kubectl kui get pods --ui
```

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
