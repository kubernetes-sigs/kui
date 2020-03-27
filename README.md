# The Kui Framework for Graphical Terminals

[![Build Status](https://travis-ci.org/IBM/kui.svg?branch=master)](https://travis-ci.org/IBM/kui)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![codecov](https://codecov.io/gh/IBM/kui/branch/master/graph/badge.svg)](https://codecov.io/gh/IBM/kui)
[![Type Coverage](https://img.shields.io/endpoint.svg?url=https://us-south.functions.cloud.ibm.com/api/v1/web/kuishell_production/kui/badge.json?which=core)](https://us-south.functions.cloud.ibm.com/api/v1/web/kuishell_production/kui/typecov-model.json)

Kui offers a new development experience for building cloud-native
applications. By combining the power of familiar CLIs with
visualizations in high-impact areas, Kui enables you to manipulate
complex JSON and YAML data models, integrate disparate tooling, and
provides quick access to aggregate views of operational data.

## Quick Install

We offer prebuilt releases that offer Kubernetes support:

[Kui-MacOS.tar.bz2](https://macos-tarball.kui-shell.org) **|** [Kui-Linux-x64.zip](https://linux-zip.kui-shell.org) **|** [Kui-Win32-x64.zip](https://win32-zip.kui-shell.org)

To run Kui as a [kubectl plugin](https://kubernetes.io/docs/tasks/extend-kubectl/kubectl-plugins/)
(requires version 1.12+), first download Kui, unpack the download, and add the unpacked directory to your PATH.
For example, on MacOS, the steps would be:

```bash
curl -L https://macos-tarball.kui-shell.org/ | tar jxf -
export PATH=$PWD/Kui-darwin-x64:$PATH
kubectl kui get pods
```

After the final command, you should see a popup window listing pods in your current namespace.
**Note**: Windows support for operating as a kubectl plugin coming soon.

## Contributing

If you want to help, please take a look at our [guidelines](CONTRIBUTING.md) and [developer guide](docs/dev/README.md). If you want to develop your own custom client, using the Kui framework, check out the
[API docs](https://apidocs.kui-shell.org/).

## Kui is a CLI, with Visualizations on the Side

[![](docs/readme/images/kui-experience.gif)](docs/readme/images/kui-experience.gif)

Kui uses [Electron](https://electronjs.org) to provide you with an
augmented but CLI-focused development experience. By using Electron,
the same experience carries over, from local development on your
laptop, to a browser-based experience.

When running locally, you will have access to your filesystem and your
favorite terminal and text editor. To help with complex data, Kui
offers a suite of **visualizations**. You can gracefully flip between
the terminal and these visualizations, without having to switch to
your browser, log in, wait for pages to load, and navigate through
complex menu structures.

## Kui as a Tool Platform

Kui can form the basis for delivering CLI-driven GUI experiences. Here
are a few such uses of Kui:

- Apache OpenWhisk visualizations: [Oui](https://github.com/kui-shell/oui#readme)

If you want to create your own client, with a custom theme, custom
icons, and an enhanced set of commands, you can start here:

- [API documentation for authoring new commands](https://github.com/IBM/kui/wiki/Authoring-Kui-Plugins)
