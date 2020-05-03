# User Guide

If you have downloaded one of the [pre-built Electron
releases](https://github.com/IBM/kui#installation), double click to
launch Kui. From there, you can use Kui as a normal terminal, with
graphical enhancements. For example, try `kubectl -h`, and you can see
how Kui enhances the help system of `kubectl`.

## Using Kui as a kubectl plugin

You may also use this prebuilt image as a `kubectl` plugin. After
downloading and unpacking Kui, add the unpacked directory to your
PATH. You should now be able to launch Kui from your favorite
terminal. For example, to list your Kubernetes pods:

```sh
kubectl kui get pods
```

Kui also includes graphical enhancements for
[krew](https://github.com/kubernetes-sigs/krew), the Kubernetes plugin
manager: the `krew list`, and `krew info` commands, for example. If
you wish to contribute there, first consult the Developer Guide. Then,
check out the source to the existing krew enhancements, which are
located
[here](https://github.com/IBM/kui/tree/master/plugins/plugin-kubectl/krew).

# Developer Guide

We welcome your contributions! The Kui developer guide is currently
located on the [wiki](https://github.com/IBM/kui/wiki).

## Component Libraries

Kui currently supports Carbon Components and (partially) PatternFly
v4. If you wish to add support for a new component library, or augment
the current support, [read more](./components.md).
