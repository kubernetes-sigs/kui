# Kui Installation Guide

This page will help you to install and configure Kui. You have a few
installation options; pick the one that best suits your environment.

## Double-clickable app Download

You may opt to download an double-clickable platform binary. With this
option, you avoid having to worry about Node.js dependencies.
However, currently, you will not be able to use Kui from your favorite
terminal (such support should come soon); Kui's graphical shell offers
a command line experience.

[Kui-MacOS.tar.bz2](https://macos-tarball.kui-shell.org) **|** [Kui-Linux.zip](https://linux-zip.kui-shell.org)

_Coming soon: MacOS .dmg, Linux .deb, Linux .rpm, Windows .zip_

##### Example Download for MacOS double-clickable

> curl -L https://macos-tarball.kui-shell.org/ | tar jxf -  
> open Kui-darwin-x64/Kui.app

### Important Note on Unsigned Builds

Currently, the Kui double-clickable application builds are not
signed. Therefore, you will likely see a security warning the first
time you launch these Kui builds. If this is a show-stopper for you,
we understand! You may always choose to [git clone and
build](./dev/README.md) Kui yourself.

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

### Important Note

For using Kui as a kubectl plugin, we recommend using
[Kubernetes Visualization Client](https://github.com/kui-shell/plugin-kubeui).
We are in the process of transitioning to this repo, and it will be incorporated shortly.

## Setting up Kubernetes Authorization

If you have a KUBECONFIG environment variable defined in your
terminal, Kui will pick that up and run with it. If you are using Kui
in a browser context, you can use the command `k8s auth add` command
to inject your configuration YAML and PEM into browser's local
storage.

## Setting up OpenWhisk Authorization

If you are currently a user of Apache OpenWhisk, then your `.wskprops`
file is sufficient to get you started; you may skip over this
section. If you have _not_ yet configured your local environment for
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

- Return to the [README](../README.md)
