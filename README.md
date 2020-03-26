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

These clients leverage the core framework hosted in this repository,
combined with the Kubernetes plugins hosted
[here](https://github.com/kui-shell/plugin-kubeui). Visit the [Kui
Installation Guide](docs/installation.md) for installation details and
alternative installation options.

## Contributing

If you want to help, please take a look at our [guidelines](CONTRIBUTING.md) and [developer guide](docs/dev/README.md). If you want to develop your own custom client, using the Kui framework, check out the
[API docs](https://apidocs.kui-shell.org/).

## The Kui Experience

[![Kui screenshot](docs/readme/images/kubectl-examples.jpg)](https://youtu.be/jcV0csyzGdY)

Click the image to see [Kui in
motion](https://youtu.be/jcV0csyzGdY). For more of the backstory of
Kui, read on!

## This is a CLI, with Visualizations on the Side

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

For example, to see a visual summary of your Kubernetes pods, issue
this command from your favorite terminal:

| Example Command        | Thumbnail of Output                                                                               |
| :--------------------- | :------------------------------------------------------------------------------------------------ |
| `kubectl kui get pods` | [![](docs/readme/images/kubectl-get-pods-thumbnail.jpg)](docs/readme/images/kubectl-get-pods.png) |

Without the `--ui` option, Kui will display the output in your
terminal directly; you will observe that the output is identical to
that of `kubectl`, with the possible addition of syntax
coloration. With Kui, you have the power to navigate between these
modes in a graceful and flexible manner.

<a href="https://ibm.box.com/shared/static/55gasbz9fc40qrg43iq4b8t1uckupft4.gif">
    <img align="right" alt="kubectl get pods drilldown animated gif" src="docs/readme/images/kubectl-get-pods-thumbnail.gif"></img>
</a>

Now try clicking on a row. You should see the "sidecar" sweep in from
the right. This split screen mode allows you to drill down to the
details of your pods. You can click on one, then another, for rapid
inspection of several of your resources. The animated gif should give
you a sense of the possibilities (click on it to see a larger
version).

## Kui as a Tool Platform

Kui can form the basis for delivering CLI-driven GUI experiences. Here
are a few such uses of Kui:

- Apache OpenWhisk visualizations: [Oui](https://github.com/kui-shell/oui#readme)

If you want to create your own client, with a custom theme, custom
icons, and an enhanced set of commands, you can start here:

- [Clone and own a boilerplate repo](https://github.com/kui-shell/plugin-kubectl-boilerplate)
- [API documentation for authoring new commands](https://github.com/IBM/kui/wiki/Authoring-Kui-Plugins)
- [Some older documentation](docs/dev/custom-clients.md); we will be consolidating this into the newer docs.
